<script setup lang="ts">
import { useAggregatedShows } from '~/composables/useAggregatedShows';
const { allShows, fetchAllVenues } = useAggregatedShows();
const { favorites, load } = useFavorites();
const renderFavorites = computed(() =>
    allShows.value.filter((show) => favorites.value.includes(show.id))
)
onMounted(async () => {
    await fetchAllVenues();
    load();
})
</script>

<template>
    <div class="container mx-auto px-2 sm:px-0">
        <div v-if="renderFavorites.length > 0">
            <h1 class="text-5xl text-rose-200 leading-tight">Favorites</h1>
            <div v-for="show in renderFavorites" :key="show.id">
                <EventCard :show="show"/>
            </div>
        </div>
        <div v-else>
            <p>No Favorites here</p>
        </div>
    </div>
</template>
