import { validateSecret } from "./utils/auth";
import { scrapeVenue } from "../scraper/core";
import { smokeAndMirrorsConfig } from "../config/smoke-and-mirrors";

export default defineEventHandler(async(event) => {
    console.log("smoke-and-mirrors");
    const body = await readBody(event);
    validateSecret(body);
    try {
        const scraped = await scrapeVenue(smokeAndMirrorsConfig);
        const shows = scraped?.content;
        return {
            shows
        }
    }
    catch (error) {
        console.error('Scraping error: ', error);
        return {
            content: null,
            status: `error`,
            message: error instanceof Error ? error.message : 'Unknown error'
        }
    }
})
