import { validateSecret } from "./utils/auth";
import { scrapeVenue } from "../scraper/core";
import { thaliaHallConfig } from "../config/thalia-hall";

export default defineEventHandler(async(event) => {
    console.log("thalia hall");
    const body = await readBody(event);
    validateSecret(body);
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
  