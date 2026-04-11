import { VenueConfig, SelectorConfig } from "../scraper/types";

export const cubbyBearConfig: VenueConfig = {
    name: 'cubby-bear',
    displayName: 'Cubby Bear',
    url: 'https://www.cubbybear.com/live-music',
    region: 'Northside',
    neighborhood: 'Wrigley',
    baseUrl: 'https://www.cubbybear.com',
    selectors: {
        eventList: '.pm-calendar-event-card-wrapper',
        title: 'h3.calendar-event-name',
        venue: '',
        date: '[data-testid="event-date-time"]',
        doorsTime: 'div.pm-calendar-event-content-right > p > span:nth-child(2)',
        showTime: 'div.pm-calendar-event-content-right > p > span:nth-child(3)',
        image: 'img.pm-calendar-event-pic',
        support: '',
        headliners: '',
        url: 'a[href^="/events/"]',
        header: '',
        subtitle: '',
        price: '',
        age: 'div.pm-calendar-event-content-right > p > span:nth-child(1)',
    } as SelectorConfig,
    genreTags:['rock','indie'],
    imageExtractor: 'src',
    datePreprocess: (date) => date.split(',')[1]?.trim() ?? date,
    doorsTimeExtractor: ($, elm) => {
        let doors = '';
        $(elm).find('div.pm-calendar-event-content-right > p > span').each((_: any, span: any) => {
            const text = $(span).text().trim();
            if (text.startsWith('Doors:')) {
                doors = text.replace('Doors:', '').trim();
                return false;
            }
        });
        return doors;
    },
    showTimeExtractor: ($, elm) => {
        let show = '';
        $(elm).find('div.pm-calendar-event-content-right > p > span').each((_: any, span: any) => {
            const text = $(span).text().trim();
            if (text.startsWith('Music:')) {
                show = text.replace('Music:', '').trim();
                return false;
            }
        });
        return show;
    },
}
