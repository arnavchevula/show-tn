<script setup lang="ts">

import { useAggregatedShows } from '~/composables/useAggregatedShows';
import EventCard from '../components/EventCard.vue';

const { fetchAllVenues, allShows, venues, neighborhoods, regions } = useAggregatedShows();
const selectedRegions = ref([])
const selectedNeighborhoods = ref([])
const selectedVenues = ref([])
const isLoading = ref(false);
const value = ref(null);

onMounted(async ()=>{
  isLoading.value = true;
  await fetchAllVenues();
  isLoading.value = false;
})

const url = useRequestURL()

     
const filteredShows = computed(() => {
  const noFilters =
    selectedVenues.value.length === 0 &&
    selectedNeighborhoods.value.length === 0 &&
    selectedRegions.value.length === 0
  if (noFilters) return allShows.value
  return allShows.value.filter((show) => {
    const venueMatch = selectedVenues.value.length === 0 || selectedVenues.value.includes(show.venue)
    const neighborhoodMatch = selectedNeighborhoods.value.length === 0 || selectedNeighborhoods.value.includes(show.neighborhood)
    const regionMatch = selectedRegions.value.length === 0 || selectedRegions.value.includes(show.region)
    return venueMatch && neighborhoodMatch && regionMatch
  })
})
  useSeoMeta({
  title: 'Opener.fm | Chicago Shows This Week',
  description: 'Browse all live music events happening this week in Chicago. Shows at Beat Kitchen, Empty Bottle, Lincoln Hall, Thalia Hall, SmartBar, Salt Shed, and more.',
  ogTitle: 'Opener.fm | Chicago Shows This Week',
  ogDescription: 'Browse all live music events happening this week in Chicago. Shows at Beat Kitchen, Empty Bottle, Lincoln Hall, Thalia Hall, SmartBar, Salt Shed, and more.',
  ogType: 'website',
  ogUrl: url.href,
  ogSiteName: 'Opener.fm',
  twitterCard: 'summary',
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
    <UPageHeader
        title="Upcoming Events"
        description="Here are all the shows in Chicago this week!"
        class="mb-4"
      />
      <div class="flex flex-col mb-2 sm:flex-row sm:gap-2">
        <USelectMenu
        v-model="selectedVenues"
        :items="venues"
        multiple
        placeholder="Filter by venue"
        class="mb-2"
      />
      <USelectMenu
        v-model="selectedRegions"
        :items="regions"
        multiple
        placeholder="Filter by region"
        class="mb-2"

      />
      <USelectMenu
        v-model="selectedNeighborhoods"
        :items="neighborhoods"
        multiple
        placeholder="Filter by neighborhood"
        class="mb-2"

      />
    </div>
    <div v-if="isLoading" class="flex items-center justify-center mt-[25%] px-2 sm:px-0">
        <UProgress v-model="value"/>
    </div>
    <div v-else v-for="show in filteredShows" :key="show.id">
      <EventCard :show="show"/>   
    </div>
    <div v-if="filteredShows.length === 0 && !isLoading" >No shows match these filters. Please try again! </div>
    <div v-if="allShows.length === 0 && !isLoading">Something went wrong. Please try again later! </div>

  </div>
</template>