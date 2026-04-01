import { validateSecret } from "./utils/auth";
import { scrapeVenue } from "../scraper/core";
import { chopShopConfig } from "../config/chop-shop";

export default defineEventHandler(async(event) => {
    validateSecret(event);
    try {
        const scraped = await scrapeVenue(chopShopConfig);
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
