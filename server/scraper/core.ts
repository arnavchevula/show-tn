import { VenueConfig, ScrapeResult } from "./types";
import { launchBrowser, getPageHtml } from "./browser";
import { DateParser } from "../api/utils/date";
import { Event } from "~~/types/event";
import { v4 as uuidv4 } from 'uuid';
import { load } from 'cheerio';
import { DBConnection } from "../db/db";


export async function scrapeVenue(config: VenueConfig): Promise<ScrapeResult> { 
    const browser = await launchBrowser();                                                                                                                                                                      
                                                                                                                                                                                                                
    try {                                                                                                                                                                                                       
      const html = await getPageHtml(browser, config.url, config.selectors.eventList, config.waitUntil);                                                                                                                                                      
      const events = extractEvents(html, config);     
      await saveEvents(events, config.name);                                                                                                                                                                    
                                                                                                                                                                                                                
      return { content: events, status: 'success', count: events.length };                                                                                                                                      
    } catch (error) {                                                                                                                                                                                           
      return { content: null, status: 'error', message: error.message };                                                                                                                                        
    } finally {                                                                                                                                                                                                  
      await browser.close();                                                                                                                                                                                    
    }                                                                                                                                                                                                           
  }                                                                                                                                                                                                             
                                                                                                                                                                                                                
  function extractEvents(html: string, config: VenueConfig): Event[] {       
    const $ = load(html);   
    const dateParser = new DateParser();                                                                                                                                                                        
    const events: Event[] = [];                                                                                                                                                                                 
      
      try {
        const selectors = [config.selectors.eventList, ...(config.additionalEventLists ?? [])];
        for (const selector of selectors) {
          $(selector).each((i, elm) => {
            events.push({
              id: uuidv4(),
              title: extractTitle($, elm, config),
              date: extractDate($, elm, config, dateParser),
              source: config.name,
              neighborhood: config.neighborhood,
              region: config.region,
              header: extractHeader($, elm, config),
              venue: extractVenue($, elm, config),
              headliners: $(elm).find(config.selectors.headliners).text().trim(),
              support: $(elm).find(config.selectors.support).text().trim(),
              doorsTime: extractShowTime($, elm, config),
              showTime: config.showTimeExtractor ? config.showTimeExtractor($, elm) : $(elm).find(config.selectors.showTime).text().trim(),
              subtitle: $(elm).find(config.selectors.subtitle).text().trim(),
              parsedDate: extractDate($, elm, config, dateParser),
              age: $(elm).find(config.selectors.age).text().trim() || '21+',
              image: extractImage($,elm,config),
              url: extractUrl($, elm, config),
              secondaryUrl: extractSecondaryUrl($, elm, config),
              genre: $(elm).find(config.selectors.genre).text().trim(),
              description: $(elm).find(config.selectors.description).text().trim(),
              genreTags:config.genreTags
            });
          });
        }

      }
      catch (error) {
        console.log("error: ", error)
      }
    const seen = new Set<string>();
    return events.filter(e => {
      const key = e.url || `${e.title}__${e.date}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });                                                                                                                                                                                              
  }                                                                                                                                                                                                             
  function extractImage($: any, elm: any, config: VenueConfig):      
  string | undefined {                                                          
    const $img = $(elm).find(config.selectors.image);                           
                                                                                
    if (config.imageExtractor === 'src') {                                      
      return $img.attr('src')?.trim();                                          
    }                                                                           
                                                                                
    const style = $img.attr('style');                                           
    return style?.match(/url\(["']?(.*?)["']?\)/)?.[1];                         
  }      
  
  function extractDate($: any, elm: any, config: VenueConfig, dateParser:DateParser) {
    if (config.selectors.day || config.selectors.month) {
        const month = $(elm).find(config.selectors.month).text().trim()
        const day = $(elm).find(config.selectors.day).text().trim()
        const dateString = `${month} ${day}`;
        return dateParser.parseRawDate(dateString);
    }
    else if (config.selectors.combinedDateAndTime) {
      const combinedDateAndTime = $(elm).find(config.selectors.date).text().replace(/\s+/g, " ").trim();
      const combinedDateAndTimeArr = combinedDateAndTime.split(" ");
      const month = combinedDateAndTimeArr[1];
      const day = combinedDateAndTimeArr[2];
      const dateString = `${month} ${day}`;
      return dateParser.parseRawDate(dateString);    
      }
    let dateString = $(elm).find(config.selectors.date).text().trim();
    if (config.datePreprocess) dateString = config.datePreprocess(dateString);
    return dateParser.parseRawDate(dateString);    
 
  }

  function extractShowTime($: any, elm: any, config: VenueConfig) {
    if (config.doorsTimeExtractor) {
      return config.doorsTimeExtractor($, elm);
    }
    if (config.selectors.combinedDateAndTime) {
      const combinedDateAndTime = $(elm).find(config.selectors.doorsTime).text().trim();
      const combinedDateAndTimeArr = combinedDateAndTime.split(" ");
      const showtime = combinedDateAndTimeArr[3];
      return showtime;
    }
    return $(elm).find(config.selectors.doorsTime).text().trim()

  }

  function extractVenue($: any, elm: any, config: VenueConfig) {
    if (config.selectors.venue) {
      return $(elm).find(config.selectors.venue).text().trim()
    }
    return config.displayName;
  }

  function extractHeader($: any, elm: any, config: VenueConfig) {
    if (config.selectors.header) {
      return $(elm).find(config.selectors.header).text().trim()
    }
    return `${config.displayName} presents: `;
  }

  function extractSecondaryUrl($: any, elm: any, config: VenueConfig): string | undefined {
    if (!config.selectors.secondaryUrl) return config.fallbackUrl;
    const href = $(elm).find(config.selectors.secondaryUrl).attr('href')?.trim();
    return href || config.fallbackUrl;
  }

  function extractUrl($: any, elm: any, config: VenueConfig): string | undefined {
    const href = config.selectors.url
      ? $(elm).find(config.selectors.url).attr('href')
      : $(elm).attr('href');
    if (!href) return undefined;
    return config.baseUrl ? `${config.baseUrl}${href}`.trim() : href.trim();
  }

  function extractTitle($: any, elm: any, config: VenueConfig): string {

    let title = $(elm).find(config.selectors.title).text().trim();
    if (!title && config.selectors.titleFallback) {
      title = $(elm).find(config.selectors.titleFallback).first().text().trim();
    }
    if (config.titleExclude) {
      for (const exclude of config.titleExclude) {
        title = title.replace(exclude, '');
      }
      title = title.trim();
    }
    return title;
  }
  async function saveEvents(events: Event[], source: string): Promise<void> {
    const db = new DBConnection().connect();
    const tableName = process.env.DB_NAME || 'events-qa'

    // Archive before deleting — preserves past events so shared /event/:id links never go dead
    const archiveTableName = process.env.ARCHIVE_DB_NAME || 'archived-events-qa'
    await db.from(archiveTableName).upsert(events, { onConflict: 'id' });

    await db.from(tableName).delete().eq('source', source);
    const { error } = await db.from(tableName).insert(events);
  }                                