import { VenueConfig, SelectorConfig } from "../scraper/types";

export const joesBarConfig: VenueConfig = {
    name: 'joes-bar',
    displayName: "Joe's Bar",
    url: 'https://www.joesbar.com/livemusic-events',
    region: 'Northside',
    neighborhood: 'Lincoln Park',
    baseUrl:'https://www.joesbar.com/',
    selectors: {
        eventList: 'article.eventlist-event',
        title: 'a.eventlist-title-link',
        venue: '',
        date: 'time.event-date',
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
    genreTags: ["country", "rock", "punk"],
    imageExtractor: 'src',
}
