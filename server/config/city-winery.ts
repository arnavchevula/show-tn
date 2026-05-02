import { VenueConfig, SelectorConfig } from "../scraper/types";

export const cityWineryConfig: VenueConfig = {
    name: 'city-winery',
    displayName: 'City Winery',
    url: 'https://citywinery.com/pages/events/chicago',
    region: 'Downtown',
    neighborhood: 'West Loop',
    selectors: {
        eventList: 'div#eventList > div',
        title: 'h3.event-title',
        venue: '',
        date: 'p.event-date',
        doorsTime: '',
        showTime: '',
        image: 'img.event-image',
        support: '',
        headliners: '',
        url: 'a.vivenu-ticket',
        header: '',
        subtitle: '',
        price: '',
    } as SelectorConfig,
    genreTags: [],
    imageExtractor: 'src',
    datePreprocess: (date) => date.split("@")[0],
    doorsTimeExtractor: ($: any, elm: any) => $(elm).find('p.event-date').text().split('@')[1]?.trim() ?? ''
}
