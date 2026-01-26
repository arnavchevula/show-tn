import { VenueConfig, SelectorConfig } from "../scraper/types";

export const doriansConfig: VenueConfig = {
    name: 'dorians',
    displayName: 'Dorians',
    url: 'https://throughtherecordshop.com/events/',
    selectors: {
        eventList: '.events-list .column',
        title: 'h2.title',
        date: 'h3.date-time',
        venue: '',
        doorsTime: '',
        showTime: '',
        image: 'img',
        support: '',
        headliners: '',
        url: 'a',
        header: '',
        subtitle: '',
        price: '',
        description: '.description'
    } as SelectorConfig,
    imageExtractor: 'src',
}
