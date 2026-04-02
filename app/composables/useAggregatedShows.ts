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
          const { data:eventsFromDb, error } = await supabase.from('events').select();
          const { data:eventsFromDbQuery, error:errorQuery } = await supabase.from('events').select().gte('parsedDate', today.toISOString().split('T')[0])
          .lte('parsedDate', weekFromNow.toISOString().split('T')[0]);

          const withParsedDates = eventsFromDb
            ?.filter((show) => show.parsedDate)
            .map((show) => {
              const [year, month, day] = show.parsedDate.split('-').map(Number);
              const parsedDate = new Date(year, month - 1, day);
              return {
                ...show,
                parsedDate
              };
            });



        allShows.value = withParsedDates?.toSorted(
            (a, b) => a.parsedDate.getTime() - b.parsedDate.getTime()
          ).filter((show) => show.parsedDate >= today && show.parsedDate <= weekFromNow);
         
          return allShows;

    };
    return {fetchAllVenues, allShows}
}