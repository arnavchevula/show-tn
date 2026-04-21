import { validateSecret } from "./utils/auth";
import { scrapeVenue } from "../scraper/core";
import { moesCantinnaWrigleyvilleConfig } from "../config/moes-cantina-wrigleyville";

export default defineEventHandler(async(event) => {
    validateSecret(event);
    try {
        const scraped = await scrapeVenue(moesCantinnaWrigleyvilleConfig);
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
