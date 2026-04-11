import { VenueConfig, SelectorConfig } from "../scraper/types";

export const lemonConfig: VenueConfig = {
    name: 'lemon',
    displayName: 'Lemon',
    url: 'https://www.lemonchicago.net/events',
    region: 'Northwest Side',
    neighborhood: 'West Town',
    selectors: {
        eventList: '.dice_events > article',
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
        combinedDateAndTime:'time',
    } as SelectorConfig,
    genreTags:['jazz','americana','soul'],
    imageExtractor: 'src'
}
