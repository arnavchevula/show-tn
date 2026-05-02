import { VenueConfig, SelectorConfig } from "../scraper/types";

export const garciasConfig: VenueConfig = {
    name: 'garcias',
    displayName: "Garcia's",
    url: 'https://garciaschicago.live/shows',
    region: 'Downtown',
    neighborhood: 'West Loop',
    selectors: {
        eventList: 'div.gct-event-item',
        title: 'h3.gct-event-title',
        venue: '',
        date: 'div.gct-event-date',
        doorsTime: 'p.gct-event-meta',
        showTime: '',
        image: '',
        support: 'p.gct-event-tagline',
        headliners: '',
        url: 'a.gct-event-ticket-btn onsale',
        secondaryUrl:'a.gct-event-vip-btn hide_mobile',
        header: '',
        subtitle: '',
        price: ''
    } as SelectorConfig,
    genreTags: [],
    imageExtractor: 'src',
}
