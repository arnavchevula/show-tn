import { scrapeVenue } from "../scraper/core";
import { doriansConfig } from "../config/dorians";

export default defineEventHandler(async(event) => {
    console.log("dorians");
    try {
        const scraped = await scrapeVenue(doriansConfig);
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
