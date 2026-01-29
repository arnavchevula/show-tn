import { VenueConfig, SelectorConfig } from "../scraper/types";

export const bookclubConfig: VenueConfig = {
    name: 'bookclub',
    displayName: 'Bookclub',
    url: 'https://bookclubchi.com/events/',
    selectors: {
        eventList: '.rhp-desktop-grid .eventMainWrapper',
        title: 'h2',
        date: '.d-none > #eventDate',
        venue: '',
        doorsTime: '',
        showTime: '.eventDoorStartDate > span',
        image: 'img',
        support: 'h4#evSubHead',
        headliners: 'h2',
        url: 'a.url',
        header: '.eventTagLine',
        subtitle: ''
    } as SelectorConfig,
    imageExtractor: 'src',
}
