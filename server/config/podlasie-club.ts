import { VenueConfig, SelectorConfig } from "../scraper/types";

export const podlasieClubConfig: VenueConfig = {
    name: 'podlasie-club',
    displayName: 'Podlasie Club',
    url: 'https://ra.co/widget/eventlisting?promoter=131920&link=2&bgcolor=0e0e0e&linkcolor=db4c4c&textcolor=ffffff',
    selectors: {
        eventList: 'ul.events > li',
        title: 'h1.title > a',
        date: 'p.flag > span',
        venue: '',
        doorsTime: '',
        showTime: '',
        image: 'img',
        support: 'article > div > span',
        headliners: '',
        url: 'a',
        header: '',
        subtitle: ''
    } as SelectorConfig,
    imageExtractor: 'src',
}
