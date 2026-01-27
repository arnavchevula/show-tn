import { VenueConfig, SelectorConfig } from "../scraper/types";

export const hideoutConfig: VenueConfig = {
    name: 'hideout',
    displayName: 'Hideout',
    url: 'https://www.hideoutchicago.com/shows',
    selectors: {
        eventList: 'a[href*="/shows/"]',
        eventItem: 'a[href*="/shows/"]',
        title: 'h3',
        date: 'div:first-child',
        venue: '',
        doorsTime: '',
        showTime: 'div:nth-child(3)',
        image: 'img',
        support: '',
        headliners: 'h3',
        url: '',
        header: 'h3',
        subtitle: '',
        month:'.show-image-poster-wrapper .event-month',
        day:'.show-image-poster-wrapper .event-day'
    } as SelectorConfig,
    imageExtractor: 'src',
}
