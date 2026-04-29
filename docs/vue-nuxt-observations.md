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


## lack of QA data making me test in prod

When I was testing the [id].vue pages for events I realized that in useAggregatedShows i'm grabbing from events but elsewhere i'm doing events-qa (based on env file) so when I was testing the event pages, I would navigate somewhere that didn't exist because I was using a prod id (querying useAggregatedShows with hardcoded 'events' parameter) and querying events-qa with it. So i just changed the events env table name to just 'events' ie using prod instead of qa.. but all the other tables for local dev (pending, archived) use their qa variants. Going forward once I have unit testing enabled I will have substantial QA data so I won't need to test in prod. Thankfully any write operations are only happening to qa for dev work. 