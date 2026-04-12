# Editorial Section — Music Writing & Pop Culture Essays

## The Idea

A lightweight editorial section on show.tn where emerging writers in the Chicagoland area (and beyond) can publish music essays, think pieces, reviews, and cultural commentary. Writers get a free publication credit and a real URL to put on their resume. The site gets long-form content that's shareable, indexed by search engines, and pulls in audiences beyond the weekly event listings.

---

## Why It Works

- **Incentive alignment is real.** Unpaid contributors need clips. A published byline at a real URL is worth more to an emerging writer than a Medium post.
- **Traffic has legs.** A good essay can circulate for months. Event listings are dead after the show. Editorial content compounds over time.
- **Fits the brand.** The site is already about the Chicago music scene. Writing about it is a natural extension, not a pivot.
- **Network effects.** Every writer brings their own readers — friends, family, other writers. Those readers may not have known the listings existed.

---

## Content Scope

Keep it focused to avoid becoming a generic culture blog:

- **Live show reviews** — "I was at that Empty Bottle show last Friday, here's what happened"
- **Scene essays** — "Why Logan Square venues are closing and what it means"
- **Artist spotlights** — emerging local acts worth knowing
- **Think pieces** — broader music/pop culture with a Chicago angle
- **Lists** — "10 Chicago venues ranked by sound quality", "best openers we saw this year"

Avoid: national celebrity coverage, album reviews with no local angle, anything that could run on any generic music blog.

---

## Contributor Guidelines (draft)

- Pitches welcome, finished drafts welcome
- Minimum ~400 words, no hard maximum
- Writer provides a short bio and optionally a headshot
- show.tn reserves the right to lightly edit for clarity and style
- Writers retain ownership of their work; show.tn gets a non-exclusive license to publish
- No payment initially — revisit if the section grows

---

## Developer Implementation

### Phase 1 — MVP (ship fast, validate demand)

The goal is to get something live with minimal infrastructure before committing to a real CMS.

**Option A: Nuxt Content (recommended for now)**

Nuxt has a first-party module (`@nuxt/content`) that reads markdown files from a `content/` directory and renders them as pages. Zero external dependencies, no CMS to manage.

1. Install the module:
   ```bash
   npm install @nuxt/content
   ```

2. Add to `nuxt.config.ts`:
   ```ts
   modules: ['@nuxt/ui', '@nuxt/image', '@nuxt/content'],
   ```

3. Create `content/articles/` and drop in `.md` files with frontmatter:
   ```md
   ---
   title: "Why Logan Square Venues Keep Closing"
   author: "Jane Doe"
   date: "2026-04-01"
   slug: "logan-square-venues-closing"
   excerpt: "A short description for previews and SEO."
   ---

   Article body here...
   ```

4. Create `app/pages/articles/index.vue` — lists all articles, reads from `queryCollection('articles')`
5. Create `app/pages/articles/[slug].vue` — renders individual article using `useAsyncData` + `queryCollection`

Writers submit a markdown file (via email, Google Form, or GitHub PR). You paste it into `content/articles/`, push, Netlify deploys. That's the whole workflow.

---

### Phase 2 — Proper CMS (if submissions pick up)

If you're getting regular submissions and the markdown-file workflow feels clunky, move to a headless CMS. Good options:

- **Sanity** — generous free tier, great editing experience, has a Nuxt integration
- **Notion as CMS** — writers draft in Notion, you pull via the Notion API (lower quality DX but zero onboarding friction for writers)
- **Tina CMS** — git-backed, writers edit via a UI that commits markdown to the repo

---

### Article Index Page (`/articles`)

- Grid or list of article cards
- Each card: title, author, date, excerpt, read time estimate
- Tag/category filtering (optional, add later)

### Individual Article Page (`/articles/[slug]`)

- Title, author byline, date published
- Author bio at the bottom
- Estimated read time in the header
- `og:image` and proper meta tags for social sharing — this is important, essays live and die by shareability
- Link back to `/chicago` to drive listings traffic from readers who come for the article

### SEO considerations

- Each article needs a unique `<title>` and `<meta description>` — Nuxt Content frontmatter handles this cleanly with `useSeoMeta`
- Articles are static at build time so they're fully crawlable
- Structured data (`Article` schema) is a nice-to-have for Google indexing

---

## Submission Workflow

**MVP:** Email submissions to a dedicated address, you manually add the markdown file and push.

**Better:** A Tally or Google Form that captures title, body, author name, bio. You copy-paste into a markdown file. Still manual but structured.

**Best (later):** A GitHub-based flow where contributors open a PR with their article file. You review and merge. Netlify deploys automatically. No manual steps on your end.

---

## What to Build First

1. Install `@nuxt/content`, wire up the module
2. Write one article yourself as a placeholder to prove the layout works
3. Create the index and article pages with clean typography (long-form reading needs good type treatment — consider a slightly wider `max-w` and larger `line-height` than the listings pages)
4. Add a visible "Write for us" link in the nav or footer with a short pitch and a submission email
5. Reach out to 2-3 writers you know personally and ask them to contribute — don't wait for organic submissions

If you get submissions from those 3 outreach attempts, the section is worth building out properly. If not, the cost was a few hours of dev work and a markdown file.
