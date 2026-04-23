import { validateSecret } from "./utils/auth";
import { scrapeVenue } from "../scraper/core";
import { montroseSaloonConfig } from "../config/montrose-saloon";

export default defineEventHandler(async(event) => {
    validateSecret(event);
    try {
        const scraped = await scrapeVenue(montroseSaloonConfig);
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
