<script setup lang="ts">
import { divIcon } from 'leaflet'
import { venueSlug } from "~/utils/calendar"
import { venueBySlug, venueByAlias } from '~/data/venues'
import { useAggregatedShows } from '~/composables/useAggregatedShows'

const { allShows, fetchAllVenues } = useAggregatedShows()

const today = new Date()
today.setHours(0, 0, 0, 0)

const filterShowsForToday = computed(() =>
  allShows.value.filter((show) => show.parsedDate.getTime() === today.getTime())
)

const getLocationPins = computed(() =>
  filterShowsForToday.value
    .map((show) => {
      const venue = venueBySlug[venueSlug(show.venue)] || venueByAlias[venueSlug(show.venue)]
      return { ...show, ...venue }
    })
    .filter((pin) => pin.lat != null)
)

const venueGroups = computed(() => {
  const groups: Record<string, { lat: number; lng: number; slug: string; name: string; address: string; shows: any[] }> = {}
  for (const pin of getLocationPins.value) {
    if (!groups[pin.slug]) {
      groups[pin.slug] = { lat: pin.lat, lng: pin.lng, slug: pin.slug, name: pin.name, address: pin.address, shows: [] }
    }
    groups[pin.slug].shows.push(pin)
  }
  return Object.values(groups)
})

const drawerOpen = ref(false)
const selectedVenue = ref<{ name: string; slug: string; address: string; shows: any[] } | null>(null)

const zoom = ref(11)

const markerIcon = divIcon({
  className: '',
  html: `<div style="width:12px;height:12px;border-radius:50%;background:#f97316;border:2px solid rgba(255,255,255,0.8);box-shadow:0 0 8px rgba(249,115,22,0.7)"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
})

onMounted(fetchAllVenues)
</script>

<template>
  <div class="mt-2 px-4 lg:px-0">
    <div class="border-b border-slate-800 pb-6 mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end">
      <div>
        <p class="text-muted text-sm uppercase tracking-wide">Chicago</p>
        <h1 class="text-5xl font-bold">Tonight's Shows</h1>
        <p class="text-slate-400 text-sm mt-1">Live music happening across the city tonight.</p>
      </div>
      <div class="flex items-end gap-6 text-left sm:text-right">
        <div>
          <p class="text-2xl font-semibold text-rose-200">{{ venueGroups.length }}</p>
          <p class="text-xs text-slate-400 uppercase tracking-wide">Venues</p>
        </div>
        <div>
          <p class="text-2xl font-semibold text-rose-200">{{ filterShowsForToday.length }}</p>
          <p class="text-xs text-slate-400 uppercase tracking-wide">Shows</p>
        </div>
      </div>
    </div>
    <div class="w-full rounded-xl overflow-hidden" style="height:600px">
      <LMap :zoom="zoom" :center="[41.8781, -87.6298]">
        <LTileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"
          layer-type="base"
          name="CartoDB Dark Matter"
        />
        <LMarker
          v-for="group in venueGroups"
          :key="group.slug"
          :lat-lng="[group.lat, group.lng]"
          :icon="markerIcon"
          @click="selectedVenue = group; drawerOpen = true"
        />
      </LMap>
    </div>

    <UDrawer v-model:open="drawerOpen">
      <template #header>
        <div class="flex items-start justify-between gap-4">
          <div v-if="selectedVenue">
            <NuxtLink
              :to="`/chicago/venues/${selectedVenue.slug}`"
              class="text-lg font-semibold text-white hover:text-orange-400 transition-colors"
            >
              {{ selectedVenue.name }}
            </NuxtLink>
            <p class="text-sm text-neutral-400 mt-0.5">{{ selectedVenue.address }}</p>
            <p class="text-xs text-neutral-500 mt-0.5">
              {{ selectedVenue.shows.length }} show{{ selectedVenue.shows.length !== 1 ? 's' : '' }} tonight
            </p>
          </div>
        </div>
      </template>

      <template #body>
        <div v-if="selectedVenue">
          <div
            v-for="show in selectedVenue.shows"
            :key="show.id"
            class="flex items-start justify-between gap-4 py-3.5 border-t border-neutral-800"
          >
            <div class="min-w-0">
              <p class="text-white font-medium leading-snug">{{ show.title }}</p>
              <p v-if="show.support" class="text-sm text-neutral-400 mt-0.5">w/ {{ show.support }}</p>
              <p class="text-xs text-neutral-500 mt-1 flex flex-wrap gap-x-1.5">
                <span v-if="show.doorsTime">Doors {{ show.doorsTime }}</span>
                <span v-if="show.doorsTime && show.showTime">·</span>
                <span v-if="show.showTime">Show {{ show.showTime }}</span>
                <span v-if="(show.doorsTime || show.showTime) && show.price">·</span>
                <span v-if="show.price">{{ show.price }}</span>
              </p>
            </div>
            <a
              v-if="show.url || show.secondaryUrl"
              :href="show.url || show.secondaryUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="shrink-0 text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors mt-0.5"
            >
              Tickets
            </a>
          </div>
        </div>
      </template>
    </UDrawer>
  </div>
</template>

