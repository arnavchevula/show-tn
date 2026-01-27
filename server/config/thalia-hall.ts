import { VenueConfig, SelectorConfig } from "../scraper/types";

export const thaliaHallConfig: VenueConfig = {
    name: 'thalia-hall',
    displayName: 'Thalia Hall',
    url: 'https://www.thaliahallchicago.com/',
    selectors: {
    eventList: '#widget-full-feed .eb-item',
    eventItem: 'eb-item',
    title: '.title',                                                                                                                                                                                           
    date: '.date-time-outer .date',                                                                                                                                                                                              
    venue: '.venue',                                                                                                                                                                                             
    doorsTime: '.date-time-outer .start-time',                                                                                                                                                                                         
    showTime: '.date-time-outer .start-time',                                                                                                                                                                                          
    image: '.item-image-inner',                                                                                                                                                                                             
    support: '.performing',                                                                                                                                                                                           
    headliners: '.performing',                                                                                                                                                                                        
    url: 'a .buy-button',                                                                                                                                                                                               
    header: '.title',                                                                                                                                                                                            
    subtitle: '.title',   

    } as SelectorConfig,
    imageExtractor: 'style',


}