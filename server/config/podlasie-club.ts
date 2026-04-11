import { VenueConfig, SelectorConfig } from "../scraper/types";

export const podlasieClubConfig: VenueConfig = {
    name: 'podlasie-club',
    displayName: 'Podlasie Club',
    url: 'https://ra.co/clubs/189215',
    region: 'Northwest Side',
    neighborhood: 'Avondale',
    baseUrl: 'https://ra.co',
    selectors: {
        eventList: '[data-testid="event-listing-card"]',
        title: '[data-pw-test-id="event-title-link"]',
        date: '[data-test-id="non-ticketed-event"] span[color="secondary"]',
        venue: '',
        doorsTime: '',
        showTime: '',
        image: '[data-pw-test-id="event-image-link"] img',
        support: '[data-test-id="artists-lineup"]',
        headliners: '[data-test-id="artists-lineup"]',
        url: '[data-pw-test-id="event-title-link"]',
        header: '',
        subtitle: '',
    } as SelectorConfig,
    genreTags:['electronic','dance','club'],
    imageExtractor: 'src',
}
