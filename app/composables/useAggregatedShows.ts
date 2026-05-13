import type { Event } from '../../types/event.d.ts';
import { createClient } from '@supabase/supabase-js'

export const useAggregatedShows = () => {
    const { public: { supabaseUrl, supabaseApiKeyBrowser, userPreferencesDb, userFavoritesDb } } = useRuntimeConfig();
    const supabase = createClient(supabaseUrl as string, supabaseApiKeyBrowser as string)
    const allShows = useState<Event[]>("all-shows",()=>[]);
    const fetchAllVenues = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 42);

      const { data: eventsFromDb } = await supabase
        .from('events')
        .select()
        .gte('parsedDate', today.toISOString().split('T')[0])
        .lte('parsedDate', weekFromNow.toISOString().split('T')[0]);

      const withParsedDates = eventsFromDb
        ?.filter((show) => show.parsedDate)
        .map((show) => {
          const [year, month, day] = show.parsedDate.split('-').map(Number);
          return { ...show, parsedDate: new Date(year, month - 1, day) };
        });

      allShows.value = withParsedDates?.toSorted(
        (a, b) => a.parsedDate.getTime() - b.parsedDate.getTime()
      ) ?? [];


      return allShows;
    };
    // [...new Set(...)] deduplicates filter options — many shows share the same venue/neighborhood/region,
    // so a plain .map() would produce duplicates. Set keeps only unique values; spread converts it back
    // to an array for .sort(). genreTags uses flatMap instead of map because each show's genreTags is
    // a string[], so map would give an array of arrays rather than a flat list of unique tag strings.
    const venues = computed(() =>
      [...new Set(allShows.value.map(s => s.venue).filter(Boolean))].sort()
    )
    const neighborhoods = computed(() =>
      [...new Set(allShows.value.map(s => s.neighborhood).filter(Boolean))].sort()
    )
    const regions = computed(() =>
      [...new Set(allShows.value.map(s => s.region).filter(Boolean))].sort()
    )
    const genre = computed(() =>
      [...new Set(allShows.value.map(s => s.genres).filter(Boolean))].sort()
    )
    const genreTags = computed(() =>
      [...new Set(allShows.value.flatMap(s => s.genreTags ?? []))].sort()
    )
    return {fetchAllVenues, allShows, venues, neighborhoods, regions, genre, genreTags}
}