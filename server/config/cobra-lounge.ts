import { VenueConfig, SelectorConfig } from "../scraper/types";

export const cobraLoungeConfig: VenueConfig = {
    name: 'cobra-lounge',
    displayName: 'Cobra Lounge',
    url: 'https://cobralounge.com/events/',
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
