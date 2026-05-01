import { VenueConfig, SelectorConfig } from "../scraper/types";

export const threeTopLoungeConfig: VenueConfig = {
    name: 'three-top-lounge',
    displayName: 'Three Top Lounge',
    url: 'https://www.threetoploungechicago.com/',
    region: 'Northwest Side',
    neighborhood: 'Bucktown',
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
        url: 'a.buy-button',
        header: '.title',
        subtitle: '.title',
    } as SelectorConfig,
    genreTags: ['indie', 'pop', 'alternative', 'rock'],
    imageExtractor: 'style',
    additionalEventLists: ['#widget-coming-up .eb-item'],
}
