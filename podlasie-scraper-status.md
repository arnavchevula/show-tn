# Podlasie Club Scraper — Status & Notes

## What went wrong

Two separate issues were found:

### 1. Wrong CSS selectors (`server/config/podlasie-club.ts`)
The selectors were targeting the wrong elements in RA's HTML. Specifically:
- `title` was pointing to the `<h3>` wrapper instead of the title link span
- `url` was using a bare `a` which grabbed the image link, not the title link
- `image` was using a bare `img` which was too broad
- `date` was using a direct-child selector (`>`) that was fragile due to two elements sharing the same `data-test-id`
- `baseUrl` was missing, so event URLs were returned as relative paths (`/events/...`) with no domain

**Fixed** — selectors updated and `baseUrl: 'https://ra.co'` added.

### 2. `browser.ts` had a hardcoded `waitForSelector` for a different venue
`getPageHtml` was waiting for `.dice_events > article` (a Cobra Lounge-specific selector) before grabbing the HTML. On RA pages this selector never appears, so it silently timed out after 15 seconds. Since RA is a Next.js app that renders event cards client-side, the DOM wasn't fully loaded by the time `page.content()` was called.

**Fixed** — `waitForSelector` is now an optional parameter passed from the venue config's `eventList` selector.

### 3. Cloudflare bot detection (current blocker)
RA serves a Cloudflare JavaScript challenge to headless Chrome. The page returns a CF challenge shell instead of real HTML, so `[data-testid="event-listing-card"]` matches nothing.

**Not fixed.**

---

## What we tried for the Cloudflare issue

| Approach | Result |
|---|---|
| `puppeteer-extra` + `puppeteer-extra-plugin-stealth` | Bundling error — Netlify's Rollup bundler can't handle the plugin's dynamic `require()` calls |
| `external_node_modules` in `netlify.toml` | Didn't resolve the bundling error |
| Manually deleting specific evasions via `stealth.enabledEvasions.delete()` | Didn't help — Rollup still tried to bundle the deleted modules at build time |
| Manual `evaluateOnNewDocument` patches (`navigator.webdriver`, `window.chrome`, etc.) | Still blocked — Cloudflare checks deeper signals (canvas, TLS fingerprint, timing) |

---

## What needs to happen to fix it

### Option A: Use RA's GraphQL API (recommended)
RA's frontend is built on GraphQL. You can query it directly with a plain HTTP POST — no browser, no Cloudflare. To get the query:
1. Open `https://ra.co/clubs/189215` in Chrome DevTools
2. Go to Network tab, filter by `graphql`
3. Reload the page and find the request that fetches upcoming events
4. Copy the query, variables, and any required headers

This would replace the entire Puppeteer-based scraper for Podlasie with a simple `fetch` call.

### Option B: Residential proxy
Route the Puppeteer request through a residential proxy (e.g. Bright Data, Oxylabs). Cloudflare trusts residential IPs. Requires a paid proxy service.

### Option C: Scraping service
Use a third-party scraping API (e.g. ScrapingBee, Apify, Browserless) that handles Cloudflare bypass for you. Pass the RA URL and get back the rendered HTML.
