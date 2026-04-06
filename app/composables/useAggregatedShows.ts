import type { Event } from '../../types/event.d.ts';
import { createClient } from '@supabase/supabase-js'

export const useAggregatedShows = () => {
    const { public: { supabaseUrl, supabaseApiKeyBrowser } } = useRuntimeConfig();
    const supabase = createClient(supabaseUrl as string, supabaseApiKeyBrowser as string)
    const allShows = useState<Event[]>("all-shows",()=>[]);
    const fetchAllVenues = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);

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
    const venues = computed(() =>
      [...new Set(allShows.value.map(s => s.venue).filter(Boolean))].sort()
    )                                                                                                         
    const neighborhoods = computed(() =>
      [...new Set(allShows.value.map(s => s.neighborhood).filter(Boolean))].sort()                            
    )               
    const regions = computed(() =>
      [...new Set(allShows.value.map(s => s.region).filter(Boolean))].sort()
    )             
    return {fetchAllVenues, allShows, venues, neighborhoods, regions}
}