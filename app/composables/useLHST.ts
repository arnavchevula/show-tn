export const useLHST = () => {

    const fetchLHST = async () => {

        const shows = useState<Event[]>('lh-st', () => []);
        const allShows = useState('all-shows', () => []);
        const { data,pending, error, refresh } = await useFetch('/api/lh-st');
        shows.value = data;
        allShows.value = [...allShows.value ,data];
        return {data, pending, error, refresh };
    }

    
    return { fetchLHST };
}