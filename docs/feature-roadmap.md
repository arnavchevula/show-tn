# Feature Roadmap

## Priority Order

### ~~1. iCal Export~~ ✓
~~Lowest effort, immediate value for existing users. Pure output feature — no auth, no new infra. A user who can sync shows to their calendar is a retained user.~~

### ~~2. Flyer Upload + AI Parsing~~ ✓
~~The real differentiator — no local listings site does this. Promoters and artists become a distribution channel; if uploading a flyer gets their event listed, they'll share the page. Use Claude vision or Gemini to parse structured data (date, time, venue, headliner) from a flyer. Main complexity: file storage (Supabase Storage), a moderation/review step before publishing, and graceful handling of parse failures.~~

~~Do this before user accounts because it drives supply (more events), which makes accounts more valuable.~~

### ~~3. Supabase Storage / Image Handling~~
~~Self-contained, unblocks user-submitted events looking complete. Right now flyers are processed by Gemini and thrown away — the image is never stored. Steps: create a storage bucket, upload the buffer in `create-event-from-flyer` before passing to Gemini, return the public URL, store it in the `image` field on event creation. Natural first step since Supabase is already in the stack.~~

### 4. Expand Show Window
Currently the listing only shows 7 days out. Simple filter change — extend to 4-6 weeks, keep the day-filter available but default to "all upcoming." Prerequisite for favorites to be useful: users can't save shows they can't see.

### 5. Remaining Venue Scrapers
Two unblocked scrapers: **Smoke & Mirrors** (Dice widget — same pattern as Cobra Lounge) and **Podlasie** (Resident Advisor GraphQL API). Pending venues (Phyllis Musical Inn, Green Mill, Andy's Jazz, Kingston Mines, Jazz Showcase, etc.) can follow. Knock these out in parallel between bigger items.

### 6. User Accounts (Favorites / Reminders)
Supabase Auth + SSO (Google first, Apple later). Favorites first: `user_favorites` table, heart button on `EventCard`, profile page. Reminders last — most infra: Twilio for SMS, Resend for email, Netlify scheduled function to dispatch day-of alerts. Consider localStorage-backed favorites as a stepping stone to validate the feature before building auth.

### 7. Editorial
Blocked on content and outreach, not engineering. Not a dev priority right now.

## Throughline
iCal retains current users → flyer upload grows supply and brings in promoters as a new user type → storage makes user-submitted events first-class → expanded show window + accounts monetize the engagement you've built.
