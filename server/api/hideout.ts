import { scrapeVenue } from "../scraper/core";
import { hideoutConfig } from "../config/hideout";

export default defineEventHandler(async(event) => {
    console.log("hideout");
    try {
        const scraped = await scrapeVenue(hideoutConfig);
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
