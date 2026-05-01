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
    <div class="container mx-auto py-6 px-2 sm:px-0">
        <NuxtLink to="/chicago" class="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-neutral-200 transition-colors mb-2">
            <UIcon name="i-lucide-arrow-left" class="size-3.5" />
            Back to shows
        </NuxtLink>
        <div class="mb-6">
            <h1 class="text-4xl text-rose-200 font-light">Your Favorites</h1>
            <p class="text-sm text-neutral-500 mt-1">{{ renderFavorites.length }} saved show{{ renderFavorites.length !== 1 ? 's' : '' }}</p>
        </div>
        <div v-if="renderFavorites.length > 0">
            <div v-for="show in renderFavorites" :key="show.id" class="cursor-pointer" @click="navigateTo(`/chicago/${show.id}`)">
                <EventCard :show="show" />
            </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-20 text-center">
            <UIcon name="i-lucide-heart" class="size-12 text-neutral-700 mb-4" />
            <p class="text-lg text-neutral-300 font-light mb-1">No saved shows yet</p>
            <p class="text-sm text-neutral-500 mb-6">Tap the heart on any show to save it here</p>
            <NuxtLink to="/chicago">
                <UButton color="neutral" variant="outline" label="Browse Shows" icon="i-lucide-music" />
            </NuxtLink>
        </div>
    </div>
</template>
