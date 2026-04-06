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

const showsTonight = computed(() => {
  const tonight = new Date();
  tonight.setHours(0, 0, 0, 0);
  return allShows.value.filter((show) => {
    const showDate = new Date(show.parsedDate);
    showDate.setHours(0, 0, 0, 0);
    return showDate.getTime() === tonight.getTime();
  });
});

const showsTomorrow = computed(() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return allShows.value.filter((show) => {
    const showDate = new Date(show.parsedDate);
    showDate.setHours(0, 0, 0, 0);
    return showDate.getTime() === tomorrow.getTime();
  });
});

const showsThisWeek = computed(() => {
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  dayAfterTomorrow.setHours(0, 0, 0, 0);

  const weekFromNow = new Date();
  weekFromNow.setDate(weekFromNow.getDate() + 7);
  weekFromNow.setHours(23, 59, 59, 999);

  return allShows.value.filter((show) => {
    const showDate = new Date(show.parsedDate);
    showDate.setHours(0, 0, 0, 0);
    return showDate.getTime() >= dayAfterTomorrow.getTime() && showDate.getTime() <= weekFromNow.getTime();
  });
});

console.log("tonight: ", showsTonight);
console.log("tomorrow: ", showsTomorrow);
console.log("rest of week: ", showsThisWeek);

</script>

<template>
  <div class="container mx-auto px-2 sm:px-0"> 
    <!-- <UPageHeader
        title="Upcoming Events"
        description="Here are all the shows in Chicago this week!"
        class="mb-4"
      /> -->
    <div v-if="isLoading" class="flex items-center justify-center mt-[25%] px-2 sm:px-0">
        <UProgress v-model="value"/>
    </div>
    <!-- <div v-else v-for="show in allShows" :key="show.id">
      <EventCard :show="show"/>   
    </div> -->

    <div v-else>
      <UPageHeader
        title="Chicago Shows Tonight"
        description="Here are your last minute plans!"
        class="mb-4"
      />
      <div v-for="show in showsTonight" :key="show.id">
        <EventCard :show="show"/>   
      </div>
      <UPageHeader
        title="Chicago Shows Tomorrow Night"
        description="Here are your moves for tomorrow!"
        class="mb-4"
      />
      <div v-for="show in showsTomorrow" :key="show.id">
        <EventCard :show="show"/>   
      </div>
      <UPageHeader
        title="Chicago Shows For the Rest of the Week"
        description="Planning ahead?"
        class="mb-4"
      />
      <div v-for="show in showsThisWeek" :key="show.id"> 
        <EventCard :show="show"/>   
      </div>
    </div>
  </div>
</template>