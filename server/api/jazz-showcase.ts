import { validateSecret } from "./utils/auth";
import { DBConnection } from "../db/db";
import { generateStableId } from '../utils/stableId';
import { Event } from '~~/types/event';

const SOURCE = 'jazz-showcase';
const COLLECTION_URL = 'https://www.jazzshowcase.com/nowplaying?format=json';

interface SquarespaceEvent {
    title: string;
    startDate: number;
    endDate: number;
    fullUrl: string;
    assetUrl?: string;
}

// Extracts date/time components in Chicago local time from a UTC ms timestamp.
// Necessary because Netlify servers run in UTC; without this, 8pm CDT becomes 1am UTC (next day).
function getChicagoParts(ms: number) {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Chicago',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false,
    }).formatToParts(new Date(ms));
    return {
        year:    Number(parts.find(p => p.type === 'year')!.value),
        month:   Number(parts.find(p => p.type === 'month')!.value) - 1, // 0-indexed
        day:     Number(parts.find(p => p.type === 'day')!.value),
        hours:   Number(parts.find(p => p.type === 'hour')!.value) % 24, // hour12:false can yield 24
        minutes: Number(parts.find(p => p.type === 'minute')!.value),
    };
}

function formatShowTime(ms: number): string {
    const { hours, minutes } = getChicagoParts(ms);
    const ampm = hours >= 12 ? 'pm' : 'am';
    const h = hours % 12 || 12;
    const m = minutes === 0 ? '' : `:${String(minutes).padStart(2, '0')}`;
    return `${h}${m}${ampm}`;
}

export default defineEventHandler(async (event) => {
    validateSecret(event);
    try {
        const data: any = await fetch(COLLECTION_URL).then(r => r.json());
        // upcoming contains all future events — no pagination needed for upcoming
        const upcoming: SquarespaceEvent[] = data.upcoming ?? [];

        const shows: Event[] = [];

        for (const e of upcoming) {
            const startParts = getChicagoParts(e.startDate);
            const endParts = getChicagoParts(e.endDate);
            const showTimeStr = formatShowTime(e.startDate);

            // Walk day-by-day from Chicago start date to Chicago end date (both inclusive),
            // producing one show record per night for multi-night runs.
            // Use Date.UTC so the server's local timezone (UTC on Netlify) doesn't affect date arithmetic.
            const cursor = new Date(Date.UTC(startParts.year, startParts.month, startParts.day));
            const lastNight = new Date(Date.UTC(endParts.year, endParts.month, endParts.day));

            while (cursor <= lastNight) {
                const nightDate = new Date(cursor);
                shows.push({
                    id: generateStableId(SOURCE, nightDate, e.title),
                    title: e.title,
                    date: nightDate.toISOString(),
                    parsedDate: nightDate,
                    source: SOURCE,
                    neighborhood: 'South Loop',
                    region: 'Downtown',
                    venue: 'Jazz Showcase',
                    header: '',
                    headliners: '',
                    support: '',
                    doorsTime: '',
                    showTime: showTimeStr,
                    subtitle: '',
                    age: '',
                    image: e.assetUrl ?? '',
                    url: `https://www.jazzshowcase.com${e.fullUrl}`,
                    price: '',
                    genreTags: ['jazz'],
                } as Event);

                cursor.setUTCDate(cursor.getUTCDate() + 1);
            }
        }

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
    }
});
