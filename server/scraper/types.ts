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

    // Optional overrides for edge cases
    imageExtractor?: 'src' | 'style';  // Empty Bottle uses inline CSS
    urlBase?: string;           // For relative URLs that need a base
    titleExclude?: string[];    // Strings to remove from title (e.g., ['Buy Tickets'])
    datePreprocess?: (raw: string) => string;  // Transform raw date string before parsing
    doorsTimeExtractor?: ($: any, elm: any) => string;  // Custom extractor when li order is inconsistent
    showTimeExtractor?: ($: any, elm: any) => string;  // Custom extractor when li order is inconsistent
  }

  export interface ScrapeResult {
    content: Event[] | null;
    status: 'success' | 'error';
    message?: string;
    count?: number;
  }
