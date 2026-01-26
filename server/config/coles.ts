import { VenueConfig, SelectorConfig } from "../scraper/types";

export const colesConfig: VenueConfig = {
    name: 'coles',
    displayName: 'Coles',
    url: 'https://colesbarchicago.com/',
    selectors: {
        eventList: '.rhp-desktop-grid .eventMainWrapper',
        title: 'h2',
        date: '#eventDate',
        venue: '',
        doorsTime: '',
        showTime: '.eventDoorStartDate',
        image: 'img',
        support: '',
        headliners: 'h2',
        url: 'a #eventTitle',
        header: '.eventTagLine',
        subtitle: '',
        price: '.rhp-event__cost-text--grid'
    } as SelectorConfig,
    imageExtractor: 'src',
}
