import { VenueConfig, SelectorConfig } from "../scraper/types";

export const andysJazzClubConfig: VenueConfig = {
    name: 'andys-jazz-club',
    displayName: "Andy's Jazz Club",
    url: 'https://andysjazzclub.com/music-calendar/',
    region: 'Downtown',
    neighborhood: 'River North',
    selectors: {
        // Each occurrence of a recurring event gets its own <article> element by the MEC plugin,
        // so this gives us one item per show night rather than one item per recurring series.
        //
        // NOTE: Do NOT filter by :not(.mec-past-event) here. MEC adds that class server-side
        // based on a cached render, and the cache is frequently stale — the page regularly
        // marks June events as "past" while only a handful of near-term shows get the correct
        // non-past class. Filtering by it would drop ~80 legitimate future events every run.
        // We scrape all articles and rely on the UI's date-range filtering to hide past shows.
        eventList: 'article.mec-event-article',

        title: '.mec-event-title a',

        // date is intentionally unused — see dateExtractor below. The MEC plugin does not
        // render the event date as visible text inside the article; it is only available as a
        // URL query parameter (?occurrence=YYYY-MM-DD) on the title link.
        date: '',

        // "6:00 pm - 7:15 pm" rendered by MEC inside a <div class="mec-event-time">
        doorsTime: '.mec-event-time',

        showTime: '',
        venue: '',
        support: '',
        headliners: '',
        header: '',
        subtitle: '',
        age: '',
        price: '',

        // Full absolute URL is already on the title link, no baseUrl needed
        url: '.mec-event-title a',

        image: '.mec-event-image img',
    } as SelectorConfig,

    // MEC renders the event page, no JS hydration step needed
    waitUntil: 'domcontentloaded',

    imageExtractor: 'src',

    genreTags: ['jazz'],

    // Andy's Jazz Club — date lives in the href of the title link as a query param, not in
    // any DOM text node. The MEC plugin generates URLs like:
    //   /events/andy-brown-quartet/?occurrence=2026-05-08&time=1778263200
    // We pull the occurrence= value and construct a noon-local Date to avoid UTC day-shift.
    dateExtractor: ($, elm) => {
        const href = $(elm).find('.mec-event-title a').attr('href') ?? '';
        const match = href.match(/occurrence=(\d{4}-\d{2}-\d{2})/);
        return new Date(`${match![1]}T12:00:00`);
    },
};
