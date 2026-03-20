import { VenueConfig, SelectorConfig } from "../scraper/types";

export const smokeAndMirrorsConfig: VenueConfig = {
    name: 'smoke-and-mirrors',
    displayName: 'Smoke and Mirrors',
    url: 'https://www.smokeandmirrorschicago.com/#event',
    selectors: {
        eventList: '.dice_events article',
        title: 'a.dice_event-title',
        venue: '',
        date: 'time',
        doorsTime: 'time',
        showTime: 'time',
        image: 'img',
        support: '',
        headliners: '',
        url: 'a',
        header: '',
        subtitle: '',
        price: '',
        combinedDateAndTime:'time'
    } as SelectorConfig,
    imageExtractor: 'src'
}
