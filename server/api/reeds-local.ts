import { validateSecret } from "./utils/auth";
import { launchBrowser, getPageHtml } from "../scraper/browser";
import { DBConnection } from "../db/db";
import { load } from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import { reedsLocalConfig } from "../config/reeds-local";

const SOURCE = 'reeds-local';

export default defineEventHandler(async (event) => {
    validateSecret(event);
    const browser = await launchBrowser();
    try {
        const html = await getPageHtml(browser, reedsLocalConfig.url, 'td.simcal-day-has-events');
        const $ = load(html);
        const shows = [];

        $('td.simcal-day-has-events').each((_, cell) => {
            $(cell).find('li.simcal-event').each((_, ev) => {
                const title = $(ev).children('span.simcal-event-title').first().text().trim();
                const isoDate = $(ev).find('span.simcal-event-start-time').attr('content') ?? '';
                const showTime = $(ev).find('span.simcal-event-start-time').text().trim();
                const parsedDate = isoDate ? new Date(isoDate) : new Date();
                const url = reedsLocalConfig.url;

                shows.push({
                    id: uuidv4(),
                    title,
                    date: parsedDate.toISOString(),
                    parsedDate,
                    source: SOURCE,
                    neighborhood: reedsLocalConfig.neighborhood,
                    region: reedsLocalConfig.region,
                    venue: reedsLocalConfig.displayName,
                    header: '',
                    headliners: '',
                    support: '',
                    doorsTime: '',
                    showTime,
                    subtitle: '',
                    age: '21+',
                    image: '',
                    url,
                    price: '',
                });
            });
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
    } finally {
        await browser.close();
    }
});
