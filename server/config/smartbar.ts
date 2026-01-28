import { VenueConfig, SelectorConfig } from "../scraper/types";

export const smartbarConfig: VenueConfig = {
    name: 'smartbar',
    displayName: 'Smartbar',
    url: 'https://smartbarchicago.com/events',
    selectors: {
        eventList: '.rhp-desktop-grid .eventMainWrapper',
        title: 'h2',
        date: '#eventDate',
        venue: '',
        doorsTime: '',
        showTime: '.eventDoorStartDate > span',
        image: 'img',
        support: 'h4#evSubHead',
        headliners: 'h2',
        url: 'a.url',
        header: '.eventTagLine',
        subtitle: ''
    } as SelectorConfig,
    imageExtractor: 'src',
}
