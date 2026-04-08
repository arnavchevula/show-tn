import { VenueConfig, SelectorConfig } from "../scraper/types";

export const burlingtonBarConfig: VenueConfig = {
    name: 'burlington-bar',
    displayName: 'Burlington Bar',
    url: 'https://www.theburlingtonbar.com/',
    region: 'Northwest Side',
    neighborhood: 'Logan Square',
    baseUrl:'https://www.theburlingtonbar.com',
    selectors: {
        eventList: 'td.has-event',
        title: 'span.item-title',
        venue: '',
        date: '',
        doorsTime: 'span.item-time',
        showTime: '',
        image: '',
        support: '',
        headliners: '',
        url: 'a.item-link',
        header: '',
        subtitle: '',
        price: '',
        day:'div.marker-daynum',
        month: ''
    } as SelectorConfig,
    imageExtractor: 'src',
}
