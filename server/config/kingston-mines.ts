import { VenueConfig, SelectorConfig } from "../scraper/types";

export const kingstonMinesConfig: VenueConfig = {
    name: 'kingston-mines',
    displayName: 'Kingston Mines',
    // The ?v= query param is required — the root URL and any other v= value return no
    // calendar events (tested: root URL 307-redirects, random v= value returns 0 events).
    // This looks like a Beaver Builder (fl-builder) page version hash that gets regenerated
    // on site updates. If the scraper suddenly returns 0 shows, check this URL first —
    // load kingstonmines.com in a browser, find the simcal widget, and update the v= value.
    url: 'https://kingstonmines.com/?v=0b3b97fa6688',
    region: 'Northside',
    neighborhood: 'Lincoln Park',
    selectors: {
        // Simple Calendar (simcal) renders one <li> per event occurrence server-side,
        // pulling from a Google Calendar backend. No JS hydration needed.
        eventList: 'li.simcal-event',

        // .simcal-event-title appears twice per <li>: once as a direct child span and
        // again inside the hidden tooltip div. The direct-child selector (>) prevents
        // the two matches from being concatenated into a doubled title string.
        title: '> span.simcal-event-title',

        // Text is "May 1, 2026" — DateParser handles this format correctly as-is.
        date: '.simcal-event-start-date',

        doorsTime: '.simcal-event-start-time',

        showTime: '',
        venue: '',
        support: '',
        headliners: '',
        header: '',
        subtitle: '',
        age: '',
        price: '',
        image: '',

        // Events link only to Google Calendar, not to individual event pages.
        // fallbackUrl below provides the homepage link instead.
        url: '',
    } as SelectorConfig,

    waitUntil: 'domcontentloaded',

    fallbackUrl: 'https://kingstonmines.com/?v=0b3b97fa6688',

    genreTags: ['blues'],
};
