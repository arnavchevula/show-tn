import { VenueConfig, SelectorConfig } from "../scraper/types";

export const fultonStreetCollectiveConfig: VenueConfig = {
    name: 'fulton-street-collective',
    displayName: 'Fulton Street Collective',
    url: 'https://fultonstreetcollective.com/events/',
    region: 'Downtown',
    neighborhood: 'West Loop',
    selectors: {
        eventList: 'li.tribe-common-g-row.tribe-events-calendar-list__event-row',
        title: 'h4.tribe-events-calendar-list__event-title',
        venue: '',
        date: '',
        doorsTime: '',
        showTime: '',
        image: '',
        support: '',
        headliners: '',
        url: 'a.tribe-events-calendar-list__event-title-link',
        header: '',
        subtitle: '',
        price: '',
        date: 'span.tribe-event-date-start',
    } as SelectorConfig,
    imageExtractor: 'src',
    datePreprocess: (raw: string) => raw.split('@')[0].trim(),
    doorsTimeExtractor: ($: any, elm: any) => {
        const text = $(elm).find('span.tribe-event-date-start').text().trim();
        return text.split('@')[1]?.trim() || '';
    },
}
