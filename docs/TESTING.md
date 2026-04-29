# Unit Testing Guide for show-tn

## Setup

Vitest is the recommended test framework — it's the standard for Nuxt/Vue projects with native TypeScript support.

```bash
npm install -D vitest @vue/test-utils happy-dom
```

Add to `package.json`:
```json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:run": "vitest run"
}
```

Create `vitest.config.ts` at the project root:
```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
  },
})
```

Place test files alongside the source files they test, using the `.test.ts` suffix (e.g., `date.test.ts` next to `date.ts`). For Vue components, use `.test.ts` files alongside `.vue` files.

---

## Test Areas

### 1. Date Parsing — `server/api/utils/date.ts`

**Why:** `DateParser` contains the most complex logic in the codebase — year rollover handling across December/January is easy to regress. Pure class with no dependencies, so tests are fast and straightforward.

**What to test:**
- Normal date parsing within the same year
- December events set `hasDecemberPassed = true`
- January events after December roll the year forward
- Whitespace or odd input strings

```ts
// server/api/utils/date.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { DateParser } from './date'

describe('DateParser', () => {
  let parser: DateParser

  beforeEach(() => {
    parser = new DateParser()
  })

  it('parses a standard mid-year date', () => {
    const result = parser.parseRawDate('June 15')
    expect(result.getMonth()).toBe(5) // June = 5
    expect(result.getDate()).toBe(15)
    expect(result.getFullYear()).toBe(new Date().getFullYear())
  })

  it('parses a December date and sets hasDecemberPassed', () => {
    const dec = parser.parseRawDate('December 20')
    expect(dec.getMonth()).toBe(11) // December = 11
    expect(dec.getDate()).toBe(20)
  })

  it('rolls year forward for January after December has passed', () => {
    const currentYear = new Date().getFullYear()

    parser.parseRawDate('December 31') // triggers hasDecemberPassed = true
    const jan = parser.parseRawDate('January 5')

    expect(jan.getFullYear()).toBe(currentYear + 1)
    expect(jan.getMonth()).toBe(0)
    expect(jan.getDate()).toBe(5)
  })

  it('does not roll year for January without prior December', () => {
    const currentYear = new Date().getFullYear()
    const result = parser.parseRawDate('January 5')
    expect(result.getFullYear()).toBe(currentYear)
  })

  it('resets hasDecemberPassed after January rollover', () => {
    const currentYear = new Date().getFullYear()

    parser.parseRawDate('December 31')
    parser.parseRawDate('January 1')  // triggers rollover + reset

    // A second January should NOT roll the year again
    const jan2 = parser.parseRawDate('January 15')
    expect(jan2.getFullYear()).toBe(currentYear + 1)
  })

  it('sets time to midnight (00:00:00.000)', () => {
    const result = parser.parseRawDate('March 10')
    expect(result.getHours()).toBe(0)
    expect(result.getMinutes()).toBe(0)
    expect(result.getSeconds()).toBe(0)
    expect(result.getMilliseconds()).toBe(0)
  })
})
```

---

### 2. Scraper Core Logic — `server/scraper/core.ts`

**Why:** `extractEvents` is the heart of the scraper. It runs for every venue on every scrape cycle. Testing it with HTML fixtures catches selector regressions without needing a real browser or network.

**What to test:**
- `extractTitle` strips `titleExclude` strings
- `extractImage` handles both `src` and CSS `style` `url()` extraction
- `extractDate` handles the `month`/`day` selector path vs. the combined date path vs. the plain date path
- `extractVenue` falls back to `config.displayName` when no `venue` selector is set
- `extractHeader` falls back to `${displayName} presents: `
- Full `extractEvents` integration using a sample HTML fixture

> Note: `scrapeVenue` itself (which launches Puppeteer and saves to the DB) should not be unit tested — it is integration-level. Test `extractEvents` in isolation instead. Since `extractEvents` is not exported, you can either export it for testing or test the behavior indirectly by mocking `launchBrowser`/`getPageHtml` and `saveEvents`.

```ts
// server/scraper/core.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the DB and browser so scrapeVenue can be called without side effects
vi.mock('../db/db', () => ({
  DBConnection: vi.fn().mockImplementation(() => ({
    connect: () => ({
      from: () => ({
        delete: () => ({ eq: () => Promise.resolve({}) }),
        insert: () => Promise.resolve({ error: null }),
      }),
    }),
  })),
}))

vi.mock('./browser', () => ({
  launchBrowser: vi.fn().mockResolvedValue({ close: vi.fn() }),
  getPageHtml: vi.fn(),
}))

import { scrapeVenue } from './core'
import { getPageHtml } from './browser'
import type { VenueConfig } from './types'

// Minimal config matching Smartbar's structure
const mockConfig: VenueConfig = {
  name: 'smartbar',
  displayName: 'Smartbar',
  url: 'https://smartbarchicago.com/events',
  imageExtractor: 'src',
  selectors: {
    eventList: '.eventMainWrapper',
    eventItem: '.eventMainWrapper',
    title: 'h2',
    date: '#eventDate',
    image: 'img',
    support: 'h4',
    headliners: 'h2',
    url: 'a.url',
    header: '.eventTagLine',
  },
}

const sampleHtml = `
  <div class="eventMainWrapper">
    <h2>DJ Stingray</h2>
    <div id="eventDate">April 12</div>
    <h4>Special Guest</h4>
    <img src="https://example.com/flyer.jpg" />
    <a class="url" href="/events/dj-stingray">Tickets</a>
    <div class="eventTagLine">Smartbar presents:</div>
  </div>
`

describe('scrapeVenue', () => {
  beforeEach(() => {
    vi.mocked(getPageHtml).mockResolvedValue(sampleHtml)
  })

  it('returns success status with extracted events', async () => {
    const result = await scrapeVenue(mockConfig)
    expect(result.status).toBe('success')
    expect(result.count).toBe(1)
    expect(result.content).toHaveLength(1)
  })

  it('extracts title from the h2 selector', async () => {
    const result = await scrapeVenue(mockConfig)
    expect(result.content![0].title).toBe('DJ Stingray')
  })

  it('extracts support from the h4 selector', async () => {
    const result = await scrapeVenue(mockConfig)
    expect(result.content![0].support).toBe('Special Guest')
  })

  it('extracts image src', async () => {
    const result = await scrapeVenue(mockConfig)
    expect(result.content![0].image).toBe('https://example.com/flyer.jpg')
  })

  it('extracts event URL', async () => {
    const result = await scrapeVenue(mockConfig)
    expect(result.content![0].url).toBe('/events/dj-stingray')
  })

  it('falls back to displayName for venue when no venue selector', async () => {
    const result = await scrapeVenue(mockConfig)
    expect(result.content![0].venue).toBe('Smartbar')
  })

  it('falls back to "${displayName} presents: " for header when no header selector matches', async () => {
    const result = await scrapeVenue(mockConfig)
    expect(result.content![0].header).toBe('Smartbar presents:')
  })

  it('strips titleExclude strings from the title', async () => {
    const configWithExclude: VenueConfig = {
      ...mockConfig,
      titleExclude: ['Buy Tickets'],
    }
    vi.mocked(getPageHtml).mockResolvedValue(`
      <div class="eventMainWrapper">
        <h2>DJ Stingray Buy Tickets</h2>
        <div id="eventDate">April 12</div>
      </div>
    `)
    const result = await scrapeVenue(configWithExclude)
    expect(result.content![0].title).toBe('DJ Stingray')
  })

  it('extracts image from inline CSS style url() when imageExtractor is "style"', async () => {
    const configWithStyle: VenueConfig = {
      ...mockConfig,
      imageExtractor: 'style',
      selectors: { ...mockConfig.selectors, image: '.cover' },
    }
    vi.mocked(getPageHtml).mockResolvedValue(`
      <div class="eventMainWrapper">
        <h2>Test Event</h2>
        <div id="eventDate">May 1</div>
        <div class="cover" style="background-image: url('https://example.com/bg.jpg')"></div>
      </div>
    `)
    const result = await scrapeVenue(configWithStyle)
    expect(result.content![0].image).toBe('https://example.com/bg.jpg')
  })

  it('returns error status when getPageHtml throws', async () => {
    vi.mocked(getPageHtml).mockRejectedValue(new Error('Network timeout'))
    const result = await scrapeVenue(mockConfig)
    expect(result.status).toBe('error')
    expect(result.message).toBe('Network timeout')
    expect(result.content).toBeNull()
  })
})
```

---

### 3. Venue Configs — `server/config/*.ts`

**Why:** Configs are data-only files but silently wrong selectors (missing required fields, wrong `imageExtractor` values) cause entire venues to stop working. A schema validation test catches these at CI time rather than at scrape time.

**What to test:**
- Every config exports a valid `VenueConfig` shape
- Required fields (`name`, `url`, `selectors.eventList`, `selectors.title`, `selectors.date`) are present and non-empty
- `imageExtractor` is either `'src'`, `'style'`, or absent

```ts
// server/config/configs.test.ts
import { describe, it, expect } from 'vitest'
import type { VenueConfig } from '../scraper/types'

// Import all configs
import { hideoutConfig } from './hideout'
import { smartbarConfig } from './smartbar'
import { cobraLoungeConfig } from './cobra-lounge'
import { thaliahallConfig } from './thalia-hall'
import { sleepingVillageConfig } from './sleeping-village'
// ... add the rest as you go

const allConfigs: VenueConfig[] = [
  hideoutConfig,
  smartbarConfig,
  cobraLoungeConfig,
  thaliahallConfig,
  sleepingVillageConfig,
]

describe('Venue configs', () => {
  allConfigs.forEach((config) => {
    describe(config.name, () => {
      it('has a non-empty name', () => {
        expect(config.name).toBeTruthy()
      })

      it('has a valid url', () => {
        expect(config.url).toMatch(/^https?:\/\//)
      })

      it('has a non-empty eventList selector', () => {
        expect(config.selectors.eventList).toBeTruthy()
      })

      it('has a non-empty title selector', () => {
        expect(config.selectors.title).toBeTruthy()
      })

      it('has a non-empty date selector (or month+day selectors)', () => {
        const hasDate = !!config.selectors.date
        const hasMonthAndDay = !!config.selectors.month && !!config.selectors.day
        expect(hasDate || hasMonthAndDay).toBe(true)
      })

      it('imageExtractor is "src", "style", or absent', () => {
        if (config.imageExtractor !== undefined) {
          expect(['src', 'style']).toContain(config.imageExtractor)
        }
      })
    })
  })
})
```

---

### 4. Auth Utility — `server/api/utils/auth.ts`

**Why:** `validateSecret` is a security boundary. It relies on Nuxt's `useRuntimeConfig` and `createError`, both of which need to be mocked in tests. These tests confirm it throws the correct HTTP error codes for invalid/missing secrets.

**What to test:**
- Throws `401` when secret is wrong
- Throws `500` when no `taskSecret` is configured
- Does not throw when the secret matches

```ts
// server/api/utils/auth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Nuxt composables before importing the module under test
vi.mock('#imports', () => ({
  useRuntimeConfig: vi.fn(),
  createError: vi.fn((opts) => {
    const err = new Error(opts.statusMessage)
    ;(err as any).statusCode = opts.statusCode
    return err
  }),
}))

import { useRuntimeConfig, createError } from '#imports'
import { validateSecret } from './auth'

describe('validateSecret', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not throw when the secret matches', () => {
    vi.mocked(useRuntimeConfig).mockReturnValue({ taskSecret: 'correct-secret' } as any)
    expect(() => validateSecret({ secret: 'correct-secret' })).not.toThrow()
  })

  it('throws 401 when the secret is wrong', () => {
    vi.mocked(useRuntimeConfig).mockReturnValue({ taskSecret: 'correct-secret' } as any)
    expect(() => validateSecret({ secret: 'wrong-secret' })).toThrow()
    expect(createError).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 })
    )
  })

  it('throws 401 when secret is missing from the body', () => {
    vi.mocked(useRuntimeConfig).mockReturnValue({ taskSecret: 'correct-secret' } as any)
    expect(() => validateSecret({})).toThrow()
    expect(createError).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 })
    )
  })

  it('throws 500 when taskSecret is not configured', () => {
    vi.mocked(useRuntimeConfig).mockReturnValue({ taskSecret: '' } as any)
    expect(() => validateSecret({ secret: 'any-secret' })).toThrow()
    expect(createError).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 500 })
    )
  })
})
```

---

### 5. Vue Components — `app/components/ShowCard.vue`

**Why:** `ShowCard` is the primary display component rendered for every event. Tests confirm it maps props to the right output and gracefully handles missing optional fields (e.g., no image → placeholder, no support → falls back to subtitle/headliners).

**What to test:**
- Renders `title` from props
- Falls back to placeholder image when `image` is absent
- `description` uses `support` first, then `subtitle`, then `headliners`

> Note: `ShowCard` uses `UBlogPost` from `@nuxt/ui`. You'll need to stub it in tests since it's a Nuxt-auto-imported component.

```ts
// app/components/ShowCard.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ShowCard from './ShowCard.vue'

// Stub UBlogPost so we can inspect the props passed to it
const UBlogPostStub = {
  name: 'UBlogPost',
  props: ['title', 'description', 'image', 'date', 'authors'],
  template: '<div data-testid="blog-post" />',
}

const baseShow = {
  title: 'DJ Stingray',
  parsedDate: new Date('2026-04-12'),
  venue: 'Smartbar',
  age: '21+',
  image: 'https://example.com/flyer.jpg',
  url: 'https://smartbarchicago.com/events/dj-stingray',
  support: 'Special Guest',
  subtitle: '',
  headliners: 'DJ Stingray',
}

function mountCard(show: Partial<typeof baseShow>) {
  return mount(ShowCard, {
    props: { show: { ...baseShow, ...show } },
    global: { stubs: { UBlogPost: UBlogPostStub } },
  })
}

describe('ShowCard', () => {
  it('passes the title to UBlogPost', () => {
    const wrapper = mountCard({})
    const blogPost = wrapper.findComponent(UBlogPostStub)
    expect(blogPost.props('title')).toBe('DJ Stingray')
  })

  it('uses show.image when provided', () => {
    const wrapper = mountCard({})
    const blogPost = wrapper.findComponent(UBlogPostStub)
    expect(blogPost.props('image')).toBe('https://example.com/flyer.jpg')
  })

  it('falls back to placeholder when image is absent', () => {
    const wrapper = mountCard({ image: undefined })
    const blogPost = wrapper.findComponent(UBlogPostStub)
    expect(blogPost.props('image')).toBe('https://placehold.co/256')
  })

  it('uses support as description when present', () => {
    const wrapper = mountCard({ support: 'Special Guest', subtitle: '', headliners: '' })
    const blogPost = wrapper.findComponent(UBlogPostStub)
    expect(blogPost.props('description')).toBe('Special Guest')
  })

  it('falls back to subtitle when support is absent', () => {
    const wrapper = mountCard({ support: '', subtitle: 'Live DJ Set', headliners: '' })
    const blogPost = wrapper.findComponent(UBlogPostStub)
    expect(blogPost.props('description')).toBe('Live DJ Set')
  })

  it('falls back to headliners when both support and subtitle are absent', () => {
    const wrapper = mountCard({ support: '', subtitle: '', headliners: 'DJ Stingray' })
    const blogPost = wrapper.findComponent(UBlogPostStub)
    expect(blogPost.props('description')).toBe('DJ Stingray')
  })

  it('sets the correct venue in the authors array', () => {
    const wrapper = mountCard({})
    const blogPost = wrapper.findComponent(UBlogPostStub)
    const authors = blogPost.props('authors') as any[]
    expect(authors[0].name).toBe('Smartbar')
  })

  it('opens event link in a new tab', () => {
    const wrapper = mountCard({})
    const blogPost = wrapper.findComponent(UBlogPostStub)
    const authors = blogPost.props('authors') as any[]
    expect(authors[0].target).toBe('_blank')
    expect(authors[0].to).toBe('https://smartbarchicago.com/events/dj-stingray')
  })
})
```

---

## What NOT to Unit Test

| Area | Reason |
|---|---|
| `scrapeVenue` browser launch | Puppeteer is integration-level — slow, flaky, needs a real browser |
| Supabase DB calls | Hit a real test DB in integration tests, not unit tests |
| API route handlers (`/server/api/*.ts`) | Mostly glue code; test via Nitro integration tests if needed |
| `useAggregatedShows` Supabase fetch | Mock at the composable boundary; the date-filtering logic is the part worth testing |

---

## Running Tests

```bash
# Watch mode (during development)
npm test

# Single run (CI)
npm run test:run
```
