import { scrapeVenue } from "../scraper/core";
import { cobraLoungeConfig } from "../config/cobra-lounge";

export default defineEventHandler(async(event) => {
    console.log("cobra-lounge");
    try {
        const scraped = await scrapeVenue(cobraLoungeConfig);
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
