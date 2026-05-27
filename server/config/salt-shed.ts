import { VenueConfig, SelectorConfig } from "../scraper/types";

export const saltShedConfig: VenueConfig = {
    name: 'salt-shed',
    displayName: 'The Salt Shed',
    url: 'https://www.saltshedchicago.com/home#shows',
    region: 'Northwest Side',
    neighborhood: 'Bucktown',
    selectors: {
    eventList: 'article.ve-events__card',
    title: 'h3.ve-events__card-title',                                                                                                                                                                                           
    date: '.ve-events__card-date',                                                                                                                                                                                              
    doorsTime: '.ve-events__card-time',                                                                                                                                                                                         
    showTime: '.ve-events__card-time',                                                                                                                                                                                          
    image: 'img',                                                                                                                                                                                             
    url: 'a.ve-events__card-cta',                                                                                                                                                                                               
    genre:['indie','pop','electronic','rock']
    } as SelectorConfig,
    imageExtractor: 'style',


}