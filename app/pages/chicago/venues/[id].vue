<script setup lang="ts">
import {venues} from '~/data/venues';
const { allShows, fetchAllVenues } = useAggregatedShows()
const { public: { supabaseStorageBucket } } = useRuntimeConfig()

const baseUrlImages = `https://zylpuvjzvdyzfedpqqqh.supabase.co/storage/v1/object/public/${supabaseStorageBucket}/`
const route = useRoute()
const venueId = route.params.id
const venueInfo = ref();
const venueShows = ref([]);
const dateShowMap = ref(new Map());
const heroImg = ref<HTMLImageElement>()
venueInfo.value = venues.find((venue)=>venue.slug === venueId);
onMounted(async ()=> {
    if (heroImg.value && heroImg.value.complete && heroImg.value.naturalWidth === 0) {
        heroImg.value.src = `${baseUrlImages}${venueInfo.value.slug}.webp`
    }
    await fetchAllVenues();
    venueShows.value = allShows.value.filter((show)=>show.venue===venueInfo.value.name)
    initializeMap();
})
function initializeMap() {
    for (const show of venueShows.value) {
        const currentDate = show.parsedDate.toISOString().split('T')[0]; //gives "2026-05-21T00:00:00.000Z" -> 2026-05-21 for easy grouping / sorting
        if (!dateShowMap.value.get(currentDate)) { //if date doesnt exist, add it to map
            dateShowMap.value.set(currentDate, [show]);
        }
        else { //if date does exist, append this show to the current list of shows on this date
            const current = dateShowMap.value.get(currentDate);
            dateShowMap.value.set(currentDate , [...current, show])
        }
    }
}

function getDate(eventDate: string){
    // return new Date(`${eventDate}T00:00:00`).toLocaleDateString("en-US",{ weekday: "long", month: "long", day: "numeric"}).replace(",", "")
    const [ dayOfTheWeek, month, day] = new Date(`${eventDate}T00:00:00`).toLocaleDateString("en-US",{ weekday: "long", month: "long", day: "numeric"}).replace(",", "").split(" ");
    return { dayOfTheWeek, month, day };
}
</script>

<template>
<div>
    <div class="relative h-64 w-full overflow-hidden">
        <img ref="heroImg" :src="`${baseUrlImages}${venueInfo.slug}-hero.webp`" @error="(e) => ((e.target as HTMLImageElement).src = `${baseUrlImages}${venueInfo.slug}.webp`)" :alt="venueInfo.name" class="w-full h-full object-cover rounded-md" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div class="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
    </div>
</div>
<div class="container mx-auto px-4 lg:px-0">
    <div class="mt-4">
        <NuxtLink to="/chicago/venues" class=" inline-flex items-center gap-1 text-sm font-semibold tracking-wide text-rose-200 hover:text-rose-100 transition-colors">
      <UIcon name="i-lucide-arrow-left" class="size-4" />
      View All Venues
    </NuxtLink>
        <p class="text-muted text-sm uppercase tracking-wide">{{ venueInfo.region }}</p>
        <a :href="venueInfo.website" target="_blank" class="hover:underline">
            <h1 class="text-5xl font-bold">{{ venueInfo.name }}</h1>
        </a>
        <p class="text-slate-400 text-sm mt-1">{{ venueInfo.neighborhood }} · {{ venueInfo.address }}</p>
        <div v-if="venueInfo.genres?.length" class="flex flex-wrap gap-2 mt-3">
            <span v-for="genre in venueInfo.genres" :key="genre" class="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300 uppercase tracking-wide">{{ genre }}</span>
        </div>
    </div>
    <div class="flex flex-col">
        <div v-if="dateShowMap.size === 0" class="mt-8 text-center text-slate-400">
            <p class="text-lg">No upcoming shows at {{ venueInfo.name }}.</p>
            <p class="text-sm mt-1">Check back soon or visit <a :href="venueInfo.website" target="_blank" class="underline hover:text-white">their website</a> directly.</p>
        </div>
        <div v-for="[date, shows] in dateShowMap" :key="date" class="grid grid-cols-[120px_1fr] gap-4 mt-4 border-b border-slate-800 pb-4">
            <div class="flex flex-col items-end">
                <p class="text-muted text-sm uppercase tracking-wide">
                    {{ getDate(date).dayOfTheWeek }}
                </p>
                <p class="text-xl font-bold text-rose-300">
                    {{ getDate(date).day }}
                </p>
                <p class="font-semibold">
                    {{ getDate(date).month }}
                </p>
            </div>
            <div class="flex flex-col gap-y-3">
                <NuxtLink v-for="show in shows" :key="show.id" :to="`/chicago/${show.id}`" class="flex items-baseline justify-between group">
                    <div>
                        <p class="font-semibold group-hover:underline">{{ show.title }}</p>
                        <p v-if="show.support" class="text-sm text-muted">{{ show.support }}</p>
                    </div>
                    <div class="flex items-center gap-x-4 text-sm text-muted shrink-0 ml-4">
                        <span v-if="show.showTime">{{ show.showTime }}</span>
                        <a v-if="show.url" :href="show.url" target="_blank" @click.stop class="hover:text-white">Tickets</a>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </div>
</div>
</template>