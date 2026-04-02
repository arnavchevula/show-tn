# Show TN

A Chicago live music event aggregator. Scrapes 26+ venues daily and surfaces upcoming shows in a single browsable feed.

---

## Overview

Show TN pulls event listings from Chicago venue websites, stores them in Supabase, and displays them on a weekly calendar view. Each venue has a scraper that runs on a daily Netlify scheduled function. The frontend is a Nuxt 4 app that reads directly from the database.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Nuxt 4, Vue 3, Nuxt UI (Tailwind) |
| Scraping | Puppeteer, Cheerio |
| Database | Supabase (PostgreSQL) |
| Scheduling | Netlify Scheduled Functions |
| Language | TypeScript |

---

## Architecture

```
Netlify Scheduled Function (@daily)
  └── POST /api/[venue]  (authenticated with NUXT_TASK_SECRET)
        └── scrapeVenue(config)
              ├── launchBrowser()         — puppeteer-core in prod, puppeteer locally
              ├── getPageHtml(url)        — navigates page, waits for networkidle2
              ├── extractEvents(html)     — Cheerio parses DOM using VenueConfig selectors
              └── saveEvents(events)      — deletes old records by source, inserts new ones
                    └── Supabase table (DB_NAME env var, default: events-qa)

Frontend (Nuxt)
  └── useAggregatedShows()
        └── SELECT * FROM events WHERE parsedDate BETWEEN today AND +7 days
              └── EventCard components rendered on /chicago
```

### Core Scraper (`server/scraper/`)

Most venues use the generic scraper in `core.ts`. Adding a new venue only requires a config file in `server/config/`:

```typescript
// server/config/my-venue.ts
export const myVenueConfig: VenueConfig = {
  name: 'my-venue',
  displayName: 'My Venue',
  url: 'https://my-venue.com/events',
  selectors: {
    eventList: '.event-list .event-item',
    title: '.event-title',
    date: '.event-date',
    image: '.event-image',
    url: 'a.tickets',
    // ...
  },
  imageExtractor: 'src', // or 'style' for CSS background-image
  additionalEventLists: ['#widget-coming-up .eb-item'], // for tonight's show in a separate div
}
```

Venues with non-standard page structures (e.g., Empty Bottle) have custom scrapers in `server/api/`.

### Venue Coverage

| Venue | Scraper Type |
|---|---|
| Beat Kitchen | Config-based |
| Thalia Hall | Config-based |
| Salt Shed | Config-based |
| Sleeping Village | Config-based |
| The Hideout | Config-based |
| House of Blues | Config-based |
| Lincoln Hall / Schubas | Config-based |
| Aragon Ballroom | Config-based |
| Avondale Music Hall | Config-based |
| Book Club | Config-based |
| Bottom Lounge | Config-based |
| California Clipper | Config-based |
| Chop Shop | Config-based |
| Cobra Lounge | Config-based |
| Coles Bar | Config-based |
| Dorians | Config-based |
| Gman Tavern | Config-based |
| Lemon Chicago | Config-based |
| Podlasie Club | Config-based |
| SmartBar | Config-based |
| Smoke & Mirrors | Config-based |
| The Whistler | Config-based |
| SubT | Config-based |
| Clara | Config-based |
| Jam Productions | Config-based |
| Empty Bottle | Custom scraper |

---

## Running Locally

### Prerequisites

- Node.js >= 18
- Google Chrome installed at `/Applications/Google Chrome.app/` (macOS)
- A Supabase project with an `events` (or `events-qa`) table
- Netlify CLI (for running scheduled functions locally)

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

```env
SUPABASE_URL=           # Your Supabase project URL
SUPABASE_KEY=           # Supabase anon key (used browser-side)
SUPABASE_SECRET_SERVER= # Supabase service role key (used server-side for writes)
TASK_SECRET=            # A secret string — scraper endpoints require this as a Bearer token
DB_NAME=events-qa       # Supabase table name to read/write events

# Optional
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=
TWILIO_TO_NUMBER=
TWILIO_RECOVER_CODE=
```

> The scraper API routes (`/api/[venue]`) require an `Authorization: Bearer <TASK_SECRET>` header. Netlify functions send this automatically via `NUXT_TASK_SECRET`. Locally, set `NUXT_TASK_SECRET` to the same value as `TASK_SECRET`.

### 3. Start the dev server

```bash
npm run dev
```

App runs at `http://localhost:3000`.

### 4. Trigger a scraper manually

With the dev server running, POST to any scraper endpoint:

```bash
curl -X POST http://localhost:3000/api/beat-kitchen \
  -H "Authorization: Bearer <your-TASK_SECRET>"
```

---

## Running Netlify Functions Locally

Netlify scheduled functions can be tested locally using the Netlify CLI.

### 1. Install the Netlify CLI

```bash
npm install -g netlify-cli
```

### 2. Link your site (first time only)

```bash
netlify login
netlify link
```

### 3. Start the Netlify dev server

This runs both the Nuxt app and the Netlify function layer together:

```bash
netlify dev
```

The app will be available at `http://localhost:8888` (Netlify proxy) with the Nuxt server on `:3000` in the background.

### 4. Invoke a scheduled function manually

Netlify scheduled functions don't fire on a timer locally — trigger them manually:

```bash
netlify functions:invoke beat-kitchen-function --no-identity
```

Or trigger all of them at once with a shell loop:

```bash
for f in netlify/functions/*-function.mts; do
  name=$(basename "$f" .mts)
  netlify functions:invoke "$name" --no-identity
done
```

> Make sure `NUXT_TASK_SECRET` is set in your `.env` or Netlify environment — the functions use it to authenticate against the scraper API.

### 5. Environment variables for Netlify dev

Netlify dev automatically reads `.env`. You can also set variables via the Netlify dashboard (Site Settings > Environment Variables), which `netlify dev` will pull down when linked.

---

## Deployment

The app deploys to Netlify. Push to `main` triggers a build. Scheduled functions deploy automatically alongside the site — no extra configuration needed.

**Required Netlify environment variables** (set in dashboard):

```
SUPABASE_URL
SUPABASE_KEY
SUPABASE_SECRET_SERVER
NUXT_TASK_SECRET
DB_NAME
PRODUCTION=true
```

The `PRODUCTION=true` flag tells the browser launcher to use `@sparticuz/chromium` (Lambda-compatible) instead of the local Chrome binary.

---

## Adding a New Venue

1. Create `server/config/my-venue.ts` with a `VenueConfig`
2. Create `server/api/my-venue.ts` that calls `scrapeVenue(myVenueConfig)`
3. Create `netlify/functions/my-venue-function.mts` that POSTs to `/api/my-venue`

Use any existing venue as a template. The config-based approach in `core.ts` handles date parsing, image extraction, and DB writes automatically.

---

## Project Structure

```
├── app/
│   ├── pages/              # Routes: /, /chicago, /about
│   ├── components/         # EventCard, Header, Footer
│   └── composables/        # useAggregatedShows, per-venue composables
├── server/
│   ├── scraper/
│   │   ├── core.ts         # Generic scrapeVenue() logic
│   │   ├── browser.ts      # Puppeteer browser launch + user-agent rotation
│   │   └── types.ts        # VenueConfig, SelectorConfig, ScrapeResult
│   ├── config/             # One VenueConfig per venue
│   ├── api/                # One Nuxt API route per venue
│   └── db/db.ts            # Supabase client wrapper
├── netlify/functions/      # One scheduled function per venue
├── types/event.d.ts        # Event interface
├── netlify.toml            # Security headers, asset caching
└── .env.example
```
