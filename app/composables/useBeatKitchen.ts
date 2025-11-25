export const useBeatKitchen = () => {

    const fetchBeatKitchen = async () => {

        const shows = useState<Event[]>('beat-kitchen', () => []);
        const allShows = useState('all-shows', () => []);
        const { data,pending, error, refresh } = await useFetch('/api/beat-kitchen');
        shows.value = data;
        allShows.value = [...allShows.value ,data];
        return {data, pending, error, refresh };
    } 

     
    return { fetchBeatKitchen };
}  