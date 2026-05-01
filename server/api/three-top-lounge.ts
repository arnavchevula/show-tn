import { validateSecret } from "./utils/auth";
import { scrapeVenue } from "../scraper/core";
import { threeTopLoungeConfig } from "../config/three-top-lounge";

export default defineEventHandler(async(event) => {
    validateSecret(event);
    try {
        const scraped = await scrapeVenue(threeTopLoungeConfig);
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
