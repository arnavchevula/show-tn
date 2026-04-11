import { VenueConfig, SelectorConfig } from "../scraper/types";

export const colesConfig: VenueConfig = {
    name: 'coles',
    displayName: 'Coles',
    url: 'https://colesbarchicago.com/',
    region: 'Northwest Side',
    neighborhood: 'Logan Square',
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
        url: '[title="Buy Tickets"]',
        secondaryUrl: '.eventMoreInfo a',
        header: '.eventTagLine',
        subtitle: '',
        price: '.rhp-event__cost-text--grid',
    } as SelectorConfig,
    genreTags: ['indie', 'punk', 'soul', 'hip-hop/rap', 'metal','rock','pop'],
    imageExtractor: 'src',
}
