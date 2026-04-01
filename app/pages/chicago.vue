<script setup lang="ts">
/* 
VENUE LIST
  Subt (done)
  Beat Kitchen (done)
  Lincoln Hall / Schubas (done)
  Park West, The Vic, The Riviera (Done)
  Sleeping Village
  Concord Music Hall 
  Thalia Hall (Done, need to scrape tonights show indiviually)
  Empty Bottle (Done, need to scrape tonights show indiviually)
  The Hideout
  Fallen Log 
  Chop Shop
  Aragorn Ballroom
  Bottom Lounge
  Dorians
  The Whistler
  Gman Tavern
  Cafe Mustache
  Color Club
  The Salt Shed
  Cobra Lounge
  Book Club
  House of Blues
  Hard Rock Cafe
  Chicago Theatre
  Coles
  The Burlington
  Avondale Music Hall
  Smoke & Mirrors
  California Clipper
  Constellation
  Martyrs
  Clara
  Easy Does It 
  Lemon
  Tortoise Supper Club
  Gallery Cabaret
  SmartBar
  Podlasie 
  aliveOne
  Hungry Brain
  Montrose Saloon
  The Green Mill
  Andys Jazz Club
  Rosas Lounge
  Kingston Mines
  Buddy Guy Legends
  Jazz Showcase
*/
const url = useRequestURL()

useSeoMeta({
  title: 'Chicago Shows This Week — Show TN',
  description: 'Browse all live music events happening this week in Chicago. Shows at Beat Kitchen, Empty Bottle, Lincoln Hall, Thalia Hall, SmartBar, Salt Shed, and more.',
  ogTitle: 'Chicago Shows This Week — Show TN',
  ogDescription: 'Browse all live music events happening this week in Chicago. Shows at Beat Kitchen, Empty Bottle, Lincoln Hall, Thalia Hall, SmartBar, Salt Shed, and more.',
  ogType: 'website',
  ogUrl: url.href,
  ogSiteName: 'Show TN',
  twitterCard: 'summary',
  twitterTitle: 'Chicago Shows This Week — Show TN',
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

import { useJamProductions } from '~/composables/useJamProductions';
import { useEmptyBottle } from '~/composables/useEmptyBottle';
import { useSubt } from "~/composables/useSubt"
import { useLHST } from '~/composables/useLHST';
import { useBeatKitchen } from '~/composables/useBeatKitchen';
import { useAggregatedShows } from '~/composables/useAggregatedShows';
import EventCard from '../components/EventCard.vue';
const test = useState('jam-productions', () => []);
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
  <div class="container mx-auto"> 
    <UPageHeader
        title="Upcoming Events"
        description="Here are all the shows in Chicago this week!"
        class="mb-4"
      />
    <div v-if="isLoading" class="flex items-center justify-center mt-[25%]">
        <UProgress v-model="value"/>
    </div>
    <div v-else v-for="show in allShows" :key="show.id">
      <EventCard :show="show"/>   
    </div>
  </div>
</template>