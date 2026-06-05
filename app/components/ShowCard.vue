<script setup lang="ts">
import { defineProps } from "vue";
const props = defineProps({
  show: {},
});

const displayDate = computed(() => {
  const d = props.show?.parsedDate;
  if (!d) return "";
  if (d instanceof Date) return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
});
const { toggleFavorite, isFavorited } = useFavorites();
const imgError = ref(false);
const venueImgError = ref(false);
const { public: { supabaseStorageBucket } } = useRuntimeConfig()
const venueFallbackImg = computed(() => `https://zylpuvjzvdyzfedpqqqh.supabase.co/storage/v1/object/public/${supabaseStorageBucket}/${venueSlug(props.show?.venue)}.webp`)
</script>

<template>
  <div class="flex flex-col rounded-lg hover:shadow-lg transition duration-300 h-full hover:shadow-slate-800">
    <div class="overflow-hidden rounded-xl group">
      <NuxtImg v-if="!imgError" :src="show.image" class="aspect-5/4 h-full w-full hover:scale-105 transition duration-300 hover:opacity-80 object-cover" @error="imgError = true"/>
      <img v-else-if="!venueImgError" :src="venueFallbackImg" class="aspect-5/4 h-full w-full object-cover hover:scale-105 transition duration-300 hover:opacity-80" @error="venueImgError = true" />
      <div v-else class="aspect-5/4 w-full rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
    </div>
    <div class="flex flex-col flex-1 px-2 mt-2">
      <div>
        <p class="lowercase text-muted text-sm">{{ show.header }}</p>
        <p class="font-semibold text-lg leading-tight">{{ show.title }}</p>
        <p class="text-muted text-sm truncate">{{ show.support }}</p>
        <div class="flex items-center gap-x-2 italic text-sm mt-0.5">
          <NuxtLink :to="`/chicago/venues/${venueSlug(show.venue)}`" class="hover:underline flex items-center gap-x-1">
            <UIcon name="i-lucide-map-pin" class="size-3 text-rose-200 shrink-0" />
            {{ show.venue }}
          </NuxtLink>
          <span>·</span>
          <span>{{ show.neighborhood }}</span>
        </div>
      </div>

      <div class="mt-auto pt-4">
        <div class="flex flex-col gap-y-1 text-sm text-muted mb-3">
          <span class="flex items-center gap-x-2">
            <UIcon name="i-lucide-calendar" class="size-4 text-rose-200 shrink-0" />
            <span>{{ displayDate }}</span>
          </span>
          <span v-if="props.show?.doorsTime !== props.show?.showTime && props.show?.doorsTime" class="flex items-center gap-x-2">
            <UIcon name="i-lucide-door-open" class="size-4 text-rose-200 shrink-0" />
            <span>{{ show.doorsTime }}</span>
          </span>
          <span v-if="show.showTime" class="flex items-center gap-x-2">
            <UIcon name="i-lucide-clock" class="size-4 text-rose-200 shrink-0" />
            <span>{{ show.showTime }}</span>
          </span>
          <span class="flex items-center gap-x-2">
            <UIcon name="i-lucide-user" class="size-4 text-rose-200 shrink-0" />
            <span>{{ show.age }}</span>
          </span>
        </div>
        <div class="flex flex-wrap gap-1 mb-2">
          <span v-for="genre in show.genreTags" :key="genre" class="px-2 py-0.5 text-xs lowercase tracking-wide border border-slate-700 rounded-full text-muted">{{ genre }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
