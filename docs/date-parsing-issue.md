# Date Parsing Issue: UTC vs Local Time

## The Problem

Dates stored in the DB as `YYYY-MM-DD` strings (e.g. `"2026-04-16"`) were displaying one day earlier than expected in the UI (e.g. showing April 15 instead of April 16).

## Root Cause

JavaScript's `new Date("2026-04-16")` parses ISO date-only strings as **UTC midnight**. When rendered in a US timezone (e.g. CDT = UTC-5), UTC midnight becomes the previous day at 7pm local time. So `toDateString()` outputs the wrong date.

```js
new Date("2026-04-16").toDateString()
// → "Wed Apr 15 2026"  (in CDT)
```

The fix is to force local time parsing by appending a time component:

```js
new Date("2026-04-16T00:00:00").toDateString()
// → "Thu Apr 16 2026"  ✓
```

## Where It Was Fixed

### `useAggregatedShows.ts` (main listing)
The composable that fetches all shows converts `parsedDate` strings into `Date` objects using:
```js
const [year, month, day] = show.parsedDate.split('-').map(Number);
return { ...show, parsedDate: new Date(year, month - 1, day) };
```
`new Date(year, month - 1, day)` always constructs in local time — this is the correct approach and was already in place.

### `chicago/[id].vue` (show detail page)
Same pattern used when fetching a single show directly from Supabase:
```js
const [year, month, day] = data.parsedDate.split('-').map(Number)
return { ...data, parsedDate: new Date(year, month - 1, day) }
```
Also already correct.

### `EventCard.vue` (used in create-event duplicate check)
This component receives raw DB strings (not pre-converted `Date` objects) when used in the `/create-event` duplicate match flow. It was doing:
```js
new Date(props.show?.parsedDate).toDateString() // ❌ UTC parse
```
Fixed with a computed that handles both cases — a `Date` object (from the main listing) or a raw string (from the create-event API):
```js
const displayDate = computed(() => {
  const d = props.show?.parsedDate;
  if (!d) return '';
  if (d instanceof Date) return d.toDateString();
  return new Date(d + 'T00:00:00').toDateString(); // force local time
});
```

## The SSR Timezone Problem (New Tab vs. Click-Through)

A second, subtler variant of the same bug appeared on the `chicago/[id].vue` detail page: the date displayed correctly when navigating to it by clicking a card, but showed one day earlier when opening the URL directly in a new tab or refreshing.

### Why the two navigation paths behave differently

**Click-through (client-side navigation):**
`useAsyncData` runs in the browser. It first checks the `allShows` Nuxt state, finds the show already loaded by the listing page, and returns it. The `parsedDate` on that object was created by `useAggregatedShows` using `new Date(year, month - 1, day)` — which constructs in the browser's local timezone. Correct.

**New tab / direct URL (SSR):**
`useAsyncData` runs on the **server** before the page is sent to the browser. `allShows` state is empty on a fresh request, so it falls through to a Supabase fetch. The original code then did:
```js
const [year, month, day] = data.parsedDate.split('-').map(Number)
return { ...data, parsedDate: new Date(year, month - 1, day) }
```
On the surface this looks identical to `useAggregatedShows`. But the server runs in **UTC**. So `new Date(2026, 3, 16)` on the server means UTC midnight — `2026-04-16T00:00:00.000Z`. Nuxt serializes this `Date` object into the page payload and sends it to the browser. The browser deserializes it back into the same UTC timestamp. In CDT (UTC-5) that timestamp is April 15 at 7pm, so `toDateString()` renders "Wed Apr 15 2026".

Visually:

```
Server (UTC):   new Date(2026, 3, 16)  →  2026-04-16T00:00:00.000Z
                        ↓ serialized into page payload
Client (CDT):   same timestamp         →  April 15, 2026 at 7:00 PM local
                toDateString()         →  "Wed Apr 15 2026"  ❌
```

### Why `new Date(year, month-1, day)` is unsafe in SSR

`new Date(year, month-1, day)` is only timezone-safe when it runs in the same timezone as the user's browser. It creates a date at **local midnight**, so "local" has to mean the user's machine. A server running UTC produces UTC midnight — a different point in time than CDT midnight.

### The fix: never construct a `Date` object on the server for display purposes

The corrected `[id].vue` no longer converts `parsedDate` to a `Date` at all in the SSR fetch path. Instead it keeps the raw `"YYYY-MM-DD"` string and formats it using `Date.UTC()` combined with `Intl.DateTimeFormat` pinned to `timeZone: 'UTC'`:

```js
const [year, month, day] = d.split('-').map(Number)
new Intl.DateTimeFormat('en-US', {
  weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  timeZone: 'UTC'
}).format(new Date(Date.UTC(year, month - 1, day)))
```

`Date.UTC(year, month - 1, day)` always produces UTC midnight regardless of where the code runs. `timeZone: 'UTC'` tells `Intl` to render that timestamp in UTC rather than the local timezone. Since the timestamp IS UTC midnight for that date, the rendered day is always correct — on the server, in the browser, in any timezone.

```
Server (UTC):   Date.UTC(2026, 3, 16)  →  2026-04-16T00:00:00.000Z
Client (CDT):   Date.UTC(2026, 3, 16)  →  2026-04-16T00:00:00.000Z  (same)
Intl (UTC tz):  format(...)            →  "Thu, Apr 16, 2026"  ✓
```

The `displayDate` computed also handles the click-through path where `parsedDate` arrives as a client-side `Date` object (already correct local time):
```js
const displayDate = computed(() => {
  const d = show.value?.parsedDate
  if (!d) return ''
  if (d instanceof Date) return d.toDateString()        // client-side nav: already correct
  const [year, month, day] = d.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(Date.UTC(year, month - 1, day)))   // SSR/new tab: timezone-safe
})
```

## Why the Workarounds in `chicago/index.vue` Already Worked

The `filteredShowsWithDays` computed compares `show.parsedDate.getTime()` against `currentDate.value.getTime()`. Because `useAggregatedShows` pre-converts all `parsedDate` values using `new Date(year, month - 1, day)` (local time), both sides of the comparison are in local time and match correctly. The workaround was correct — it just wasn't applied consistently to `EventCard` when used outside the main listing context.

## Summary

| Location | `parsedDate` type at render time | Was broken? | Fix |
|---|---|---|---|
| `useAggregatedShows.ts` | string → `Date` (local) | No | Already used `new Date(y, m, d)` |
| `chicago/[id].vue` (click-through) | `Date` (local, from state) | No | Pre-populated from `allShows` |
| `chicago/[id].vue` (new tab / SSR) | `Date` (UTC, from server) | **Yes** | Keep as string; format with `Date.UTC` + `Intl` `timeZone: 'UTC'` |
| `chicago/index.vue` filtering | `Date` (local) | No | Pre-converted by composable |
| `EventCard.vue` (create-event flow) | raw string from API | **Yes** | Added `instanceof Date` check + `T00:00:00` suffix |
