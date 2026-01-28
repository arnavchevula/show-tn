import { scrapeVenue } from "../scraper/core";
import { californiaClipperConfig } from "../config/california-clipper";

export default defineEventHandler(async(event) => {
    console.log("california-clipper");
    try {
        const scraped = await scrapeVenue(californiaClipperConfig);
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
