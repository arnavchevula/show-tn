import { scrapeVenue } from "../scraper/core";
import { whistlerConfig } from "../config/whistler";

export default defineEventHandler(async(event) => {
    console.log("whistler");
    try {
        const scraped = await scrapeVenue(whistlerConfig);
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
