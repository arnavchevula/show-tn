import { VenueConfig, SelectorConfig } from "../scraper/types";

export const tackRoomConfig: VenueConfig = {
    name: 'tack-room',
    displayName: 'Tack Room',
    url: 'https://www.tackroomchicago.com/livemusic',
    region: 'Southwest Side',
    neighborhood: 'Pilsen',
    baseUrl: 'https://www.tackroomchicago.com',
    selectors: {
        eventList: 'article.eventlist-event',
        title: 'a.eventlist-title-link',
        venue: '',
        date: '',
        month: 'div.eventlist-datetag-startdate.eventlist-datetag-startdate--month',
        day: 'div.eventlist-datetag-startdate.eventlist-datetag-startdate--day',
        doorsTime: 'time.event-time-localized-start',
        showTime: '',
        image: 'img',
        support: '',
        headliners: '',
        url: 'a.eventlist-column-thumbnail',
        header: '',
        subtitle: '',
        price: '',
    } as SelectorConfig,
    genreTags: ["electronic", "dance", "club", "rap/hip-hop", "reggaeton"],
    imageExtractor: 'src',
}
