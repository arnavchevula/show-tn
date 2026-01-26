import { scrapeVenue } from "../scraper/core";
import { colesConfig } from "../config/coles";

export default defineEventHandler(async(event) => {
    console.log("coles");
    try {
        const scraped = await scrapeVenue(colesConfig);
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
