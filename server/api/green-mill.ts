// Checks that the request carries the shared secret, rejecting unauthorized callers
import { validateSecret } from "./utils/auth";
// launchBrowser starts a headless Chrome instance; getPageHtml navigates to a URL and returns the rendered HTML
import { launchBrowser, getPageHtml } from "../scraper/browser";
// DBConnection wraps the Supabase client
import { DBConnection } from "../db/db";
// Cheerio's load() parses an HTML string into a jQuery-like $ object
import { load } from 'cheerio';
// Produces a deterministic ID from (source, date, title) so the same show always gets the same ID across runs
import { generateStableId } from '../utils/stableId';
// Shared Event type used across all scrapers
import { Event } from '~~/types/event';

// Identifier stored on every show row so we know which scraper produced it
const SOURCE = 'green-mill';
// The calendar page that lists all upcoming shows
const URL = 'https://greenmilljazz.com/calendar/';

// Nuxt server route handler — runs when POST /api/green-mill is called
export default defineEventHandler(async (event) => {
    // Throw 401 if the Authorization header doesn't match NUXT_TASK_SECRET
    validateSecret(event);
    // Open a headless browser (local Chrome in dev, @sparticuz/chromium in prod)
    const browser = await launchBrowser();
    try {
        // Navigate to the calendar page and wait until an event link appears in the DOM before returning the HTML
        const html = await getPageHtml(browser, URL, 'a[href*="/events/"]');
        // Parse the HTML string so we can query it with CSS selectors
        const $ = load(html);
        // Accumulates all scraped shows before the DB write
        const shows: Event[] = [];

        // The calendar renders as a table; each day cell looks like:
        // <td> > <div id="calblock"> > <div class="caldate"><a href="...">day</a></div> + <ul><li>event</li>...</ul>
        // Select every <ul> that contains at least one event link (skips empty/filler cells)
        $('ul:has(a[href*="/events/"])').each((_, ul) => {
            // The immediate parent of <ul> is <div id="calblock">, which also holds the date link
            const parent = $(ul).parent(); // <div id="calblock">

            // The date link lives inside <div class="caldate">
            // Its href is /events/YYYY-MM-DD/ when multiple shows share a day,
            // or /events/slug-YYYY-MM-DD/ when only one show is listed (the link goes straight to the event)
            const dateHref = parent.find('.caldate a').first().attr('href') ?? '';
            // Extract the ISO date string from wherever it appears in the href
            const dateInHref = dateHref.match(/(\d{4}-\d{2}-\d{2})/);
            // Skip this cell if no date can be found (e.g. header/spacer cells)
            if (!dateInHref) return;
            // Use noon local time to avoid the date shifting due to timezone offsets
            const parsedDate = new Date(`${dateInHref[1]}T12:00:00`);
            // Skip if the date string turned out to be invalid
            if (isNaN(parsedDate.getTime())) return;

            // Each <li> inside the <ul> is one show on this day
            $(ul).find('li').each((_, li) => {
                // The first event link in the <li> is the show title link (share buttons come after it)
                const a = $(li).find('a[href*="/events/"]').first();
                // Raw title may include a leading time range like "(8pm - midnight) BAND NAME"
                const rawTitle = a.text().trim();
                // Strip the leading "(time)" prefix to get just the act name; fall back to rawTitle if nothing remains
                const title = rawTitle.replace(/^\([^)]*\)\s*/, '').trim() || rawTitle;
                // Absolute URL to the individual event page
                const eventUrl = a.attr('href') ?? URL;

                // Time and price live in <div id="caltime">8:00pm - 12:00am<br />$10 cover</div>
                // Get the inner HTML so we can split on <br> before tags are stripped
                const caltimeHtml = $(li).find('#caltime').html() ?? '';
                // Split on <br> (handles self-closing <br/> and <br />) to separate the two lines
                const caltimeParts = caltimeHtml
                    .split(/<br\s*\/?>/i)
                    // Strip any remaining HTML tags (e.g. stray spans) and trim whitespace
                    .map(s => s.replace(/<[^>]+>/g, '').trim())
                    // Drop empty strings left by trailing <br>s
                    .filter(Boolean);
                // First line is always the time range
                const showTime = caltimeParts[0] ?? '';
                // Find the line that mentions a dollar amount or the word "free"
                const price = caltimeParts.find(l => /\$|free/i.test(l)) ?? '';

                shows.push({
                    // Stable hash so repeated runs upsert rather than duplicate
                    id: generateStableId(SOURCE, parsedDate, title),
                    title,
                    // ISO string stored in DB
                    date: parsedDate.toISOString(),
                    // JS Date object used for in-memory sorting/filtering before the DB write
                    parsedDate,
                    source: SOURCE,
                    neighborhood: 'Uptown',
                    region: 'Northside',
                    venue: 'Green Mill',
                    header: '',
                    headliners: '',
                    support: '',
                    doorsTime: '',
                    showTime,
                    subtitle: '',
                    age: '',
                    image: '',
                    url: eventUrl,
                    price,
                    genreTags: ['jazz'],
                } as Event);
            });
        });

        // Open a Supabase connection
        const db = new DBConnection().connect();
        // Target table name comes from env so the same code can hit QA or prod
        const tableName = process.env.DB_NAME || 'events-qa';
        // Archive table keeps a permanent record even after shows are deleted from the live table
        const archiveTableName = process.env.ARCHIVE_DB_NAME || 'archived-events-qa';
        // Write to archive first (never deletes rows)
        await db.from(archiveTableName).upsert(shows, { onConflict: 'id' });
        // Upsert into the live table — existing rows are updated, new ones are inserted
        await db.from(tableName).upsert(shows, { onConflict: 'id' });
        // Collect the IDs we just upserted so we can prune stale rows
        const newIds = shows.map(s => s.id);
        if (newIds.length > 0) {
            // Delete any rows from this source whose ID was not in today's scrape (i.e. cancelled/past shows)
            await db.from(tableName).delete().eq('source', SOURCE).not('id', 'in', `(${newIds.join(',')})`);
        }

        // Return the scraped shows so the Netlify function can log the count
        return { shows };
    } catch (error) {
        // Return a structured error instead of throwing so the Netlify function can log it cleanly
        return {
            content: null,
            status: 'error',
            message: error instanceof Error ? error.message : 'Unknown error',
        };
    } finally {
        // Always close the browser, even if an error was thrown, to avoid orphaned Chrome processes
        await browser.close();
    }
});
