import { VenueConfig, SelectorConfig } from "../scraper/types";

export const ramovaTheatreConfig: VenueConfig = {
    name: 'ramova-theatre',
    displayName: 'Ramova Theatre',
    url: 'https://ramovachicago.com/',
    region: 'Southside',
    neighborhood: 'Bridgeport',
    selectors: {
        eventList: '.ca-info.w-dyn-item',
        title: '.title .b-show-2',
        date: 'div.event-info .dayofevent:nth-child(1)',
        venue: '',
        doorsTime: 'div.event-info .dayofevent:nth-child(2)',
        showTime: '',
        image: '.poster',
        support: '',
        headliners: '',
        url: 'a',
        header: '.title .presentsby',
        subtitle: '',
    } as SelectorConfig,
    genreTags: ["hip-hop/rap", "electronic", "rock", "metal", "punk", "soul"],
    imageExtractor: 'style',
}
