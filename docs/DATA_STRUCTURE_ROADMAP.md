# Data Structure & Architecture Roadmap

## Current Issues

1. **Date format is inconsistent** - stored as raw scraped strings
2. **No caching** - scraping happens on every page load (very slow)
3. **No data persistence** - everything is in-memory
4. **No date-based organization** - frontend just loops through all shows
5. **No filtering/sorting logic**
6. **Not grabbing tonights event from empty bottle**
6. **Not grabbing tonights event from thalia hall**
7. **Need to grab images when web scraping**
8. **possible name: show-tonight or marquee.io**
9. **resident advisor api, can get a bunch of venues that way** (https://apify.com/augeas/resident-advisor/api)
10. **could also scrape dice, eventbrite** 


## Best Practice Recommendations

### 1. Standardize Date/Time Storage

Update your Event interface in `types/event.d.ts`:

```typescript
export interface Event {
  id: string; // Use UUID instead of number
  date: Date | string; // Store as ISO 8601 string
  parsedDate?: Date; // For computed sorting
  // ... rest of fields
}
```

In your scrapers, normalize dates:

```typescript
// Parse venue-specific date formats to ISO 8601
const rawDate = $(elm).find(".m-date__singleDate").text();
const parsedDate = parseVenueDate(rawDate); // Custom parser
const isoDate = parsedDate.toISOString();
```

### 2. Add Caching Layer

Options (in order of complexity):

#### Option A: Simple file-based cache (easiest, good for MVP)

- Cache scraped data to JSON files with timestamps
- Re-scrape only when cache is stale (e.g., every 6-12 hours)
- Store in `server/cache/venue-{name}-{date}.json`

#### Option B: Use Nuxt's built-in caching

```typescript
// In your API routes
export default defineCachedEventHandler(
  async (event) => {
    // scraping logic
  },
  {
    maxAge: 60 * 60 * 6, // 6 hours
    swr: true,
  }
);
```

#### Option C: Database (best for production)

- PostgreSQL/SQLite with scheduled background scraping
- Use a cron job or Nuxt's server tasks to scrape periodically
- Much faster page loads

### 3. Create a Data Aggregation Composable

Create `app/composables/useAggregatedShows.ts`:

```typescript
export const useAggregatedShows = () => {
  const allShows = useState<Event[]>("all-shows", () => []);

  const fetchAllVenues = async () => {
    // Fetch from all venues in parallel
    const [jamData, subtData, beatKitchenData, lhstData, emptyBottleData] =
      await Promise.all([
        $fetch("/api/jam-productions"),
        $fetch("/api/subt"),
        $fetch("/api/beat-kitchen"),
        $fetch("/api/lh-st"),
        $fetch("/api/empty-bottle"),
      ]);

    // Combine all shows
    const combined = [
      ...(jamData?.content || []),
      ...(subtData?.content || []),
      ...(beatKitchenData?.content || []),
      ...(lhstData?.content || []),
      ...(emptyBottleData?.content || []),
    ];

    // Parse dates and sort
    const withParsedDates = combined.map((show) => ({
      ...show,
      parsedDate: new Date(show.date),
    }));

    // Sort by date
    allShows.value = withParsedDates.sort(
      (a, b) => a.parsedDate.getTime() - b.parsedDate.getTime()
    );

    return allShows;
  };

  return { allShows, fetchAllVenues };
};
```

### 4. Organize Shows by Date Ranges

Create computed properties for filtering:

```typescript
// In your page or composable
const today = computed(() => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
});

const showsTonight = computed(() => {
  const tonight = new Date();
  tonight.setHours(0, 0, 0, 0);
  return allShows.value.filter((show) => {
    const showDate = new Date(show.parsedDate);
    showDate.setHours(0, 0, 0, 0);
    return showDate.getTime() === tonight.getTime();
  });
});

const showsTomorrow = computed(() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return allShows.value.filter((show) => {
    const showDate = new Date(show.parsedDate);
    showDate.setHours(0, 0, 0, 0);
    return showDate.getTime() === tomorrow.getTime();
  });
});

const showsThisWeek = computed(() => {
  const weekFromNow = new Date();
  weekFromNow.setDate(weekFromNow.getDate() + 7);
  return allShows.value.filter(
    (show) => show.parsedDate >= today.value && show.parsedDate <= weekFromNow
  );
});

// Group by date
const showsGroupedByDate = computed(() => {
  const grouped = new Map<string, Event[]>();
  allShows.value.forEach((show) => {
    const dateKey = show.parsedDate.toLocaleDateString();
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(show);
  });
  return grouped;
});
```

### 5. Update Frontend UI Structure

Update `app/pages/index.vue`:

```vue
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Chicago Live Music</h1>

    <!-- Tonight Section -->
    <section v-if="showsTonight.length" class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Tonight</h2>
      <ShowCard v-for="show in showsTonight" :key="show.id" :show="show" />
    </section>

    <!-- Tomorrow Section -->
    <section v-if="showsTomorrow.length" class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Tomorrow</h2>
      <ShowCard v-for="show in showsTomorrow" :key="show.id" :show="show" />
    </section>

    <!-- This Week Section -->
    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4">This Week</h2>
      <div v-for="[date, shows] in showsGroupedByDate" :key="date">
        <h3 class="text-xl font-semibold mt-4 mb-2">{{ formatDate(date) }}</h3>
        <ShowCard v-for="show in shows" :key="show.id" :show="show" />
      </div>
    </section>
  </div>
</template>
```

## Recommended Implementation Path

### Phase 1: MVP (Implement Now)

1. **Add caching to API routes**

   - Use `defineCachedEventHandler` with 6-hour cache
   - Immediate performance improvement

2. **Create aggregation composable**

   - Fetch all venues in parallel
   - Combine and sort by date

3. **Add date parsing and sorting**

   - Parse dates consistently across all scrapers
   - Sort chronologically

4. **Update frontend with date grouping**
   - Group shows by "Tonight", "Tomorrow", "This Week"
   - Display in chronological order

### Phase 2: Production (Future)

1. **Add database layer**

   - Recommend SQLite with Drizzle ORM for simplicity
   - Schema for events, venues, and scraping metadata

2. **Implement scheduled scraping**

   - Create Nuxt server task to scrape every 6-12 hours
   - Run in background, don't block user requests

3. **Optimize API routes**

   - Read from database instead of scraping
   - Instant response times

4. **Add advanced features**
   - Genre filtering
   - Venue filtering
   - Price range filtering
   - Search functionality
   - Favorites/bookmarking

### Phase 3: Enhanced Features

1. **User accounts & preferences**

   - Save favorite venues
   - Genre preferences
   - Email notifications for specific artists

2. **Social features**

   - Share shows
   - Who's going?
   - Comments/reviews

3. **Mobile app**
   - PWA or native app
   - Push notifications

## Technical Decisions

### Why SQLite over PostgreSQL?

- Simpler setup (no external database server)
- Perfect for read-heavy workloads
- Easy deployment
- Can migrate to PostgreSQL later if needed

### Why scheduled scraping vs. on-demand?

- Scraping is slow (Puppeteer overhead)
- Venues don't update frequently enough to warrant real-time scraping
- Better user experience with instant page loads
- Less load on venue websites

### Why Drizzle ORM?

- Type-safe
- Lightweight
- Great TypeScript integration
- Simple migrations
