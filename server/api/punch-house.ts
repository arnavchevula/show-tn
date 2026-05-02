import { validateSecret } from "./utils/auth";
import { scrapeVenue } from "../scraper/core";
import { punchHouseConfig } from "../config/punch-house";

export default defineEventHandler(async(event) => {
    validateSecret(event);
    try {
        const scraped = await scrapeVenue(punchHouseConfig);
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
