import { VenueConfig, SelectorConfig } from "../scraper/types";

export const colesConfig: VenueConfig = {
    name: 'coles',
    displayName: 'Coles',
    url: 'https://colesbarchicago.com/',
    region: 'Northwest Side',
    neighborhood: 'Logan Square',
    baseUrl:'https://colesbarchicago.com',
    selectors: {
        eventList: 'article.evcard',
        title: 'h3.evcard-title',
        date: 'div.evcard-header',
        venue: '',
        doorsTime: 'p.evcard-time',
        showTime: '',
        image: 'img.evcard-image',
        support: '',
        headliners: '',
        url: 'a.evcard-image-link',
        secondaryUrl: '',
        header: '',
        subtitle: '',
        price: '',
    } as SelectorConfig,
    genreTags: ['indie', 'punk', 'soul', 'hip-hop/rap', 'metal','rock','pop'],
    imageExtractor: 'src',
}
