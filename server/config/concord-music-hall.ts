import { VenueConfig, SelectorConfig } from "../scraper/types";

export const concordMusicHallConfig: VenueConfig = {
    name: 'concord-music-hall',
    displayName: 'Concord Music Hall',
    url: 'https://concordmusichall.com/calendar/',
    region: 'Northwest Side',
    neighborhood: 'Logan Square',
    selectors: {
        eventList: 'article.show.columns.six.group',
        title: '.center h1',
        venue: '',
        date: 'p.date',
        doorsTime: 'p.doors',
        showTime: '',
        image: '',
        support: '.center h2',
        headliners: '',
        url: 'a',
        header: 'p.presenter',
        subtitle: '',
        price: 'p.price',
        age: 'p.age',
    } as SelectorConfig,
    genreTags:['electronic', 'rock', 'punk', 'metal' ,'hip-hop/rap'],
    imageExtractor: 'src',
}
