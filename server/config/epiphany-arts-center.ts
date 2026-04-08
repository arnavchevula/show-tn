import { VenueConfig, SelectorConfig } from "../scraper/types";

export const epiphanyArtsCenterConfig: VenueConfig = {
    name: 'epiphany-arts-center',
    displayName: 'Epiphany Center For The Arts',
    url: 'https://epiphanychi.com/tickets/',
    region: 'Downtown',
    neighborhood: 'West Loop',
    selectors: {
        eventList: '.eventon_list_event',
        title: 'span.evoet_title',
        date: '',
        venue: '',
        doorsTime: '.time',
        showTime: '.time',
        image: '.evo_boxtop',
        support: '',
        headliners: '',
        url: '.desc_trig_outter > a',
        header: '',
        subtitle: '',
        day: '.date',
        month: '.month',
        
    } as SelectorConfig,
}
