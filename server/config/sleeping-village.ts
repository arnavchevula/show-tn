import { VenueConfig, SelectorConfig } from "../scraper/types";

export const sleepingVillageConfig: VenueConfig = {
    name: 'sleeping-village',
    displayName: 'Sleeping Village',
    url: 'https://sleeping-village.com/events/',
    selectors: {
    eventList: '.listings-block-list__wrapper  .listings-block-list__listing',
    eventItem: '.listings-block-list__listing',
    title: '.listing__title',                                                                                                                                                                                           
    date: '.listing-date-time',                                                                                                                                                                                              
    venue: '.listing__venue',                                                                                                                                                                                             
    doorsTime: '.listing-date-time',                                                                                                                                                                                         
    showTime: 'listing-date-time',                                                                                                                                                                                          
    image: '.listing__image img',                                                                                                                                                                                             
    support: '.listing__title',                                                                                                                                                                                           
    headliners: '.listing__title',                                                                                                                                                                                        
    url: 'a .plotButton--secondary',                                                                                                                                                                                               
    header: '.listing__title',                                                                                                                                                                                            
    subtitle: '.listing__title',   
    combinedDateAndTime: '.listing-date-time'
    } as SelectorConfig,
    imageExtractor: 'src',


}