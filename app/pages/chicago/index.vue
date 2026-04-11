<script setup lang="ts">

import { useAggregatedShows } from '~/composables/useAggregatedShows';
import EventCard from '../../components/EventCard.vue';
import Fuse from 'fuse.js'

const { fetchAllVenues, allShows, venues, neighborhoods, regions, genre, genreTags } = useAggregatedShows();
const selectedRegions = ref([])
const selectedNeighborhoods = ref([])
const selectedVenues = ref([])
const selectedGenres = ref([])
const isLoading = ref(false);
const value = ref(null);
const currentDate = ref (new Date())
currentDate.value.setHours(0,0,0,0)
const searchString = ref();

onMounted(async ()=>{
  isLoading.value = true;
  await fetchAllVenues();
  isLoading.value = false;
})


const url = useRequestURL()

async function incrementCurrentDate() {
  const weekFromNow = new Date();
  weekFromNow.setDate(weekFromNow.getDate() + 7);
  weekFromNow.setHours(0, 0, 0, 0);
  if (currentDate.value < weekFromNow) {
    const next = new Date(currentDate.value);
    next.setDate(next.getDate() + 1);
    currentDate.value = next;
  }
}

async function decrementCurrentDate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (currentDate.value > today) {
    const prev = new Date(currentDate.value);
    prev.setDate(prev.getDate() - 1);
    currentDate.value = prev;
  }

}
const filteredShows = computed(() => {
  const noFilters =
    selectedVenues.value.length === 0 &&
    selectedNeighborhoods.value.length === 0 &&
    selectedRegions.value.length === 0 && 
    selectedGenres.value.length === 0
  if (noFilters) return allShows.value
  return allShows.value.filter((show) => {
    const venueMatch = selectedVenues.value.length === 0 || selectedVenues.value.includes(show.venue)
    const neighborhoodMatch = selectedNeighborhoods.value.length === 0 || selectedNeighborhoods.value.includes(show.neighborhood)
    const regionMatch = selectedRegions.value.length === 0 || selectedRegions.value.includes(show.region)
    const genreMatch = selectedGenres.value.length === 0 || selectedGenres.value.some(g => (show.genreTags ?? []).includes(g))
    return venueMatch && neighborhoodMatch && regionMatch && genreMatch
  })
})

const filteredShowsWithDays = computed(()=> {
  return filteredShows.value.filter((show)=> {
    return show.parsedDate.getTime() === currentDate.value.getTime()
  })
})

const fuse = computed(() => new Fuse(filteredShowsWithDays.value, {
  keys: ['title', 'headliners', 'support'],
  threshold: 0.3
}))

const filteredShowsWithDaysAndSearch = computed(() => {
  if (!searchString.value) return filteredShowsWithDays.value
  return fuse.value.search(searchString.value).map(r => r.item)
})

  useSeoMeta({
  title: 'Opener.fm | Chicago Shows This Week',
  description: 'Browse all live music events happening this week in Chicago. Shows at Beat Kitchen, Empty Bottle, Lincoln Hall, Thalia Hall, SmartBar, Salt Shed, and more.',
  ogTitle: 'Opener.fm | Chicago Shows This Week',
  ogDescription: 'Browse all live music events happening this week in Chicago. Shows at Beat Kitchen, Empty Bottle, Lincoln Hall, Thalia Hall, SmartBar, Salt Shed, and more.',
  ogType: 'website',
  ogUrl: url.href,
  ogSiteName: 'Opener.fm',
  ogImage: 'https://opener.fm/og-image.png',
  twitterCard: 'summary_large_image',
  twitterImage: 'https://opener.fm/og-image.png',
  twitterTitle: 'Opener.fm | Chicago Shows This Week',
  twitterDescription: 'Browse all live music events happening this week in Chicago. Shows at Beat Kitchen, Empty Bottle, Lincoln Hall, Thalia Hall, SmartBar, Salt Shed, and more.',
  keywords: 'chicago live music this week, chicago shows, chicago concerts, events in chicago, what to do in chicago tonight, chicago nightlife, Beat Kitchen shows, Thalia Hall shows, The Hideout Chicago, Sleeping Village Chicago, Coles Bar Chicago, Dorians Chicago, Aragon Ballroom shows, Chop Shop Chicago, Bottom Lounge Chicago, The Whistler Chicago, California Clipper Chicago, SmartBar Chicago, Gman Tavern Chicago, Podlasie Club Chicago, Lemon Chicago, Book Club Chicago, The Salt Shed Chicago, Clara Chicago, Smoke and Mirrors Chicago, Avondale Music Hall Chicago, Cobra Lounge Chicago, Lincoln Hall Chicago, Schubas Tavern Chicago, SubT Chicago, Empty Bottle Chicago, Park West Chicago, The Vic Chicago, The Riviera Chicago',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Chicago Shows This Week',
        itemListElement: allShows.value.map((show: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Event',
            name: show.title,
            startDate: show.parsedDate instanceof Date
              ? show.parsedDate.toISOString().split('T')[0]
              : show.parsedDate,
            location: {
              '@type': 'Place',
              name: show.displayName ?? show.venue,
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Chicago',
                addressRegion: 'IL',
                addressCountry: 'US'
              }
            }
          }
        }))
      }))
    }
  ]
})

</script>

<template>
  <div class="container mx-auto px-2 sm:px-0"> 
    <div class="flex items-center justify-between">
      <UButton icon="i-lucide-chevron-left" size="xl" color="neutral" variant="ghost" class="text-rose-200" @click="decrementCurrentDate"></UButton>
      <UPageHeader
        :title="currentDate.toDateString()"
        description="Here are all the shows in Chicago this week!"
        class="mb-4 items-center justify-center text-center"
        :ui="{title:'font-normal text-center', wrapper: 'lg:justify-center'}"
      />
      <UButton icon="i-lucide-chevron-right" size="xl" color="neutral" variant="ghost" class="text-rose-200" @click="incrementCurrentDate"></UButton>
    </div>
      <div class="flex flex-col items-baseline mb-2 sm:flex-row sm:gap-2">
        <UInput v-model="searchString" icon="i-lucide-search" size="md" variant="outline" placeholder="Search..." :ui="{root:'w-full sm:flex-1'}" class="mb-2 sm:mb-0"/>
        <USelectMenu
        v-model="selectedVenues"
        :items="venues"
        multiple
        placeholder="All venues"
        class="mb-2 w-full sm:w-auto"
      />
      <USelectMenu
        v-model="selectedRegions"
        :items="regions"
        multiple
        placeholder="All regions"
        class="mb-2 w-full sm:w-auto"

      />
      <USelectMenu
        v-model="selectedNeighborhoods"
        :items="neighborhoods"
        multiple
        placeholder="All neighborhoods"
        class="mb-2 w-full sm:w-auto"

      />
      <USelectMenu
        v-model="selectedGenres"
        :items="genreTags"
        multiple
        placeholder="All genres"
        class="mb-2 w-full sm:w-auto"

      />
    </div>
    <div v-if="isLoading" class="flex items-center justify-center mt-[25%] px-2 sm:px-0">
        <UProgress v-model="value"/>
    </div>
    <div v-else v-for="show in filteredShowsWithDaysAndSearch" :key="show.id">
      <NuxtLink :to="`/chicago/${show.id}`">
        <EventCard :show="show" />
      </NuxtLink>
    </div>
    <div v-if="filteredShowsWithDaysAndSearch.length === 0 && !isLoading" >No shows match these filters. Please try again! </div>
    <div v-if="allShows.length === 0 && !isLoading">Something went wrong. Please try again later! </div>

  </div>
</template>