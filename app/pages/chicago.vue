<script setup lang="ts">
/* 
VENUE LIST
  Subt (done)
  Beat Kitchen (done)
  Lincoln Hall / Schubas (done)
  Park West, The Vic, The Riviera (Done)
  Sleeping Village
  Concord Music Hall 
  Thalia Hall
  Empty Bottle (Done)
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
    <div v-if="isLoading" class="flex items-center justify-center mt-[25%]">
        <UProgress v-model="value"/>
    </div>
    <div v-else v-for="show in allShows" :key="show.title">
      <EventCard :show="show"/>   
      <br />
    </div>
  </div>
</template>