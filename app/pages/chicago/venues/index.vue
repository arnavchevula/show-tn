<script setup lang="ts">
import {venues, type Venue} from '~/data/venues';
const { public: { supabaseStorageBucket } } = useRuntimeConfig()

const neighborhoodCount = computed(() => new Set(venues.map(v => v.neighborhood)).size);
const regions = computed(() => ['All', ...new Set(venues.map(v => v.region))]);
const selectedRegion = ref('All');
const filteredVenues = computed(() =>
  selectedRegion.value === 'All' ? venues : venues.filter(v => v.region === selectedRegion.value)
);
const groupedVenuesByLetter = computed(()=>{
    return filteredVenues.value.reduce((prev: object,next: Venue)=>{
        const firstLetter = next.name[0];
        if (prev[firstLetter]) {
            prev[firstLetter].push(next);
        }
        else {
            prev[firstLetter] = [next];
        }
        return prev
    },{})
})
function scrollToLetter(letter: string) {
    document.getElementById(letter)?.scrollIntoView({ behavior: 'smooth' });
}
const baseUrlImages = `https://zylpuvjzvdyzfedpqqqh.supabase.co/storage/v1/object/public/${supabaseStorageBucket}/`
</script>

<template>
<div class="container mx-auto mt-2 px-4 lg:px-0">
    <div class="border-b border-slate-800 pb-6 mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end">
        <div>
            <p class="text-muted text-sm uppercase tracking-wide">Chicago</p>
            <h1 class="text-5xl font-bold">Venues</h1>
            <p class="text-slate-400 text-sm mt-1">Explore live music across Chicago.</p>
        </div>
        <div class="flex items-end gap-6 text-left sm:text-right">
            <div>
                <p class="text-2xl font-semibold text-slate-200">{{ venues.length }}</p>
                <p class="text-xs text-slate-500 uppercase tracking-wide">venues</p>
            </div>
            <div class="w-px h-8 bg-slate-800"></div>
            <div>
                <p class="text-2xl font-semibold text-slate-200">{{ neighborhoodCount }}</p>
                <p class="text-xs text-slate-500 uppercase tracking-wide">neighborhoods</p>
            </div>
        </div>
    </div>
    <div class="flex gap-2 flex-wrap mb-6">
        <button
            v-for="region in regions"
            :key="region"
            @click="selectedRegion = region"
            :class="selectedRegion === region
                ? 'bg-rose-200 text-slate-900 border-rose-200'
                : 'text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200'"
            class="px-4 py-1.5 rounded-full border text-sm uppercase tracking-wide transition duration-200">
            {{ region }}
        </button>
    </div>
    <!-- mobile: fixed overlay scrollbar -->
    <div class="fixed right-2 z-50 top-1/2 -translate-y-1/2 md:hidden">
        <ul class="rounded-xl bg-slate-600 flex flex-col items-center justify-center px-1 py-1 opacity-60 cursor-pointer">
            <li v-for="letter in Object.keys(groupedVenuesByLetter)" :key="letter" @click="scrollToLetter(letter)" class="text-xs leading-tight px-1">
                {{ letter }}
            </li>
        </ul>
    </div>

    <!-- desktop: layout column scrollbar -->
    <div class="flex gap-6">
    <div class="flex flex-col flex-1">
        <div v-for="(venueList, letter) in groupedVenuesByLetter" :key="letter" class="flex flex-col md:flex-row gap-6 mb-6">
            <h2 class="text-4xl font-bold text-slate-700 w-8 shrink-0 pt-1">{{ letter }}</h2>
            <div :id="letter" class="lg:grid lg:grid-cols-3 xl:grid-cols-4 md:grid-cols-2 grid grid-cols-1 gap-6 flex-1">
                <div v-for="(venue, index) in venueList" @click="navigateTo(`/chicago/venues/${venue.slug}`)"
             class="card-enter"
             :style="{ animationDelay: `${(index % 6) * 75}ms` }">
            <div class="flex flex-col gap-2 rounded-xl  hover:shadow-xl hover:shadow-slate-800 transition duration-300 h-full">
                <div class="overflow-hidden rounded-xl group">
                    <img :src="`${baseUrlImages}${venue.slug}.webp`" class="aspect-[4/3] object-cover h-full w-full transition duration-300 group-hover:scale-105 group-hover:brightness-75"/>
                </div>
                <div class="p-2">
                    <p class="text-muted text-sm uppercase tracking-wide font-medium">{{ venue.neighborhood }}</p>
                    <h2 class="text-2xl font-semibold text-rose-200">{{ venue.name }}</h2>
                    <p class="text-slate-300 text-sm">{{ venue.address }}</p>
                    <div class="flex gap-2 flex-wrap mt-2">
                        <div v-for="genre in venue.genres">
                            <div class="uppercase text-xs text-slate-500 border border-slate-800 rounded-xl px-2">
                                {{ genre }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            </div>
        </div>
        

    </div>

    <!-- desktop: sticky sidebar scrollbar -->
    <div class="hidden md:flex flex-col items-center sticky top-1/2 self-start -translate-y-1/2 h-fit">
        <ul class="rounded-xl bg-slate-800 flex flex-col items-center px-2 py-2 gap-0.5 cursor-pointer">
            <li v-for="letter in Object.keys(groupedVenuesByLetter)" :key="letter" @click="scrollToLetter(letter)" class="text-xs text-slate-400 hover:text-white transition-colors leading-tight w-full text-center">
                {{ letter }}
            </li>
        </ul>
    </div>
    </div>
</div>
</template>

<style scoped>
@keyframes fadeUp {
  0%   { opacity: 0;    transform: translateY(2.5rem) scale(0.97); }
  40%  { opacity: 0.15; transform: translateY(1rem) scale(0.98); }
  100% { opacity: 1;    transform: translateY(0) scale(1); }
}

.card-enter {
  animation: fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>