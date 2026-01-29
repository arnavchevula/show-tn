import { scrapeVenue } from "../scraper/core";
import { lemonConfig } from "../config/lemon";

export default defineEventHandler(async(event) => {
    console.log("lemon");
    try {
        const scraped = await scrapeVenue(lemonConfig);
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
