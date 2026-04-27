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
