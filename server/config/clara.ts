import { VenueConfig, SelectorConfig } from "../scraper/types";

export const claraConfig: VenueConfig = {
    name: 'clara',
    displayName: 'Clara',
    url: 'https://www.clarachicago.com/events',
    selectors: {
        eventList: '[data-hook="event-list-item"]',
        title: '[data-hook="ev-list-item-title"]',
        date: '[data-hook="ev-date"]',
        venue: '',
        doorsTime: '',
        showTime: '',
        image: 'img',
        support: '',
        headliners: '',
        url: '[data-hook="ev-rsvp-button"]',
        header: '',
        subtitle: ''
    } as SelectorConfig,
    imageExtractor: 'src',
}
