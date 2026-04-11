import { VenueConfig, SelectorConfig } from "../scraper/types";

export const cafeMustacheConfig: VenueConfig = {
    name: 'cafe-mustache',
    displayName: 'Cafe Mustache',
    url: 'https://cafemustache.com/',
    region: 'Northwest Side',
    neighborhood: 'Logan Square',
    selectors: {
        eventList: '',
        title: '',
        venue: '',
        date: '',
        doorsTime: '',
        showTime: '',
        image: '',
        support: '',
        headliners: '',
        url: '',
        header: '',
        subtitle: '',
        price: '',
    } as SelectorConfig,
    genreTags:['indie','experimental'],
    imageExtractor: 'src',
}
