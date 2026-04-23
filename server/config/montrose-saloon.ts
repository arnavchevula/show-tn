import { VenueConfig, SelectorConfig } from "../scraper/types";

export const montroseSaloonConfig: VenueConfig = {
    name: 'montrose-saloon',
    displayName: 'Montrose Saloon',
    url: 'https://montrosesaloon.com/events/',
    region: 'Northside',
    neighborhood: 'Ravenswood',
    waitUntil: 'networkidle2',
    selectors: {
        eventList: 'div.tribe-common-g-row.tribe-events-calendar-list__event-row',
        title: 'h3.tribe-events-calendar-list__event-title',
        date: 'span.tribe-event-date-start', 
        day: '',
        month: '',
        venue: '',
        doorsTime: '',
        showTime: '',
        image: 'img.tribe-events-calendar-list__event-featured-image',
        support: '',
        headliners: '',
        url: 'a.tribe-events-calendar-list__event-title-link',
        header: '',
        subtitle: '',
        price: '',
        description: '',
    } as SelectorConfig,
    genreTags: [],
    imageExtractor: 'src',
    datePreprocess: (raw: string) => raw.split('|')[0].trim(),
    doorsTimeExtractor: ($: any, elm: any) => {
        const text = $(elm).find('span.tribe-event-date-start').text().trim();
        return text.split('@')[1]?.trim() || '';
    },
}
