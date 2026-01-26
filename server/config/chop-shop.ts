import { VenueConfig, SelectorConfig } from "../scraper/types";

export const chopShopConfig: VenueConfig = {
    name: 'chop-shop',
    displayName: 'Chop Shop',
    url: 'https://chopshopchi.com/calendar/index.html',
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
        combinedDateAndTime:'time'
    } as SelectorConfig,
    imageExtractor: 'src'
}
