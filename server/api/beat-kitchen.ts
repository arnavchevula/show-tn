import { load } from 'cheerio';
import puppeteerCore from 'puppeteer-core';
import puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium';
import { DateParser } from './utils/date';
import { Event } from '~~/types/event';
import { DBConnection } from '../db/db';
import { v4 as uuidv4 } from 'uuid';


export default defineEventHandler(
    async(event) => {
    console.log("beat kitchen")
    // const body = await readBody(event);
    // const secretKey = useRuntimeConfig().taskSecret;
    // if (!secretKey) {
    //   throw createError({
    //     statusCode: 500,
    //     statusMessage: "Secret must be set",
    //   });
    // }
  
    // if (body.secret !== secretKey) {
    //   throw createError({
    //     statusCode: 401,
    //     statusMessage: "Unauthorized",
    //   });
    // }
    let shows:Event[] = [];
    const dateParser = new DateParser();
    const db = new DBConnection().connect();

    try {
        // Launch the browser and open a new blank page.
        const isProduction = process.env.PRODUCTION || process.env.AWS_LAMBDA_FUNCTION_NAME;
        const browser = isProduction === 'true'
            ? await puppeteerCore.launch({
                args: chromium.args,
                executablePath: await chromium.executablePath(),
                headless: chromium.headless,
            })
            : await puppeteer.launch({
                executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                headless: true,
            });
        const page = await browser.newPage();

        // Navigate the page to a URL.
        await page.goto('https://beatkitchen.com');

        const html = await page.content()
        const $ = load(html);
        
        $('#filtered-events-list li').each((i,elm)=>{

            const header = $(elm).find('.event-header').text();
            const title = $(elm).find('.event-title').text();
            const venue = $(elm).find('.venue').text();
            const headliners = $(elm).find('.headliners').text();
            const support = $(elm).find('.supporting-talent').text();
            const doorsTime = $(elm).find('.doortime-showtime .door-time').text();
            const showTime = $(elm).find('.doortime-showtime .event-time').text();
            const subtitle = $(elm).find('.subtitle').text();
            const age = $(elm).find('.prices-age .ages').text();
            const price = $(elm).find('.prices-age .price').text();
            const genre = $(elm).find('.genre').text();
            const date = $(elm).find('.event-date').text()
            const parsedDate = dateParser.parseRawDate(date);
            const image =  $(elm).find('.seetickets-list-view-event-image').attr('src');

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
                source: 'beat-kitchen'
                } as Event)
        });
        await browser.close();
        await db.from('events').delete().eq('source', 'beat-kitchen');
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
}
);
  