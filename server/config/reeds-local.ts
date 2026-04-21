import { VenueConfig, SelectorConfig } from "../scraper/types";

export const reedsLocalConfig: VenueConfig = {
    name: 'reeds-local',
    displayName: "Reed's Local",
    url: 'https://reedslocal.com/events/',
    region: 'Northwest Side',
    neighborhood: 'Avondale',
    selectors: {
        eventList: '',
        title: '',
        venue: '',
        date: '',
        doorsTime: '',
        showTime: '',
        image: '',
        support: '',
        headliners: '',
        url: '',
        header: '',
        subtitle: '',
        price: '',
    } as SelectorConfig,
    genreTags:['local','cover bands', 'indie'],
    imageExtractor: 'src',
}
