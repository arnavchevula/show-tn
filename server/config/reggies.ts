import { VenueConfig, SelectorConfig } from "../scraper/types";

export const reggiesConfig: VenueConfig = {
    name: 'reggies',
    displayName: 'Reggies',
    url: 'https://www.reggieslive.com/',
    region: 'Southside',
    neighborhood: 'South Loop',
    selectors: {
        eventList: 'article.show',
        title: 'h2.show-title.band-title',
        venue: '',
        date: 'time ',
        doorsTime: 'li.first',
        showTime: 'ul.details li:nth-child(2):not(.last)',
        image: '',
        support: 'h3.show-title.band-title',
        headliners: '',
        url: 'a.icon.ticketfly',
        header: '.presented-by',
        subtitle: '',
        price: '',
        age: 'li.last'
    } as SelectorConfig,
    imageExtractor: 'src',
    doorsTimeExtractor: ($: any, elm: any) => {
        let doorsTime = '';
        $(elm).find('ul.details li').each((_: any, li: any) => {
            const $li = $(li);
            if ($li.find('a[href*="/age/"]').length) return;
            const text = $li.text().trim();
            if (text && !doorsTime) {
                doorsTime = text;
            }
        });
        return doorsTime;
    },
}
