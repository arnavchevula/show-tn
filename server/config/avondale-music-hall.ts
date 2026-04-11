import { VenueConfig, SelectorConfig } from "../scraper/types";

export const avondaleMusicHall: VenueConfig = {
    name: 'avondale-music-hall',
    displayName: 'Avondale Music Hall',
    url: 'https://www.avondalemusichall.com/events-1',
    region: 'Northwest Side',
    neighborhood: 'Avondale',
    selectors: {
        eventList: '[data-hook="events-card"]',
        title: '[data-hook="title"]',
        date: '[data-hook="short-date"]',
        venue: '',
        doorsTime: '',
        showTime: '',
        image: 'img',
        support: '',
        headliners: '',
        url: 'a',
        header: '',
        subtitle: '',
    } as SelectorConfig,
    genreTags:['hip-hop/rap', 'indie','electronic'],
    imageExtractor: 'src',
}
