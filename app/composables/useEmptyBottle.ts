export const useEmptyBottle = () => {

    const fetchEmptyBottle = async () => {

        const shows = useState<Event[]>('empty-bottle', () => []);
        const allShows = useState('all-shows', () => []);
        const { data,pending, error, refresh } = await useFetch('/api/empty-bottle');
        shows.value = data;
        allShows.value = [...allShows.value ,data];
        return {data, pending, error, refresh };
    }

    
    return { fetchEmptyBottle };
}