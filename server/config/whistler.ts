import { VenueConfig, SelectorConfig } from "../scraper/types";

export const whistlerConfig: VenueConfig = {
    name: 'whistler',
    displayName: 'Whistler',
    url: 'https://whistlerchicago.com/calendar',
    selectors: {
        eventList: '.summary-item-list .summary-item',
        title: 'a.summary-title-link',
        date: '',
        day:'span.summary-thumbnail-event-date-day',
        month: 'span.summary-thumbnail-event-date-month',
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
        genre: 'p.preFade.fadeIn',
        description: 'p.preFade.fadeIn'
    } as SelectorConfig,
    imageExtractor: 'src',
}
