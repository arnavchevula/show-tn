import type { Event } from '../../types/event.d.ts';
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://zylpuvjzvdyzfedpqqqh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5bHB1dmp6dmR5emZlZHBxcXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4ODc3OTgsImV4cCI6MjA3ODQ2Mzc5OH0.C0vSNceaiUKdASequxfd4olYkXrIWx0FOTnURjUUDIM'

const supabase = createClient(supabaseUrl, supabaseKey)

export const useAggregatedShows = () => {
    const allShows = useState<Event[]>("all-shows",()=>[]);
    const fetchAllVenues = async () => { 
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      console.log(today);
      console.log(weekFromNow);
          const { data:eventsFromDb, error } = await supabase.from('events').select();
          const { data:eventsFromDbQuery, error:errorQuery } = await supabase.from('events').select().gte('parsedDate', today)
          .lte('parsedDate', weekFromNow);

          console.log("unsorted: ",eventsFromDb);
          console.log("queried: ", eventsFromDbQuery);
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