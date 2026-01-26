import { scrapeVenue } from "../scraper/core";
import { chopShopConfig } from "../config/chop-shop";

export default defineEventHandler(async(event) => {
    console.log("chop-shop");
    try {
        const scraped = await scrapeVenue(chopShopConfig);
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
