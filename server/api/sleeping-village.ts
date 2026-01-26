import { scrapeVenue } from "../scraper/core";
import { sleepingVillageConfig } from "../config/sleeping-village";

export default defineEventHandler(async(event) => {
    console.log("sleeping-village");
    try {
        const scraped = await scrapeVenue(sleepingVillageConfig);
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
