<script setup lang="ts">

const url = useRequestURL()

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

const allShowsForSchema = useState('all-shows', () => [])
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Chicago Shows This Week',
        itemListElement: allShowsForSchema.value.map((show: any, index: number) => ({
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

import { useAggregatedShows } from '~/composables/useAggregatedShows';
import EventCard from '../components/EventCard.vue';
const allShows = useState('all-shows', () => []);
const shows = ref();
const isLoading = ref(false);
const value = ref(null);

onMounted(async ()=>{
  const { fetchAllVenues } = useAggregatedShows();
  isLoading.value = true;
  const { data } = await fetchAllVenues();
  isLoading.value = false;
  shows.value = data?.value?.content;


})
</script>

<template>
  <div class="container mx-auto px-2 sm:px-0"> 
    <UPageHeader
        title="Upcoming Events"
        description="Here are all the shows in Chicago this week!"
        class="mb-4"
      />
    <div v-if="isLoading" class="flex items-center justify-center mt-[25%] px-2 sm:px-0">
        <UProgress v-model="value"/>
    </div>
    <div v-else v-for="show in allShows" :key="show.id">
      <EventCard :show="show"/>   
    </div>
  </div>
</template>