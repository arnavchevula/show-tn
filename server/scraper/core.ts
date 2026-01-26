import { VenueConfig, ScrapeResult } from "./types";
import { launchBrowser, getPageHtml } from "./browser";
import { DateParser } from "../api/utils/date";
import { Event } from "~~/types/event";
import { v4 as uuidv4 } from 'uuid';
import { load } from 'cheerio';
import { DBConnection } from "../db/db";


export async function scrapeVenue(config: VenueConfig): Promise<ScrapeResult> { 
    console.log("scrape venue");                                                                                                                             
    const browser = await launchBrowser();                                                                                                                                                                      
                                                                                                                                                                                                                
    try {                                                                                                                                                                                                       
      const html = await getPageHtml(browser, config.url);                                                                                                                                                      
      const events = extractEvents(html, config);     
      console.log("return back to scrapeVenue",events.length);                                                                                                                                                          
      await saveEvents(events, config.name);                                                                                                                                                                    
                                                                                                                                                                                                                
      return { content: events, status: 'success', count: events.length };                                                                                                                                      
    } catch (error) {                                                                                                                                                                                           
      return { content: null, status: 'error', message: error.message };                                                                                                                                        
    } finally {                                                                                                                                                                                                 
      await browser.close();                                                                                                                                                                                    
    }                                                                                                                                                                                                           
  }                                                                                                                                                                                                             
                                                                                                                                                                                                                
  function extractEvents(html: string, config: VenueConfig): Event[] {       
    console.log("extract events")                                                                                                                                   
    const $ = load(html);                                                                                                                                                                               
    const dateParser = new DateParser();                                                                                                                                                                        
    const events: Event[] = [];                                                                                                                                                                                 
    console.log(config);                                                                                                                                                                                    
    $(config.selectors.eventList).each((i, elm) => {                                                                                                                                                                                    
        events.push({                                                                                                                                                                                           
          id: uuidv4(),                                                                                                                                                                                         
          title: extractTitle($, elm, config),                                                                                                                                             
          date: extractDate($, elm, config, dateParser),                                                                                                                                                                                                                                                                                                
          source: config.name,                 
          header: extractHeader($, elm, config),
          venue: extractVenue($, elm, config),
          headliners: $(elm).find(config.selectors.headliners).text().trim(),
          support: $(elm).find(config.selectors.support).text().trim(),
          doorsTime: extractShowTime($, elm, config),
          showTime: $(elm).find(config.selectors.showTime).text().trim(),
          subtitle: $(elm).find(config.selectors.subtitle).text().trim(),
          parsedDate: extractDate($, elm, config, dateParser),
          age: $(elm).find(config.selectors.age).text().trim() || '21+',
          image: extractImage($,elm,config),
          url: $(elm).find(config.selectors.url).attr('href')?.trim()
        });                                                                                                                                                                                                     
      });                                                                                                                                                                                                       
      console.log("end of extraction",events.length);
    return events;                                                                                                                                                                                              
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
      console.log(combinedDateAndTime);
      console.log(combinedDateAndTimeArr);
      console.log("dateString: ", dateString);
      return dateParser.parseRawDate(dateString);    
      }
    const dateString = $(elm).find(config.selectors.date).text().trim();
    return dateParser.parseRawDate(dateString);    
 
  }

  function extractShowTime($: any, elm: any, config: VenueConfig) {
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
    return config.name;
  }

  function extractHeader($: any, elm: any, config: VenueConfig) {
    if (config.selectors.header) {
      return $(elm).find(config.selectors.header).text().trim()
    }
    return `${config.name} presents: `;
  }

  function extractTitle($: any, elm: any, config: VenueConfig): string {
    let title = $(elm).find(config.selectors.title).text().trim();
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
    const tableName = process.env.TABLE_NAME || 'events-qa'  
    console.log("tableName: ", tableName);     
    console.log("source: ", source);            
    await db.from(tableName).delete().eq('source', source);                                                                                                                                                      
    const{error, data} = await db.from(tableName).insert(events);     
    console.log("error: ", error);
    console.log("data: ", data);                                                                                                                                                                
  }                                