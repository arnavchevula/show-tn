<script setup lang="ts">
import {venues} from '~/data/venues';
const { public: { supabaseStorageBucket } } = useRuntimeConfig()

const neighborhoodCount = computed(() => new Set(venues.map(v => v.neighborhood)).size);
const regions = computed(() => ['All', ...new Set(venues.map(v => v.region))]);
const selectedRegion = ref('All');
const filteredVenues = computed(() =>
  selectedRegion.value === 'All' ? venues : venues.filter(v => v.region === selectedRegion.value)
);
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
    <div class="lg:grid lg:grid-cols-3 xl:grid xl:grid-cols-4 md:grid md:grid-cols-2 gap-6 flex flex-col">
        <div v-for="(venue, index) in filteredVenues" @click="navigateTo(`/chicago/venues/${venue.slug}`)"
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