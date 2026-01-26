import { VenueConfig, SelectorConfig } from "../scraper/types";

export const bottomLounge: VenueConfig = {
    name: 'bottom-lounge',
    displayName: 'Bottom Lounge',
    url: 'https://bottomlounge.com/events/',
    selectors: {
        eventList: '.tw-plugin-upcoming-event-list .container .tw-section',
        title: '.tw-name',
        venue: '.tw-venue-name',
        date: '.tw-date-time',
        doorsTime: '',
        showTime: '',
        image: 'img',
        support: '.tw-opening-act',
        headliners: '',
        url: 'a',
        header: '',
        subtitle: '',
        price: '',
        combinedDateAndTime: '.tw-date-time'
    } as SelectorConfig,
    imageExtractor: 'src',
}
