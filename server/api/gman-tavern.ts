import { scrapeVenue } from "../scraper/core";
import { gmanTavernConfig } from "../config/gman-tavern";

export default defineEventHandler(async(event) => {
    console.log("gman-tavern");
    try {
        const scraped = await scrapeVenue(gmanTavernConfig);
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
