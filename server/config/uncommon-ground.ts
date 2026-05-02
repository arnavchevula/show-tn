import { VenueConfig, SelectorConfig } from "../scraper/types";

export const uncommonGroundConfig: VenueConfig = {
    name: 'uncommon-ground',
    displayName: 'Uncommon Ground',
    url: 'https://www.uncommonground.com/events-page',
    region: 'Northside',
    neighborhood: 'Wrigley',
    baseUrl:'https://www.uncommonground.com',
    selectors: {
        eventList: 'article.eventlist-event',
        title: 'a.eventlist-title-link',
        venue: '',
        date: '',
        month: 'div.eventlist-datetag-startdate.eventlist-datetag-startdate--month',
        day: 'div.eventlist-datetag-startdate.eventlist-datetag-startdate--day',
        doorsTime: 'time.event-time-localized-start',
        showTime: '',
        image: 'img.eventlist-thumbnail',
        support: '',
        headliners: '',
        url: 'a.eventlist-column-thumbnail',
        header: '',
        subtitle: '',
        price: '',
    } as SelectorConfig,
    genreTags: ["indie", "experimental"],
    imageExtractor: 'src',
}
