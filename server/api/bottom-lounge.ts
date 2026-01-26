import { scrapeVenue } from "../scraper/core";
import { bottomLounge } from "../config/bottom-lounge";

export default defineEventHandler(async(event) => {
    console.log("bottom-lounge");
    try {
        const scraped = await scrapeVenue(bottomLounge);
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
