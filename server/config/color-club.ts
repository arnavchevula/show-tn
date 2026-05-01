import { VenueConfig, SelectorConfig } from "../scraper/types";

export const colorClubConfig: VenueConfig = {
    name: 'color-club',
    displayName: 'Color Club',
    url: 'https://www.colorclub.events/calendar',
    region: 'Northwest Side',
    neighborhood: 'Irving Park',
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
        combinedDateAndTime: 'time',
    } as SelectorConfig,
    genreTags: ['indie', 'pop', 'experimental', 'jazz'],
    imageExtractor: 'src',
}
