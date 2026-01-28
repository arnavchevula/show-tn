import { scrapeVenue } from "../scraper/core";
import { smartbarConfig } from "../config/smartbar";

export default defineEventHandler(async(event) => {
    console.log("smartbar");
    try {
        const scraped = await scrapeVenue(smartbarConfig);
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
