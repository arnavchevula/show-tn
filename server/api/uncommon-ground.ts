import { validateSecret } from "./utils/auth";
import { scrapeVenue } from "../scraper/core";
import { uncommonGroundConfig } from "../config/uncommon-ground";

export default defineEventHandler(async(event) => {
    validateSecret(event);
    try {
        const scraped = await scrapeVenue(uncommonGroundConfig);
        const shows = scraped?.content;
        return {
            shows
        }
    }
    catch (error) {
        return {
            content: null,
            status: `error`,
            message: error instanceof Error ? error.message : 'Unknown error'
        }
    }
})
