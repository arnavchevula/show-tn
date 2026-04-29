# Pre-Release Checklist

Issues to fix before going public, beyond what's covered in `SECURITY_NOTES.md` and `TESTING.md`.

---

## Critical — Fix Before Launch

### 1. Hardcoded credentials in source code

These are exposed in your git history and client bundle.

- ~~**`app/composables/useAggregatedShows.ts:3-4`** — Supabase URL and anon key hardcoded directly in frontend code. Move to `useRuntimeConfig().public.supabaseUrl` / `supabaseKey`.~~
- ~~**`nuxt.config.ts:14-16`** — Supabase URL, Supabase key, and Twilio recovery code all hardcoded. Replace with `process.env.SUPABASE_URL`, etc.~~
- **`server/db/db.ts`** — Has a hardcoded fallback Supabase URL as the `||` default. Remove the fallback; let it fail loudly if env is missing.
- **`server/api/send-reminder.ts:13-14`** — Twilio phone numbers hardcoded. Move to env vars.

Check git history to see if credentials were ever committed, and rotate any that were:
```bash
git log --all --full-history -- .env
git grep "supabase.co"
```

### ~~2. Promise syntax error in `server/api/send-reminder.ts:16`~~

~~`.error()` does not exist on a Promise — this will throw at runtime.~~

```ts
// broken
.then(msg => console.log(msg.sid)).error(err => console.log(err))

// fix
.then(msg => console.log(msg.sid)).catch(err => console.log(err))
```

### 3. `Promise.all` misuse in `server/tasks/cms/update.ts`

`Promise.all` returns an array, not an object with a `data` property — destructuring silently gives `undefined`.

```ts
// broken
const { data } = await Promise.all([...])

// fix
const data = await Promise.all([...])
```

---

## High — Clean Up Before Launch

### ~~4. Remove ~40 `console.log` calls~~

~~Debug logs leak internal data (raw HTML, full DB result sets, scraped event dumps) into Netlify logs. Key offenders:~~

| ~~File~~ | ~~What it logs~~ |
|---|---|
| ~~`server/scraper/core.ts:28`~~ | ~~Raw HTML of every scraped page~~ |
| ~~`server/scraper/core.ts:90`~~ | ~~Every raw date string~~ |
| ~~`server/scraper/core.ts:128`~~ | ~~Every extracted title~~ |
| ~~`server/scraper/core.ts:137`~~ | ~~DB errors~~ |
| ~~`app/composables/useAggregatedShows.ts:15,16,21,22`~~ | ~~Date range + full DB result sets, client-side~~ |
| ~~`app/pages/chicago.vue:71`~~ | ~~Full `allShows` array, visible in browser devtools~~ |
| ~~`app/pages/chicago-shows.vue:46,59,69`~~ | ~~Tonight / tomorrow / this week show arrays~~ |
| ~~`server/api/*.ts` (all 24 venue files)~~ | ~~Venue name + DB errors on every scrape~~ |
| ~~`server/tasks/cms/update.ts:13,22,23`~~ | ~~DB delete result + scraped data~~ |

### 5. Devtools enabled in production — `nuxt.config.ts:4`

```ts
// current
devtools: { enabled: true }

// fix
devtools: { enabled: process.env.NODE_ENV === 'development' }
```

---

## Medium — Before You Drive Traffic

### ~~6. No `app/error.vue`~~

~~Nuxt has no custom error page. Unhandled runtime errors show a blank or framework default screen. Create a minimal `app/error.vue` to handle these gracefully.~~

### 7. No SEO meta tags on any page

None of the public pages have `useSeoMeta()` or `useHead()` calls — no title, description, or OG tags. This means poor search appearance and broken link previews when shared.

Pages that need it: `index.vue`, `chicago.vue`, `chicago-shows.vue`, `about.vue`.

```ts
// example — add to each page's <script setup>
useSeoMeta({
  title: 'Show TN — Chicago Music This Week',
  description: 'Find live music events happening this week at Chicago venues.',
  ogTitle: 'Show TN',
  ogDescription: 'Find live music events happening this week at Chicago venues.',
  ogImage: '/chicago.jpg',
})
```

### ~~8. `public/chicago.jpg` is 17MB~~

~~A 17MB static image will tank Lighthouse scores and mobile load time. Compress it or convert to WebP before launch.~~

---

## Low — Polish

### ~~9. No `netlify.toml`~~

~~No security headers and no cache configuration for static assets. Create a `netlify.toml` with at minimum:~~

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### ~~10. No `.env.example`~~

~~Anyone cloning the repo has no idea what env vars are required. Add a `.env.example` with placeholder values:~~

```
SUPABASE_URL=
SUPABASE_KEY=
TASK_SECRET=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=
TWILIO_TO_NUMBER=
TWILIO_RECOVER_CODE=
DB_NAME=
```

### ~~11. No `engines` field in `package.json`~~

~~Declare the Node version so Netlify and contributors use the right one:~~

```json
"engines": { "node": ">=18.0.0" }
```
