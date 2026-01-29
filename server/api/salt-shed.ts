import { scrapeVenue } from "../scraper/core";
import { saltShedConfig } from "../config/salt-shed";

export default defineEventHandler(async(event) => {
    console.log("salt-shed");
    try {
        const scraped = await scrapeVenue(saltShedConfig);
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
