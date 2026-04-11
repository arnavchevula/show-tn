import { VenueConfig, SelectorConfig } from "../scraper/types";

export const elasticArtsConfig: VenueConfig = {
    name: 'elastic-arts',
    displayName: 'Elastic Arts',
    url: 'https://elasticarts.org/events',
    region: 'Northwest Side',
    neighborhood: 'Avondale',
    baseUrl: 'https://elasticarts.org/events',
    selectors: {
        eventList: 'article.eventlist-event',
        title: 'a.eventlist-title-link',
        venue: '',
        date: '',
        doorsTime: 'time.event-time-localized-start',
        showTime: '',
        image: '',
        support: '',
        headliners: '',
        url: 'a.eventlist-column-thumbnail',
        header: '',
        subtitle: '',
        price: '',
        month: 'div.eventlist-datetag-startdate.eventlist-datetag-startdate--month',
        day:'div.eventlist-datetag-startdate.eventlist-datetag-startdate--day',
    } as SelectorConfig,
    genreTags:['jazz','experimental'],
    imageExtractor: 'src',
}
