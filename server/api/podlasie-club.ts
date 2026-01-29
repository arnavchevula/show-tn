import { scrapeVenue } from "../scraper/core";
import { podlasieClubConfig } from "../config/podlasie-club";

export default defineEventHandler(async(event) => {
    console.log("podlasie-club");
    try {
        const scraped = await scrapeVenue(podlasieClubConfig);
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
