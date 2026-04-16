<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'

const route = useRoute()
const showId = route.params.id

const { allShows } = useAggregatedShows()

const { public: { supabaseUrl, supabaseApiKeyBrowser, dbName, archiveDbName } } = useRuntimeConfig()
const supabase = createClient(supabaseUrl as string, supabaseApiKeyBrowser as string)

const { data: show } = await useAsyncData(`show-${showId}`, async () => {
  const fromState = allShows.value.find((s) => String(s.id) === String(showId))
  if (fromState) return fromState

  let { data } = await supabase.from(dbName).select().eq('id', showId).single()
  if (!data) {
    ({ data } = await supabase.from(archiveDbName).select().eq('id', showId).single())
  }
  return data ?? null
})

const displayDate = computed(() => {
  const d = show.value?.parsedDate
  if (!d) return ''
  // Client-side nav path: parsedDate is already a Date object from allShows state
  if (d instanceof Date) return d.toDateString()
  // SSR/new tab path: parsedDate is a "YYYY-MM-DD" string — use UTC to avoid server timezone shifting the date
  const [year, month, day] = d.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(Date.UTC(year, month - 1, day)))
})
</script>

<template>
  <div class="container mx-auto px-4 sm:px-0 py-6">
    <NuxtLink to="/chicago" class="inline-flex items-center gap-1 text-sm font-semibold tracking-wide text-rose-200 hover:text-rose-100 transition-colors mb-6">
      <UIcon name="i-lucide-arrow-left" class="size-4" />
      View All Shows
    </NuxtLink>

    <div v-if="show">
      <NuxtImg v-if="show.image" :src="show.image" class="w-full sm:w-auto sm:max-h-56 rounded-md mb-6 grayscale" />

      <p v-if="show.header" class="text-sm text-neutral-400 mb-1">{{ show.header }}</p>
      <h1 class="text-4xl font-semibold mb-1">{{ show.title }}</h1>
      <p v-if="show.support" class="text-base text-neutral-400 mb-4">{{ show.support }}</p>

      <div class="flex flex-col gap-2 mb-6">
        <span class="flex items-center gap-x-2">
          <UIcon name="i-lucide-map-pin" class="size-4 text-rose-200 shrink-0" />
          <p>{{ show.venue }}</p>
        </span>
        <span class="flex items-center gap-x-2">
          <UIcon name="i-lucide-calendar-days" class="size-4 text-rose-200 shrink-0" />
          <p>{{ displayDate }}</p>
        </span>
        <span v-if="show.showTime" class="flex items-center gap-x-2">
          <UIcon name="i-lucide-clock" class="size-4 text-rose-200 shrink-0" />
          <p>{{ show.showTime }}</p>
        </span>
        <span v-if="show.doorsTime !== show.showTime && show.doorsTime" class="flex items-center gap-x-2">
          <UIcon name="i-lucide-door-open" class="size-4 text-rose-200 shrink-0" />
          <p>{{ show.doorsTime }}</p>
        </span>
        <span v-if="show.age" class="flex items-center gap-x-2">
          <UIcon name="i-lucide-user" class="size-4 text-rose-200 shrink-0" />
          <p>{{ show.age }}</p>
        </span>
      </div>
      <p v-if="show.description" class="mb-6 text-sm text-slate-400">
        {{ show.description }}
      </p>
      <div class="flex gap-2">
        <UButton v-if="show.url" icon="i-lucide-ticket" size="md" color="neutral" variant="outline">
          <a :href="show.url" target="_blank" rel="noopener nofollow">Tickets</a>
        </UButton>
        <UButton v-if="show.secondaryUrl" icon="i-lucide-circle-arrow-out-up-right" size="md" color="neutral" variant="outline">
          <a :href="show.secondaryUrl" target="_blank" rel="noopener nofollow">Learn More</a>
        </UButton>
      </div>
    </div>

    <div v-else>Show not found.</div>
  </div>
</template>
