import { VenueConfig, SelectorConfig } from "../scraper/types";

export const aragornBallroom: VenueConfig = {
    name: 'aragorn-ballroom',
    displayName: 'Aragorn Ballroom',
    url: 'https://www.bylinebankaragonballroom.com/shows',
    selectors: {
        eventList: '[data-automation="shows-grid"] .chakra-linkbox',
        title: 'a',
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
