import { validateSecret } from "./utils/auth";
import { scrapeVenue } from "../scraper/core";
import { avondaleMusicHall } from "../config/avondale-music-hall";

export default defineEventHandler(async(event) => {
    console.log("avondale-music-hall");
    const body = await readBody(event);
    validateSecret(body);
    try {
        const scraped = await scrapeVenue(avondaleMusicHall);
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
