import { VenueConfig, SelectorConfig } from "../scraper/types";

export const hungryBrainConfig: VenueConfig = {
    name: 'hungry-brain',
    displayName: 'Hungry Brain',
    url: 'https://hungrybrainchicago.com/',
    region: 'Northside',
    neighborhood: 'Roscoe Village',
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
