export const useJamProductions = () => {

    const fetchJamProductions = async () => {

        const shows = useState<Event[]>('jam-productions', () => []);
        const allShows = useState('all-shows', () => []);
        const { data,pending, error, refresh } = await useFetch('/api/jam-productions');
        shows.value = data;
        return {data, pending, error, refresh };
    }

    
    return { fetchJamProductions }; 
}