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
5. **Reminders** — Netlify scheduled function dispatches day-of alerts using the Twilio integration already wired up for OTP.

### 7. Editorial
Blocked on content and outreach, not engineering. Not a dev priority right now.

## Throughline
iCal retains current users → flyer upload grows supply and brings in promoters as a new user type → storage makes user-submitted events first-class → expanded show window + accounts monetize the engagement you've built.
