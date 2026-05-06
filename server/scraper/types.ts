export interface SelectorConfig {
    eventList: string;          // Container holding all events
    eventItem: string;          // Individual event element
    title: string;
    titleFallback?: string;     // Fallback selector when title is empty (e.g. free events with no <a>)
    date: string;
    price?: string;
    venue?: string;
    doorsTime?: string;
    showTime?: string;
    age?: string;
    genre?: string;
    image?: string;
    support?: string;
    headliners?: string;
    url?: string;
    secondaryUrl?: string;
    header?: string;
    subtitle?: string;
    month?: string;
    day?: string;
    description?: string;
    combinedDateAndTime?: string;
  }


  export interface VenueConfig {
    name: string;               // Source identifier (e.g., 'beat-kitchen')
    displayName?: string;
    url: string;                // URL to scrape
    region?: string;
    neighborhood?: string;
    selectors: SelectorConfig;
    baseUrl?: string;
    additionalEventLists?: string[];  // Extra event containers (e.g. tonight's show)
    genreTags?: string[];            // Venue-level genre defaults

    // Optional overrides for edge cases
    imageExtractor?: 'src' | 'style';  // Empty Bottle uses inline CSS
    urlBase?: string;           // For relative URLs that need a base
    titleExclude?: string[];    // Strings to remove from title (e.g., ['Buy Tickets'])
    excludeTitles?: string[];   // Exact titles that mean the venue is closed — drop the event entirely
    fallbackUrl?: string;        // Static URL returned when no per-event link is found
    waitUntil?: 'domcontentloaded' | 'networkidle2';  // Page load strategy — use networkidle2 for JS-rendered sites
    datePreprocess?: (raw: string) => string;  // Transform raw date string before parsing
    doorsTimeExtractor?: ($: any, elm: any) => string;  // Custom extractor if time & date in same element
    showTimeExtractor?: ($: any, elm: any) => string;  // Custom extractor when li order is inconsistent

    // dateExtractor: fully replaces the built-in date parsing logic for venues where the event
    // date cannot be found in any DOM text node and must instead be pulled from an attribute.
    //
    // WHY THIS EXISTS — Andy's Jazz Club (andysjazzclub.com):
    //   The site uses the WordPress MEC (Modern Events Calendar) plugin. Each event occurrence
    //   is its own <article class="mec-event-article"> element, but the date is ONLY present
    //   as a URL query parameter on the title link, e.g.:
    //     <a href="/events/andy-brown/?occurrence=2026-05-08&time=1778263200">...</a>
    //   There is no date text anywhere inside the article element, so config.selectors.date
    //   and datePreprocess are both useless here. This hook lets the config read the href
    //   and extract the date directly from the occurrence= parameter.
    //
    // HOW TO USE — provide a function that receives the Cheerio instance and the event element
    // and returns a fully constructed Date object, e.g.:
    //   dateExtractor: ($, elm) => {
    //     const href = $(elm).find('.mec-event-title a').attr('href') ?? '';
    //     const match = href.match(/occurrence=(\d{4}-\d{2}-\d{2})/);
    //     return new Date(`${match![1]}T12:00:00`);
    //   }
    dateExtractor?: ($: any, elm: any) => Date;
  }

  export interface ScrapeResult {
    content: Event[] | null;
    status: 'success' | 'error';
    message?: string;
    count?: number;
  }
