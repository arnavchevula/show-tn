import { validateSecret } from "./utils/auth";
import { scrapeVenue } from "../scraper/core";
import { wildHareConfig } from "../config/wild-hare";

export default defineEventHandler(async(event) => {
    validateSecret(event);
    try {
        const scraped = await scrapeVenue(wildHareConfig);
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
