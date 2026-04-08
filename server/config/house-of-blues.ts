import { VenueConfig, SelectorConfig } from "../scraper/types";

export const houseOfBlues: VenueConfig = {
    name: 'house-of-blues',
    displayName: 'House of Blues',
    url: 'https://chicago.houseofblues.com/shows',
    region: 'Downtown',
    neighborhood: 'River North',
    selectors: {
        eventList: '[data-automation="shows-grid"] .chakra-linkbox',
        title: 'a',
        titleFallback: 'p.chakra-text',
        venue: '',
        date: '',
        doorsTime: '',
        showTime: '',
        image: 'img',
        support: '',
        headliners: '',
        url: 'a',
        header: '',
        subtitle: '',
        price: '',
        month: 'time p:nth-child(3)',
        day:'time p:nth-child(2)'
    } as SelectorConfig,
    imageExtractor: 'src',
    titleExclude: ['Buy Tickets'],
}
