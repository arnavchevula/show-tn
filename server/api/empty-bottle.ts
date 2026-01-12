import { load } from 'cheerio';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import type { Event } from '../../types/event.d.ts';
import { DateParser } from './utils/date';
import { DBConnection } from '../db/db';
import { v4 as uuidv4 } from 'uuid';



export default defineEventHandler(async(event) => {
    console.log("empty bottle")
    const dateParser = new DateParser();
    const db = new DBConnection().connect();

    let shows:Event[] = [];
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
        await page.goto('https://www.emptybottle.com/');

        const html = await page.content()
        const $ = load(html);
        
        $('#widget-full-feed .eb-item').each((i,elm)=>{

            const header = $(elm).find('.title').text();
            const title = $(elm).find('.title').text();
            const venue = $(elm).find('.venue').text();
            const headliners = $(elm).find('.performing').text();
            const support = $(elm).find('.performing').text();
            const doorsTime = $(elm).find('.date-time-outer .start-time').text();
            const showTime = $(elm).find('.date-time-outer .start-time').text();
            const subtitle = $(elm).find('.title').text();
            const date = $(elm).find('.date-time-outer .date').text()
            const parsedDate = dateParser.parseRawDate(date);
            const image = $(elm).find('.item-image-inner').attr('style')?.match(/url\(["']?(.*?)["']?\)/)[1];
            const url = $(elm).find('a .buy-button').attr('href');

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
                date: date,
                parsedDate: parsedDate,
                age: '21+',
                image: image,
                url: url

                } as Event)
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
  