# Feature Roadmap

## Priority Order

### 1. iCal Export
Lowest effort, immediate value for existing users. Pure output feature — no auth, no new infra. A user who can sync shows to their calendar is a retained user.

### 2. Flyer Upload + AI Parsing
The real differentiator — no local listings site does this. Promoters and artists become a distribution channel; if uploading a flyer gets their event listed, they'll share the page. Use Claude vision or Gemini to parse structured data (date, time, venue, headliner) from a flyer. Main complexity: file storage (Supabase Storage), a moderation/review step before publishing, and graceful handling of parse failures.

Do this before user accounts because it drives supply (more events), which makes accounts more valuable.

### 3. User Accounts (Likes / Saves / Reminders)
Most infrastructure: Supabase Auth + SSO, schema changes for likes/saves, notification/reminder system (email or push). Build this once iCal and flyer upload have grown the audience.

### 4. Editorial
Blocked on content and outreach, not engineering. Not a dev priority right now.

## Throughline
iCal retains current users → flyer upload grows supply and brings in promoters as a new user type → accounts monetize the engagement you've built.
