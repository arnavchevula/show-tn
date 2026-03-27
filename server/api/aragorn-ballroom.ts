import { validateSecret } from "./utils/auth";
import { scrapeVenue } from "../scraper/core";
import { aragornBallroom } from "../config/aragorn-ballroom";

export default defineEventHandler(async(event) => {
    console.log("aragorn-ballroom");
    const body = await readBody(event);
    validateSecret(body);
    try {
        const scraped = await scrapeVenue(aragornBallroom);
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
