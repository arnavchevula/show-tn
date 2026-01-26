import { scrapeVenue } from "../scraper/core";
import { thaliaHallConfig } from "../config/thalia-hall";

export default defineEventHandler(async(event) => {
    console.log("thalia hall");
    try {
        const scraped = await scrapeVenue(thaliaHallConfig);
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
  