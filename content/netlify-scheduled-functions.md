---
author: 'Jim Beam'
title: 'my friends don’t know me'
date: 'Dec 21, 2025'
description:'the loneliness of not being truly seen..'
bio:'Award winning journalist & digital creator. Creator of Under The Desk News: A soft place to land in a hard news cycle. Hello@underthedesknews.com'
urls: {"instagram":"https://instagram/navviec", "substack":"https://substack.com/@sadbeige?utm_source=substack-feed-item", "twitter":"https://x.com/tallships4life", "gmail":"mailto:arnav.chevula@gmail.com"}
---

Netlify's `@daily` (and cron-based) scheduled functions are **not reliable**. They can:
- Fire 30–60+ minutes late
- Be **skipped entirely** with no error or retry

This was observed on April 11, 2026: the midnight UTC (8:00 PM EDT) scheduled scraper run never fired. All three function executions that day were manual triggers.

## Fix

Use **GitHub Actions** as the cron trigger instead. GitHub Actions cron is far more reliable — Netlify still runs the function, GitHub just replaces the flaky trigger.

```yaml
# .github/workflows/scrape.yml
on:
  schedule:
    - cron: '0 0 * * *'  # midnight UTC
jobs:
  trigger:
    runs-on: ubuntu-latest
    steps:
      - run: curl -X POST ${{ secrets.NETLIFY_FUNCTION_URL }}
```

Store the Netlify function URL as a GitHub Actions secret (`NETLIFY_FUNCTION_URL`).

## Notes

- Netlify's scheduler silently skips missed runs — there's no alerting or catch-up behavior
- The `Next run` timestamp in function logs is self-reported by the function based on the cron expression, not evidence that Netlify's scheduler actually queued a run
- This is not a code issue — manually triggered functions work fine
