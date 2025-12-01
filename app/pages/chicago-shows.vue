<script setup lang="ts">
import { useJamProductions } from '~/composables/useJamProductions';
import { useEmptyBottle } from '~/composables/useEmptyBottle';
import { useSubt } from "~/composables/useSubt"
import { useLHST } from '~/composables/useLHST';
import { useBeatKitchen } from '~/composables/useBeatKitchen';
import { useAggregatedShows } from '~/composables/useAggregatedShows';
import ShowCard from '../components/ShowCard.vue';
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

const today = computed(() => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
});

const tomorrow = computed(() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
});

const showsTonight = computed(() => {
  const tonight = new Date();
  tonight.setHours(0, 0, 0, 0);
  return allShows.value.filter((show) => {
    const showDate = new Date(show.parsedDate);
    showDate.setHours(0, 0, 0, 0);
    return showDate.getTime() === tonight.getTime();
  });
});
console.log("tn: ",showsTonight.value);  

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

console.log("tmrw: ",showsTomorrow.value);  

const showsThisWeek = computed(() => {
  const weekFromNow = new Date();
  weekFromNow.setDate(weekFromNow.getDate() + 7);
  return allShows.value.filter(
    (show) => show.parsedDate >= tomorrow.value && show.parsedDate <= weekFromNow
  );
});

console.log("rest of week: ",showsThisWeek.value);  


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
    <UBlogPosts v-else>
    <div v-if="showsTonight.length > 0">
      <h2 class="text-2xl font-bold mb-4">Tonight</h2>
      <div v-for="show in showsTonight" :key="show.title">
        <ShowCard :show="show"/>
        <br />
      </div>
    </div>
    <div v-if="showsTomorrow.length > 0">
      <h2 class="text-2xl font-bold mb-4 mt-6">Tomorrow</h2>
      <div v-for="show in showsTomorrow" :key="show.title">
        <ShowCard :show="show"/>
        <br />
      </div>
    </div>
    <div v-if="showsThisWeek.length > 0">
      <h2 class="text-2xl font-bold mb-4 mt-6">Rest of the Week</h2>
      <div v-for="show in showsThisWeek" :key="show.title">
        <ShowCard :show="show"/>
        <br />
      </div>
    </div>
    </UBlogPosts>
  </div>
</template>