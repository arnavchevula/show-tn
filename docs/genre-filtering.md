# Genre Filtering

## The core challenge

~40 venues are scraped, most of which don't expose genre in their HTML. Three signals are available to work with:

---

## Approach 1: Venue-level genre defaults (easiest, ship now)

Each venue already has a `source` field and a config in `server/config/`. Assign default genres per venue — it's imperfect but accurate enough, since venues tend to specialize:

- `empty-bottle` → `["indie", "punk", "experimental"]`
- `smartbar` → `["electronic", "house", "techno"]`
- `constellation` → `["jazz", "experimental", "avant-garde"]`
- `hungry-brain` → `["jazz", "improv"]`

Store this in the venue configs (e.g., `server/config/smartbar.ts`) and tag every show at scrape time. This gets you 80% of the value immediately with no external APIs.

**Downside**: a show at Smartbar might be a live hip-hop set. Venue genre is a proxy, not ground truth.

---

## Approach 2: Music API lookup per artist (most accurate)

`headliners` and `title` are already scraped. Query **Last.fm** or **MusicBrainz** (both free) with the artist name to get their top tags/genre:

```
GET https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=String+Cheese+Incident&api_key=...
```

Do this as a post-processing step after scraping — cache results in the DB so you're not re-querying every time.

**Downside**: adds latency to scraping, and local/small acts often have no Last.fm data at all.

---

## Approach 3: Hybrid (recommended)

1. **Venue defaults as fallback** — set `genre` in the config for each venue
2. **Scrape genre when available** — a few sites expose it (e.g., Spotify-powered ticketing widgets, Bandsintown embeds); grab it when it's there, overrides the venue default
3. **Optional: LLM enrichment** — for shows with no genre, run `title + headliners + description` through a cheap model (Haiku) at scrape time to infer a genre label

---

## Filter UI

Genre would be multi-value (a show can be indie *and* rock), so store it as a string array in the DB and filter with `.some()`:

```ts
// in filteredShows computed (chicago/index.vue)
const genreMatch = selectedGenres.value.length === 0 ||
  (show.genres ?? []).some(g => selectedGenres.value.includes(g))
```

Expose `genres` from `useAggregatedShows` the same way `venues`, `neighborhoods`, and `regions` are already exposed.

---

## Recommendation

Start with venue defaults (1-2 hours of work, ships immediately), then layer in Last.fm lookups for headliner-based enrichment later. The LLM approach is a nice bonus for shows where the headliner is unknown or very local.
