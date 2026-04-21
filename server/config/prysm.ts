import { VenueConfig, SelectorConfig } from "../scraper/types";

export const prysmConfig: VenueConfig = {
    name: 'prysm',
    displayName: 'Prysm',
    url: 'https://www.prysmchicago.com/events',
    region: 'Northside',
    neighborhood: 'Lincoln Park',
    selectors: {
        eventList: 'div.entry.clearfix',
        title: 'h3.carousel_item_title_small',
        date: 'span.date',
        venue: '',
        doorsTime: 'span.time',
        showTime: '',
        image: 'img',
        support: 'h4.supporting.animated',
        headliners: '',
        url: '.thumb a',
        header: 'h5.presentedBy.animated',
        subtitle: '',
    } as SelectorConfig,
    genreTags: ["electronic", "dance"],
    imageExtractor: 'src',
}
