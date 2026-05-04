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

// Formats a millisecond timestamp into a readable time string like "9pm" or "8:30pm"
function formatShowTime(ms: number): string {
    const d = new Date(ms);
    const hours = d.getHours();
    const minutes = d.getMinutes();
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
            const startDt = new Date(e.startDate);
            const endDt = new Date(e.endDate);
            const showHour = startDt.getHours();
            const showMin = startDt.getMinutes();
            const showTimeStr = formatShowTime(e.startDate);

            // Walk day-by-day from startDate to endDate (both inclusive),
            // producing one show record per night for multi-night runs
            const cursor = new Date(startDt);
            cursor.setHours(showHour, showMin, 0, 0);
            const lastNight = new Date(endDt);
            lastNight.setHours(showHour, showMin, 0, 0);

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

                cursor.setDate(cursor.getDate() + 1);
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
