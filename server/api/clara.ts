import { scrapeVenue } from "../scraper/core";
import { claraConfig } from "../config/clara";

export default defineEventHandler(async(event) => {
    console.log("clara");
    try {
        const scraped = await scrapeVenue(claraConfig);
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
