import { VenueConfig, SelectorConfig } from "../scraper/types";

export const metroConfig: VenueConfig = {
    name: 'metro',
    displayName: 'Metro',
    url: 'https://metrochicago.com/events',
    region: 'Northside',
    neighborhood: 'Wrigleyville',
    selectors: {
        eventList: '.rhpSingleEvent',
        title: 'h2.rhp-event__title--list',
        date: 'div#eventDate',
        venue: '.rhpVenueContent',
        doorsTime: 'span.rhp-event__time-text--list',
        showTime: '',
        image: 'img.eventListImage',
        support: 'h4#evSubHead',
        headliners: '',
        url: 'a#eventTitle.url',
        age:'.eventAgeRestriction',
        header: '.eventTagLine',
        subtitle: '',
    } as SelectorConfig,
    genreTags:['indie','punk','hip-hop/rap','pop','rock'],
    imageExtractor: 'src',
}
