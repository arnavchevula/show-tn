# Feature Roadmap

## Priority Order

### ~~1. iCal Export~~ ✓
~~Lowest effort, immediate value for existing users. Pure output feature — no auth, no new infra. A user who can sync shows to their calendar is a retained user.~~

### ~~2. Flyer Upload + AI Parsing~~ ✓
~~The real differentiator — no local listings site does this. Promoters and artists become a distribution channel; if uploading a flyer gets their event listed, they'll share the page. Use Claude vision or Gemini to parse structured data (date, time, venue, headliner) from a flyer. Main complexity: file storage (Supabase Storage), a moderation/review step before publishing, and graceful handling of parse failures.~~

~~Do this before user accounts because it drives supply (more events), which makes accounts more valuable.~~

### ~~3. Supabase Storage / Image Handling~~
~~Self-contained, unblocks user-submitted events looking complete. Right now flyers are processed by Gemini and thrown away — the image is never stored. Steps: create a storage bucket, upload the buffer in `create-event-from-flyer` before passing to Gemini, return the public URL, store it in the `image` field on event creation. Natural first step since Supabase is already in the stack.~~

### ~~4. Expand Show Window~~
~~Currently the listing only shows 7 days out. Simple filter change — extend to 4-6 weeks, keep the day-filter available but default to "all upcoming." Prerequisite for favorites to be useful: users can't save shows they can't see.~~

### 5. Remaining Venue Scrapers
Two unblocked scrapers: **Smoke & Mirrors** (Dice widget — same pattern as Cobra Lounge) and **Podlasie** (Resident Advisor GraphQL API). Pending venues (Phyllis Musical Inn, Green Mill, Andy's Jazz, Kingston Mines, Jazz Showcase, etc.) can follow. Knock these out in parallel between bigger items.

### 6. User Accounts (Favorites / Reminders) — IN PROGRESS
**Phase 6a (current):** localStorage-backed favorites — heart button on `EventCard`, persisted locally, no auth required. Validates the feature and gives users immediate value before any backend work.

**Phase 6b:** Supabase Auth via phone OTP (Twilio). Steps in order:
1. **`user_favorites` table** — `user_id uuid references auth.users(id)`, `event_id text`, primary key on both. RLS: users can only read/write their own rows.
2. **`user_preferences` table** — `user_id uuid references auth.users(id)` (primary key), `phone text`, `email text`, `sms_alerts boolean`, `email_alerts boolean`. RLS: same pattern.
3. **Replace `useFavorites`** — on login, merge any existing localStorage favorites into Supabase, then read/write from Supabase going forward. Keep localStorage as the unauthenticated fallback.
4. **Auth UI** — sign-in modal triggering `supabase.auth.signInWithOtp({ phone })`. Supabase assigns a stable UUID per phone number so returning users resume their existing favorites and preferences automatically.

**Auth UI implementation notes:**
- `LoginModal.vue` lives in `default.vue` (the layout), not in any individual page. `Header.vue` emits a `login` event via `defineEmits(['login'])` and `emit('login')` on button click. `default.vue` catches it with `<Header @login="loginOpen = true" />` and passes `<LoginModal :open="loginOpen" @close="loginOpen = false" />`.
- Supabase OTP is two separate SDK calls — `signInWithOtp({ phone })` just sends the SMS and does not log the user in. `verifyOtp({ phone, token, type: 'sms' })` does the actual login and creates the session. Never combine them into one submit.
- The modal UI is two-step: a `step` ref toggles between a phone number screen ("Send Code") and an OTP entry screen ("Verify"). Use `UForm` + `UFormField` + `UInput` directly — not `UAuthForm`, which is designed for single-step username/password flows and doesn't give enough control for two-step logic.
- Split into two Nitro endpoints: `server/api/auth/send-otp.ts` (calls `signInWithOtp`) and `server/api/auth/verify-otp.ts` (calls `verifyOtp`), both accepting phone/token from the request body.
- No need for `nuxt-auth-utils` or `@nuxtjs/supabase`. The bare `@supabase/supabase-js` SDK handles session management automatically (stores access + refresh tokens in localStorage, handles refresh). `@nuxtjs/supabase` would require migrating every `new DBConnection().connect()` call in the server scrapers — not worth it. Auth is the only frontend-facing piece; wrap the client in a `useAuth` composable instead.

**`default.vue` wiring:**
```vue
<script setup lang="ts">
const loginOpen = ref(false)
</script>

<template>
  <div class="container mx-auto">
    <Header @login="loginOpen = true" />
    <slot />
    <Footer />
    <LoginModal :open="loginOpen" @close="loginOpen = false" />
  </div>
</template>
```

**`LoginModal.vue` structure:**
```vue
<script setup lang="ts">
import * as z from 'zod'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits(['close'])

const step = ref<'phone' | 'otp'>('phone')
const state = reactive({ phone: '', token: '' })

const phoneSchema = z.object({ phone: z.string().min(1) })
const otpSchema = z.object({ token: z.string().length(6) })

async function sendCode() {
  await $fetch('/api/auth/send-otp', { method: 'POST', body: { phone: state.phone } })
  step.value = 'otp'
}

async function verify() {
  await $fetch('/api/auth/verify-otp', { method: 'POST', body: { phone: state.phone, token: state.token } })
  emit('close')
}
</script>

<template>
  <UModal :open="props.open" @update:open="emit('close')">
    <template #content>
      <div class="p-6 flex flex-col gap-4">
        <h2>Login</h2>

        <UForm v-if="step === 'phone'" :schema="phoneSchema" :state="state" @submit="sendCode">
          <UFormField name="phone" label="Phone Number">
            <UInput v-model="state.phone" type="tel" placeholder="+1 (555) 000-0000" />
          </UFormField>
          <UButton type="submit" class="w-full mt-4">Send Code</UButton>
        </UForm>

        <UForm v-else :schema="otpSchema" :state="state" @submit="verify">
          <UFormField name="token" label="Enter Code">
            <UInput v-model="state.token" placeholder="000000" />
          </UFormField>
          <UButton type="submit" class="w-full mt-4">Verify</UButton>
          <UButton variant="ghost" class="w-full mt-2" @click="step = 'phone'">Back</UButton>
        </UForm>
      </div>
    </template>
  </UModal>
</template>
```
5. **Turnstile (SMS pump protection)** — Anyone can call `/api/auth/send-otp` and trigger Twilio charges. Add Cloudflare Turnstile as a hard gate before the SMS is sent.
   - Enable CAPTCHA in Supabase dashboard: Authentication → Security → Enable CAPTCHA protection, select Turnstile, paste site/secret keys
   - Add Cloudflare Turnstile site in the Cloudflare dashboard (free), get the sitekey
   - Install: `nuxt-turnstile` (wraps the Cloudflare widget as a Vue component and exposes a token ref)
   - In `LoginModal.vue`: add `<NuxtTurnstile v-model="turnstileToken" />` on the phone step. The token populates automatically when the widget completes.
   - Pass `options: { captchaToken: turnstileToken }` in the `signInWithOtp` call inside `send-otp.ts`. Supabase validates the token against Cloudflare before sending the SMS — invalid/missing token returns a 422 and no SMS is sent.
   - Also set a Twilio spending cap in the Twilio dashboard as a hard cost ceiling in case anything slips through.

6. **Reminders** — Netlify scheduled function dispatches day-of alerts using the Twilio integration already wired up for OTP.

6. Venue pages -> just filters on the current data and shows the upcoming shows for a specific venue and some background info on the venue IE maybe some history, address, some blurb from their website. 

7. Newsletter -> Ideally some sort of recommendation algorithm but for now could just do something like find the biggest shows and send them out in a monthly newsletter

### 8. Public Events API
Expose the Supabase events data via a thin Nitro wrapper so third-party developers and tools can query upcoming shows without needing Supabase credentials. Supabase already allows anonymous reads via the public anon key, so this is mostly a clean surface rather than new backend logic.

- `GET /api/events` — returns upcoming events (same 42-day window as the frontend), accepts optional query params: `venue`, `neighborhood`, `region`, `date` (YYYY-MM-DD), `limit` (default 50)
- `GET /api/events/:id` — returns a single event by UUID
- Response shape mirrors the existing `Event` type; no transformation needed beyond JSON serialization
- Rate-limit with a simple in-memory counter or Netlify's built-in rate limiting to avoid Supabase quota abuse
- Document the endpoints in a `docs/api.md` with example responses

### 9. Editorial
Blocked on content and outreach, not engineering. Not a dev priority right now.

## Throughline
iCal retains current users → flyer upload grows supply and brings in promoters as a new user type → storage makes user-submitted events first-class → expanded show window + accounts monetize the engagement you've built.
