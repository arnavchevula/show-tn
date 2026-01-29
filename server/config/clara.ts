import { VenueConfig, SelectorConfig } from "../scraper/types";

export const claraConfig: VenueConfig = {
    name: 'clara',
    displayName: 'Clara',
    url: 'https://www.clarachicago.com/events',
    selectors: {
        eventList: 'ul > li',
        title: '[data-hook]="ev-list-item-title"',
        date: '[data-hook]="ev-date"',
        venue: '',
        doorsTime: '',
        showTime: '',
        image: 'img',
        support: '',
        headliners: '',
        url: 'a',
        header: '',
        subtitle: ''
    } as SelectorConfig,
    imageExtractor: 'src',
}
