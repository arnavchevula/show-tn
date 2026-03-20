import { scrapeVenue } from "../scraper/core";
import { avondaleMusicHall } from "../config/avondale-music-hall";

export default defineEventHandler(async(event) => {
    console.log("avondale-music-hall");
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
