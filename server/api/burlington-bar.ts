import { validateSecret } from "./utils/auth";
import { launchBrowser, getPageHtml } from "../scraper/browser";
import { DateParser } from "./utils/date";
import { DBConnection } from "../db/db";
import { load } from 'cheerio';
import { generateStableId } from '../utils/stableId';
import { burlingtonBarConfig } from "../config/burlington-bar";

const SOURCE = 'burlington-bar';

export default defineEventHandler(async (event) => {
    validateSecret(event);
    const browser = await launchBrowser();
    try {
        const html = await getPageHtml(browser, burlingtonBarConfig.url, burlingtonBarConfig.selectors.eventList);
        const $ = load(html);
        const dateParser = new DateParser();

        const monthYearText = $('.yui3-calendar-header-label').first().text().trim();
        const [monthName, year] = monthYearText.split(' ');

        const shows = $('td.has-event').map((_, elm) => {
            const day = $(elm).find('div.marker-daynum').text().trim();
            const title = $(elm).find('span.item-title').text().trim();
            const doorsTime = $(elm).find('span.item-time').text().trim();
            const href = $(elm).find('a.item-link').attr('href') ?? '';
            const url = href ? `${burlingtonBarConfig.baseUrl}${href}` : '';
            const parsedDate = dateParser.parseRawDate(`${monthName} ${day}`);

            return {
                id: generateStableId(SOURCE, parsedDate, title),
                title,
                date: parsedDate.toISOString(),
                parsedDate,
                source: SOURCE,
                neighborhood: burlingtonBarConfig.neighborhood,
                region: burlingtonBarConfig.region,
                venue: burlingtonBarConfig.displayName,
                header: '',
                headliners: '',
                support: '',
                doorsTime,
                showTime: '',
                subtitle: '',
                age: '21+',
                image: '',
                url,
                price: '',
            };
        }).get();

        const db = new DBConnection().connect();
        const tableName = process.env.DB_NAME || 'events-qa';
        const archiveTableName = process.env.ARCHIVE_DB_NAME || 'archived-events-qa';
        await db.from(archiveTableName).upsert(shows, { onConflict: 'id' });
        await db.from(tableName).upsert(shows, { onConflict: 'id' });
        const newIds = shows.map(s => s.id);
        if (newIds.length > 0) {
            await db.from(tableName).delete().eq('source', SOURCE).not('id', 'in', `(${newIds.join(',')})`);
        }

        return { shows };
    } catch (error) {
        return {
            content: null,
            status: 'error',
            message: error instanceof Error ? error.message : 'Unknown error',
        };
    } finally {
        await browser.close();
    }
});
