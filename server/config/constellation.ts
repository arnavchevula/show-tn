import { VenueConfig, SelectorConfig } from "../scraper/types";

export const constellationConfig: VenueConfig = {
    name: 'constellation',
    displayName: 'Constellation',
    url: 'https://constellation-chicago.com/',
    region: 'Roscoe Village',
    neighborhood: 'Northside',
    selectors: {
        eventList: '.seetickets-list-event-container',
        title: 'p.title a',
        date: 'p.date',
        venue: 'Constellation',
        doorsTime: '.see-doortime',
        showTime: '.see-showtime',
        image: 'img.seetickets-list-view-event-image',
        support: '',
        headliners: '',
        url: 'p.title a',
        header: '',
        subtitle: '',
    } as SelectorConfig,
    imageExtractor: 'src',
}
