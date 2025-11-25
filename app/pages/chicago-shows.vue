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
</script>

<template>
  <div class="container mx-auto"> 
    <div v-if="isLoading" class="flex items-center justify-center mt-[25%]">
        <UProgress v-model="value"/>
    </div>
    <UBlogPosts v-else>
    <div v-for="show in allShows" :key="show.title">
      <ShowCard :show="show"/>   
      <br />
    </div>
    </UBlogPosts>
  </div>
</template>