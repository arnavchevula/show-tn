# Vue / Nuxt Observations

Quirks, workarounds, and non-obvious decisions encountered in this codebase.

---

## Use `@click="navigateTo()"` on card wrappers instead of `NuxtLink`

**File:** `app/pages/chicago/index.vue` (line 238), same pattern used elsewhere

When a clickable card contains interactive child elements (buttons, links, `AddToCalendar`), wrapping the whole card in a `NuxtLink` causes problems. `NuxtLink` renders as an `<a>` tag, and the HTML spec doesn't allow interactive elements (`<button>`, `<a>`) nested inside an `<a>`. Browsers handle this inconsistently, and `@click.stop` on inner elements may not reliably cancel the parent navigation.

Using a plain `div` with `@click="navigateTo('/path')"` instead gives you a real DOM element where event propagation works correctly — inner elements can call `@click.stop` to suppress navigation, while clicking anywhere else on the card still navigates.

---

## Batch form validation (shelved)

**File:** `app/pages/create-event/index.vue`

The batch `UForm` doesn't use `:schema`/`:state` because Nuxt UI's form validation doesn't handle arrays of items cleanly. If validation is ever needed, the approach is to map `schema.safeParse()` over each `batchEvent` individually, store errors in a `batchErrors` ref (array of `ZodError | null`), and check it at the top of `submitBatch`. Skipped for now since batch events come from Gemini and go through admin review anyway.

---

## create-event page refactor (future)

**File:** `app/pages/create-event/index.vue`

The page currently maintains two separate code paths — single event (uses `UForm` + Zod + reactive `state`) and batch (manual state via `batchEvents` array). A cleaner model would be to treat everything as a batch and have single-event just be an array of one, eliminating the duplication. Blocked on: collapsing the form state model, rewriting venue logic to be index-based throughout, and losing the free Zod/UForm integration on the single path (would need manual validation — see batch validation note above).

Also worth doing when revisiting: move `fetchParsed` into a composable so the flyer parsing endpoint can be reused elsewhere.


## Browser globals (`localStorage`, `window`, etc.) must be accessed in `onMounted`

**File:** `app/composables/useFavorites.ts`, `app/pages/favorites/index.vue`

Nuxt uses SSR — component code runs on the server (Node.js) first to generate HTML, then runs again in the browser during hydration. `localStorage`, `window`, `document`, and other browser globals don't exist in Node.js, so accessing them at the top level of a composable or `<script setup>` throws a `localStorage is not defined` error.

The fix is to only access them inside `onMounted`, which is guaranteed to run only in the browser after hydration.

This is not Vue- or Nuxt-specific — it applies to any SSR framework: Next.js uses `useEffect`, SvelteKit uses `onMount` or checks the `browser` flag from `$app/environment`, Remix uses `useEffect` the same way. The root cause is always the same: module/component initialization code runs on the server, but post-hydration lifecycle hooks run only in the browser.

SPAs (plain Vite/CRA React apps) don't have this issue because the server only serves static files — no component code ever runs in Node.js.

---

## `generateStableId` collides when the same artist plays the same venue twice on the same day

**Files:** `server/utils/stableId.ts`, `server/scraper/core.ts`

The stable ID is hashed from `venue + date + title`. For most venues this is fine, but venues like City Winery that host multiple shows per day (e.g. 6 PM and 9 PM sets from the same artist) produce identical IDs, causing one event to silently overwrite the other in the DB upsert.

The fix: add an optional `time` parameter to `generateStableId` that's appended to the hash key only when non-empty. This is backward-compatible — venues without a `doorsTime` produce the same IDs as before. In `core.ts`, `doorsTime` is now extracted before `generateStableId` is called and passed in. Venues that need this behavior add a `doorsTimeExtractor` to their config to pull the time from whatever element provides it (for City Winery, the same `p.event-date` div that holds the date, split on `@`).

---

## lack of QA data making me test in prod

When I was testing the [id].vue pages for events I realized that in useAggregatedShows i'm grabbing from events but elsewhere i'm doing events-qa (based on env file) so when I was testing the event pages, I would navigate somewhere that didn't exist because I was using a prod id (querying useAggregatedShows with hardcoded 'events' parameter) and querying events-qa with it. So i just changed the events env table name to just 'events' ie using prod instead of qa.. but all the other tables for local dev (pending, archived) use their qa variants. Going forward once I have unit testing enabled I will have substantial QA data so I won't need to test in prod. Thankfully any write operations are only happening to qa for dev work. 

ALso this applies for creating an event too... because when you check if an event is already in the system it queries events or events-qa based on the env variable.. and nothing relevant would be in events-qa since its not updated. 