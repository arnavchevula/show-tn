import { load } from 'cheerio';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { DateParser } from './utils/date';
import { DBConnection } from '../db/db';
import { v4 as uuidv4 } from 'uuid';



type LHSTEvent = {
    id: any
    header?: string
    title: string
    subtitle?: string
    date: string
    price?: string
    venue: string
    doorsTime: string
    showTime: string
    age?: string
    genre?: string
    image?: string
    support?: string,
    headliners?:string,
    url?: string;
}

export default defineEventHandler(async(event) => {
    console.log("lh-st")
    let shows:LHSTEvent[] = [];
    const dateParser = new DateParser();
    const db = new DBConnection().connect();

    try {
        // Launch the browser and open a new blank page.
        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });
        const page = await browser.newPage();

        // Navigate the page to a URL.
        await page.goto('https://lh-st.com');

        const html = await page.content()
        const $ = load(html);
        
        $('.tessera-card-deck .tessera-show-card').each((i,elm)=>{

            const header = $(elm).find('.event-header').text();
            const title = $(elm).find('.card-title').text();
            const venue = $(elm).find('.tessera-venue').text();
            const headliners = $(elm).find('.card-title').text();
            const support = $(elm).find('.tessera-additionalArtists').text();
            const doorsTime = $(elm).find('.tessera-doorsTime').text();
            const showTime = $(elm).find('.tessera-showTime').text();
            const subtitle = $(elm).find('.subtitle').text();
            const age = $(elm).find('.showAges').text();
            const price = $(elm).find('.prices-age .price').text();
            const genre = $(elm).find('.genre').text();
            const date = $(elm).find('.tessera-date').text()
            const parsedDate = dateParser.parseRawDate(date);
            const image = $(elm).find('.card-img-top').attr('src');
            const url = $(elm).find('a').attr('href');

            shows.push({
                id: uuidv4(), 
                header: header, 
                title:title, 
                venue: venue,
                headliners: headliners, 
                support: support,
                doorsTime: doorsTime,
                showTime: showTime, 
                subtitle: subtitle,
                age: age,
                price: price,
                genre: genre,
                date: date,
                parsedDate: parsedDate,
                image: image,
                url: url

                } as LHSTEvent)
        });
        await browser.close();
        const { error } = await db.from('events').insert(shows) 
        console.log("db error:", error);
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
  