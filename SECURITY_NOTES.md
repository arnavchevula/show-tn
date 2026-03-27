# Security Notes

## API Endpoint Authentication (`server/api/beat-kitchen.ts` and similar scrapers)

### Current Issue: Secret sent in request body

The secret key is currently passed via `body.secret`, which has these risks:

- **Log leakage** — request bodies are captured by logging middlewares, proxies, and Netlify logs. The secret could leak.
- **Caching/forwarding** — bodies can be stored by CDNs or intermediaries in ways that headers typically aren't.
- **Timing attacks** — direct string comparison (`!==`) is technically vulnerable to timing attacks (low risk in practice, but non-ideal).

---

### Fix: Move secret to an Authorization header

**In the handler:**
```ts
const authHeader = getHeader(event, 'authorization');
const token = authHeader?.replace('Bearer ', '');

if (token !== secretKey) {
  throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
}
```

**When calling the endpoint (e.g. from a Netlify scheduled function or cron):**
```
Authorization: Bearer <your-secret>
```

This applies to all scraper endpoints that use the same `taskSecret` pattern.

---

### Other considerations

- **Secret strength** — ensure `taskSecret` is a long, randomly generated string (32+ characters).
- **Rate limiting** — Netlify doesn't rate-limit by default. Since these endpoints launch Puppeteer (expensive), consider adding rate limiting or keeping the endpoints undocumented/unlisted.
- **HTTPS** — Netlify enforces HTTPS, so the secret is encrypted in transit regardless. This is already handled.
