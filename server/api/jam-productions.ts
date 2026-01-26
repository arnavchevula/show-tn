import { load } from 'cheerio';
import puppeteerCore from 'puppeteer-core';
import puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium';
import type { Event } from '../../types/event.d.ts';
import { DateParser } from './utils/date.js';
import { DBConnection } from '../db/db';
import { v4 as uuidv4 } from 'uuid';



export default defineEventHandler(async(event) => {
    console.log("jam productions");
    let shows:Event[] = [];
    const dateParser = new DateParser();
    const db = new DBConnection().connect();

    function parseDate (date:string) {
        const dateArr = date.split(' ').filter((elem)=> elem!='');
        return dateParser.parseRawDate(`${dateArr[0]} ${dateArr[1]}`)
    }

    try {
        // Launch the browser and open a new blank page.
        // Use regular puppeteer for local dev, puppeteer-core + chromium for production
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
        await page.goto('https://www.jamusa.com/events');

        const html = await page.content()
        const $ = load(html);
        
        $('#list .eventItem').each((i,elm)=>{

            const header = $(elm).find('.promotion-text').text();
            const title = $(elm).find('.title').text();
            const venue = $(elm).find('.location').text();
            const headliners = $(elm).find('.title').text();
            const support = $(elm).find('.promotion-text .tour').text();
            const doorsTime = $(elm).find('.time').text();
            const showTime = $(elm).find('.time').text();
            const subtitle = $(elm).find('.promotion-text').text();
            const age = $(elm).find('.age').text();
            const price = $(elm).find('.prices-age .price').text();
            const date = $(elm).find('.date').text();
            const parsedDate = parseDate(date);
            const image = $(elm).find('img .thumb').attr('src');
            const url = $(elm).find('tickets onsalenow').attr('href');
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
                date: date,
                parsedDate: parsedDate,
                image: image,
                url: url,
                source: 'jam-productions'
                } as Event)
        });
        await browser.close();
        await db.from('events').delete().eq('source', 'jam-productions');
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
  