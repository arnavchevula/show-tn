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

## `excludeTitles` drops venue-closed placeholders without polluting core logic

**Files:** `server/scraper/types.ts`, `server/scraper/core.ts`, `server/config/kingston-mines.ts`

Some venue calendars (e.g. Kingston Mines via Simple Calendar / Google Calendar backend) represent closed days as real calendar events with the title "Closed". Scraping these produces a junk event record that gets upserted into the DB.

The wrong fix is a global `if (title === 'Closed') skip` rule in `core.ts` — that would silently drop a legit event from any venue that happens to have an act called "Closed".

The right fix: `VenueConfig` has an optional `excludeTitles?: string[]` field. In `core.ts`, after extracting the title, any exact match against that list causes the element to be skipped via `return` (inside `.each()`). Because the list only exists on the config for venues that need it, other scrapers are unaffected. Kingston Mines sets `excludeTitles: ['Closed']`.

The existing `titleExclude` field is different — it strips substrings from the title but keeps the event. `excludeTitles` drops the event entirely.

---

## lack of QA data making me test in prod

When I was testing the [id].vue pages for events I realized that in useAggregatedShows i'm grabbing from events but elsewhere i'm doing events-qa (based on env file) so when I was testing the event pages, I would navigate somewhere that didn't exist because I was using a prod id (querying useAggregatedShows with hardcoded 'events' parameter) and querying events-qa with it. So i just changed the events env table name to just 'events' ie using prod instead of qa.. but all the other tables for local dev (pending, archived) use their qa variants. Going forward once I have unit testing enabled I will have substantial QA data so I won't need to test in prod. Thankfully any write operations are only happening to qa for dev work. 

ALso this applies for creating an event too... because when you check if an event is already in the system it queries events or events-qa based on the env variable.. and nothing relevant would be in events-qa since its not updated. 

REMEMBER YOU LOGGED INTO TWILIO USING BURNER EMAIL arnavburnsred1995@gmail.com using gmail SSO, they suspended your arnav.chevula@gmail.com account
AND YOU LOGGED INTO TURNSTILE CAPTCHA CLOUDFLARE USING GITCHUB SSO
---

## Composables are not pure utils — they inherit the calling component's lifecycle

Composables can use `onMounted`, `watch`, and other lifecycle hooks because they run inside a component's `setup` context. When you call `useFavorites()` inside a `<script setup>`, the composable inherits that component's lifecycle — `onMounted` inside the composable registers on whichever component called it.

That said, putting `onMounted` inside a composable is implicit and can be surprising. For side effects like loading initial data, it's cleaner to call `loadFavorites()` explicitly from `default.vue` (the layout) or a Nuxt plugin, rather than hiding the side effect inside the composable.

---

## Watching auth state in `useFavorites` handles login/logout transitions

When migrating favorites to Supabase-backed storage while keeping localStorage as an unauthenticated fallback, two separate mechanisms are needed:

- **`onMounted` (or explicit call in `default.vue`)** — handles the cold-start case where a user already has a valid session when they land on the page. `user` is populated immediately, so no `watch` fires. Without this, a returning logged-in user sees no hearts until something triggers a reload.
- **`watch(user)`** — handles mid-session transitions. `null → user` means just logged in: run the localStorage merge then load from Supabase. `user → null` means just logged out: clear the in-memory favorites set so hearts disappear immediately.

Without both, either the cold-start or the transition case breaks.

---

## Auth and favorites architecture — current state and rules

**Files:** `app/composables/useAuth.ts`, `app/composables/useFavorites.ts`, `app/layouts/default.vue`

### The Supabase client is a singleton

`useAuth.ts` holds a module-level `let client: SupabaseClient | null = null`. `getClient()` initializes it once and returns the same instance every time. This is exported as `useSupabase()` so any composable that needs to talk to Supabase gets the same client rather than creating a new one.

**Why this matters:** each `createClient()` call produces a fully independent Supabase instance with its own auth state machinery — its own `visibilitychange` listener, its own token refresh timer, its own `BroadcastChannel` subscription. When many components each call `createClient()`, every tab-switch triggers all of those instances to fire their auth recovery logic simultaneously and broadcast on a shared channel. The singleton client receives all of those broadcasts and fires `onAuthStateChange` once per broadcast. With 84 EventCards each creating their own client, a single tab-switch produced 84 `onAuthStateChange` events → 84 `user.value` sets → 84 `watch` triggers → 84 SELECT requests to user-favorites. Using a singleton collapses all of that to 1.

**Rule:** never call `createClient()` outside of `useAuth.ts`. Any composable or server utility that needs Supabase should import `useSupabase()`.

### `useFavorites` is pure state + actions — no side effects

`useFavorites` exposes `favorites` (shared `useState` array of favorited event IDs), `toggleFavorite`, `isFavorited`, `loadFavorites`, and `mergeAndMigrate`. It registers no `onMounted`, no `watch`, no subscriptions. It is safe to call from any component including list-item components like `EventCard`.

- `isFavorited(id)` is a local `.includes()` check — zero network calls.
- `toggleFavorite(id)` fires exactly one INSERT or DELETE per user click.
- `loadFavorites()` fires one SELECT and populates the shared `favorites` array for every component at once.

### `default.vue` owns all the side effects — exactly once

The layout mounts once and never remounts across page navigations. It is the right place to own the two side effects that should run once per session:

```
onMounted(() => {
  init()          // registers onAuthStateChange on the singleton client
  loadFavorites() // handles already-signed-in users on cold load
})

watch(user, (newUser, oldUser) => {
  if (newUser && newUser.id !== oldUser?.id) mergeAndMigrate()  // sign-in: merge localStorage → Supabase
  else if (!newUser) favorites.value = []                        // sign-out: clear hearts immediately
})
```

The `watch` compares user IDs, not object references. Supabase fires `TOKEN_REFRESHED` periodically, which creates a new user object with the same ID. Without the ID check, every token refresh would trigger `mergeAndMigrate()` → `loadFavorites()`. With it, token refreshes are a no-op.

### The full sign-in flow

1. User favorites something before signing in → `toggleFavorite` writes to `localStorage`.
2. User signs in via `LoginModal` → `setSession(session)` is called on the singleton client.
3. `onAuthStateChange` fires → `user.value` is set to the signed-in user.
4. `watch(user, ...)` in `default.vue` sees `null → user` (new ID) → calls `mergeAndMigrate()`.
5. `mergeAndMigrate()` reads `localStorage`, upserts all IDs into Supabase under `user_id`, clears `localStorage`, then calls `loadFavorites()`.
6. `loadFavorites()` fetches all favorite IDs from Supabase and writes them into `favorites` (shared state).
7. Every `EventCard` on screen immediately shows the correct heart state because they all read from the same `favorites` ref.

### Going forward

- Any new composable that needs Supabase: import `useSupabase()`, do not call `createClient()`.
- Any new feature that needs to react to auth state: add it to the `watch(user, ...)` in `default.vue`, not inside the composable.
- Do not add `onMounted` or `watch` to `useFavorites` — it is intentionally effect-free.
- RLS policies on `user-favorites`: SELECT is `true` (public read), INSERT and DELETE require `auth.uid() = user_id`. The Supabase client automatically attaches the user's JWT from localStorage, so no manual header passing is needed.

---

## Don't put `onMounted` or `watch` in a composable called from per-item components

**Files:** `app/composables/useFavorites.ts`, `app/layouts/default.vue`

`useFavorites` was originally written with both `onMounted(loadFavorites)` and `watch(user, ...)` inside the composable body. This worked fine when the composable was only called from a page or layout. The bug appeared when `EventCard.vue` also called `useFavorites()` to access `toggleFavorite` and `isFavorited`.

**What went wrong:** because composables inherit the calling component's lifecycle, every EventCard instance registered its own `onMounted` and its own watcher. With 30 events on screen, the page fired 30 simultaneous SELECT requests to Supabase on mount. More critically, Supabase's `onAuthStateChange` fires not just on sign-in/sign-out but also on `TOKEN_REFRESHED` and `INITIAL_SESSION` events — each of which sets `user.value` to a new object. Even though it's the same user, the new object reference triggers all 30 watchers, firing 30 more requests. This is what produced the appearance of a constant polling loop.

**The core issue:** `watch` inside a composable is not a singleton — it's registered once per call site. If a composable is used in N component instances, you get N watchers, N `onMounted` callbacks, and N requests every time the watched value changes.

**The fix:** treat composables that manage shared global state as state + actions only. Move all side effects (`onMounted`, `watch`, subscriptions) up to the single place that should own them — in this case `default.vue`, which mounts exactly once. `useFavorites` now returns functions but registers no lifecycle hooks. `default.vue` calls `loadFavorites()` on mount and owns the `watch(user, ...)` that drives the merge-and-migrate flow.

**Rule of thumb:** if a composable uses `useState` (shared Nuxt state) and could be called from a list-item component, never put `onMounted` or `watch` inside it. Those effects belong in a layout, a page, or a Nuxt plugin — somewhere with a known, bounded instance count.
