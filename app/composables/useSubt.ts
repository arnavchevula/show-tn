export const useSubt = () => {

  const fetchSubt = async () => {

      const shows = useState<Event[]>('lh-st', () => []);
      const allShows = useState('all-shows', () => []);
      const { data,pending, error, refresh } = await useFetch('/api/subt');
      shows.value = data;
      allShows.value = [...allShows.value ,data];
      return {data, pending, error, refresh };
  }
 
  
  return { fetchSubt };
}