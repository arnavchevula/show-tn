import { VenueConfig, SelectorConfig } from "../scraper/types";

export const californiaClipperConfig: VenueConfig = {
    name: 'california-clipper',
    displayName: 'California Clipper',
    url: 'https://californiaclipper.com/chicago-the-california-clipper-events',
    region: 'Northwest Side',
    neighborhood: 'Humboldt Park',
    selectors: {
        eventList: '.container .events-holder',
        title: 'h2',
        date: 'h3:not(.event-time)',
        venue: '',
        doorsTime: '',
        showTime: 'h3.event-time',
        image: 'img',
        support: '.event-info-text > p ',
        headliners: '',
        url: 'a',
        header: '',
        subtitle: '',
        price: '',
        description: '.event-info-text > p',
    } as SelectorConfig,
    genreTags:['electronic','dance','jazz','indie','soul'],
    imageExtractor: 'src',
    datePreprocess: (raw: string) =>
        raw.replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+/i, '')
           .replace(/(\d+)(st|nd|rd|th)/i, '$1'),
}
