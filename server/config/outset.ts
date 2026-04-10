import { VenueConfig, SelectorConfig } from "../scraper/types";

export const outsetConfig: VenueConfig = {
    name: 'outset',
    displayName: 'Outset',
    url: 'https://outsetlive.com/events/',
    region: 'Northwest Side',
    neighborhood: 'Bucktown',
    selectors: {
        eventList: '.listings-block-list__listing',
        title: '.listing__title h3',
        date: '.listingDateTime',
        venue: '',
        doorsTime: '',
        showTime: '',
        image: 'img',
        support: 'span.listing__lineupListItem:not(:last-child)',
        headliners: '',
        url: 'a.plotButton.JS--buyTicketsButton',
        secondaryUrl: 'a.listing__titleLink',
        header: '',
        subtitle: '',
        age: 'span.listing__lineupListItem:last-child',
    } as SelectorConfig,
    datePreprocess:(date) => {
        const [day, month] = date.split(" ");
        return `${month} ${day}`
    },
    imageExtractor: 'src',
}
