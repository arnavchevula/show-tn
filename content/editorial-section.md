---
title: 'cheating'
author: 'Sabrina Carpenter'
date: 'Mar 31, 2026'
description: 'It wasnt cheating or some dramatic betrayal. What I found was worse: his uncertainty.'
bio: 'Author of the novels Consolation, The Summer Demands, and The Sun in Your Eyes, and the not-novel Watching the Detective (out 11/18/25).'
urls: {
   "instagram":"https://instagram/navviec", 
   "substack":"https://substack.com/@sadbeige?utm_source=substack-feed-item", 
   "twitter":"https://x.com/tallships4life", 
   "gmail":"mailto:arnav.chevula@gmail.com"
}
---
One of the most romantic days of my life unfolded on a beach at sunset with a man I dated for three months. There was a heat wave out east that week, the kind that makes the air feel thick and dreamy. Even at eight o’clock the sand was still warm under our feet. The horizon had turned that improbable hot pink, and the sun melted slowly into the water, spilling gold and orange down the length of the shore.

“This is one of the best dates I’ve had in awhile,” he said, his blonde hair falling in sections over his forehead.

It was my idea to leave the city. To rent a car and drive out to a Montauk for a middle of the week getaway. We both worked from home, and my situationship (who was thirty-three but operated with the vague schedule of a college sophomore) was free enough to disappear for a few days.

It was also my idea to bring my favorite book of short stories to the beach. When Watched, by Leopoldine Core.

He listened so carefully. That was the surprising part. At one of the stories, he actually started tearing up. He said it reminded him of something from his childhood that he didn’t feel like explaining. I didn’t press. It felt like enough just to sit there beside him while the light drained from the sky.

I remember thinking, with this sudden, almost frightening certainty: this is what love is supposed to feel like. Reading something beautiful to someone while the sun dissolves into the ocean. For a moment, it even made me forget about my last situationship, who we’ll call Luke.

I fell for Luke, who was 6’2 and boyishly handsome, on a road trip we took upstate in his big, beaten-down pickup truck. The road trip was a premature idea. I’d proposed it to him sometime around 3 a.m., drunk, during the strange confessional window that opens during pillow talk.

The drive was three hours. We spent most of it listening to Lana Del Rey while I asked him questions about his life in the investigative, romantic way you interrogate someone when you’ve already decided you like them.

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
