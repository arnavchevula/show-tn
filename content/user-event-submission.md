---
author: 'Miles Davis'
title: 'was he special, or are you just good at making things feel special?'
date: 'Mar 16, 2026'
description: 'the most romantic days of my life'
bio: 'Comedy writer, poet & librarian. DRESS YOUR BABY IN SAGE AND TAUPE book coming April 21 (click my bio link to pre-order)'
urls: {"instagram":"https://instagram/navviec", "substack":"https://substack.com/@sadbeige?utm_source=substack-feed-item", "twitter":"https://x.com/tallships4life", "gmail":"mailto:arnav.chevula@gmail.com"}
---

Users submit → goes into a `pending_events` table → review & approve → moves to `events`.

Small local site, low volume — no automated moderation needed. The venue dropdown + manual review is enough to maintain data quality.

## The Form

Keep it minimal:

| Field | Notes |
|---|---|
| Artist / Event name | Required |
| Venue | Dropdown of known venues — prevents typos, limits off-topic submissions |
| Date | Required |
| Doors / Show time | Optional |
| Ticket URL | Optional, useful for validation |
| Submitter email | For follow-up, not published |

**Venue as a dropdown is the most important call.** It limits submissions to covered venues, makes duplicates obvious, and removes most spam.

## Duplicate Detection

On submit, query Supabase for existing events at the same venue on the same date:

```ts
const { data } = await supabase
  .from('events')
  .select('id, title')
  .eq('venue', submittedVenue)
  .eq('date', submittedDate)
```

If matches exist, surface them to the user: *"We already have these events at Metro on Apr 15 — is yours different?"* Let them confirm or cancel. Handles good-faith duplicates (e.g. two-night runs) without blocking them outright.

## Spam / Abuse

In order of effort:

1. **Honeypot field** — hidden input bots fill, humans don't. Reject any submission where it's populated. Zero user friction, catches most bots.
2. **Rate limit by IP** — reject more than 3 submissions/hour from the same IP in the API route.
3. **Cloudflare Turnstile** — free invisible captcha, add this if getting hit.

Skip reCAPTCHA v2 — checkbox friction hurts real users more than it stops bots.

## Admin Review Flow

A simple `/admin` page (protected by env-var password or Supabase auth) listing `pending_events` with Approve / Reject buttons. Approve copies the row to `events`, reject deletes it.

Can start even simpler: get email notifications on submission and approve manually in the Supabase dashboard until volume warrants building the UI.

## What to Skip For Now

- Email verification — overkill for a local music site
- ML spam filtering — way too much for this volume
- User accounts — unnecessary complexity
- Automated publishing — defeats the purpose of maintaining data quality
