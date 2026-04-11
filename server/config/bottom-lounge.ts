import { VenueConfig, SelectorConfig } from "../scraper/types";

export const bottomLounge: VenueConfig = {
    name: 'bottom-lounge',
    displayName: 'Bottom Lounge',
    url: 'https://bottomlounge.com/events/',
    region: 'Downtown',
    neighborhood: 'West Loop',
    selectors: {
        eventList: '.w-grid-list article.w-grid-item',
        title: '.post_title',
        date: '',
        doorsTime: '.usg_hwrapper_doors',
        showTime: '.usg_post_custom_field_3',
        image: 'img',
        age: 'usg_post_custom_field_age',
        support: '',
        headliners: '',
        url: 'a',
        header: '',
        subtitle: '',
        price: '',
        month: '.usg_post_custom_field_1',
        day:'.usg_post_custom_field_2',
    } as SelectorConfig,
    genreTags:['punk','metal','rock'],
    imageExtractor: 'src',
}
