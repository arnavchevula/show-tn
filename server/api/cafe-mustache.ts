import { validateSecret } from "./utils/auth";
import { DBConnection } from "../db/db";
import { v4 as uuidv4 } from 'uuid';

const CALENDAR_ID = 'stachebooking@gmail.com';
const SOURCE = 'cafe-mustache';

export default defineEventHandler(async (event) => {
    validateSecret(event);
    try {
        const apiKey = process.env.GOOGLE_CALENDAR_API_KEY;
        if (!apiKey) throw new Error('GOOGLE_CALENDAR_API_KEY is not set');

        const now = new Date().toISOString();
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${apiKey}&timeMin=${now}&singleEvents=true&orderBy=startTime&maxResults=100`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Google Calendar API error: ${response.status}`);

        const data = await response.json();

        const shows = (data.items ?? []).map((item: any) => {
            const start = item.start?.dateTime ?? item.start?.date;
            const parsedDate = new Date(start);

            return {
                id: uuidv4(),
                title: item.summary?.trim() ?? '',
                description: item.description?.trim() ?? '',
                date: parsedDate.toISOString(),
                parsedDate,
                doorsTime: '',
                showTime: item.start?.dateTime
                    ? parsedDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
                    : '',
                venue: 'Cafe Mustache',
                source: SOURCE,
                neighborhood: 'Logan Square',
                region: 'Northwest Side',
                url: item.htmlLink ?? '',
                image: '',
                age: '',
                header: '',
                subtitle: '',
                support: '',
                headliners: '',
                price: '',
            };
        });

        const db = new DBConnection().connect();
        const tableName = process.env.DB_NAME || 'events-qa';
        await db.from(tableName).delete().eq('source', SOURCE);
        await db.from(tableName).insert(shows);

        return { shows };
    } catch (error) {
        return {
            content: null,
            status: 'error',
            message: error instanceof Error ? error.message : 'Unknown error',
        };
    }
});
