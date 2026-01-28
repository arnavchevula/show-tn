import { VenueConfig, SelectorConfig } from "../scraper/types";

export const californiaClipperConfig: VenueConfig = {
    name: 'california-clipper',
    displayName: 'California Clipper',
    url: 'https://californiaclipper.com/chicago-the-california-clipper-events',
    selectors: {
        eventList: '.container .events-holder',
        title: 'h2',
        date: '',
        combinedDateAndTime: 'h3',
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
        description: '.event-info-text > p'
    } as SelectorConfig,
    imageExtractor: 'src',
}
