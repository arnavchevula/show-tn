import { VenueConfig, SelectorConfig } from "../scraper/types";

export const buddyGuysLegendsConfig: VenueConfig = {
    name: 'buddy-guys-legends',
    displayName: "Buddy Guy's Legends",
    url: 'https://buddyguy.com/events/?view=list',
    region: 'Downtown',
    neighborhood: 'South Loop',
    selectors: {
        eventList: '.rhpSingleEvent',
        title: 'h2.rhp-event__title--list',
        date: 'div#eventDate',
        venue: '.rhpVenueContent',
        doorsTime: 'span.rhp-event__time-text--list',
        showTime: '',
        image: 'img.eventListImage',
        support: 'h4#evSubHead',
        headliners: '',
        url: 'a#eventTitle.url',
        age: '.eventAgeRestriction',
        header: '.eventTagLine',
        subtitle: '',
    } as SelectorConfig,
    genreTags: ["blues", "jazz", "rock"],
    imageExtractor: 'src',
}
