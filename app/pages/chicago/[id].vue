<script setup lang="ts">
import { createClient } from "@supabase/supabase-js";
import { venueBySlug, venueByAlias } from "~/data/venues";
import { venueSlug } from "~/utils/calendar";
const { toggleFavorite, isFavorited } = useFavorites();
const toast = useToast();

const route = useRoute();
const showId = route.params.id;

const { allShows, fetchAllVenues } = useAggregatedShows();

const {
  public: { supabaseUrl, supabaseApiKeyBrowser, dbName, archiveDbName },
} = useRuntimeConfig();
const supabase = createClient(
  supabaseUrl as string,
  supabaseApiKeyBrowser as string,
);

const { data: show } = await useAsyncData(`show-${showId}`, async () => {
  if (!allShows.value.length) await fetchAllVenues();
  const fromState = allShows.value.find((s) => String(s.id) === String(showId));
  if (fromState) return fromState;

  let { data } = await supabase.from(dbName).select().eq("id", showId).single();
  if (!data) {
    ({ data } = await supabase
      .from(archiveDbName)
      .select()
      .eq("id", showId)
      .single());
  }
  return data ?? null;
});

const displayDate = computed(() => {
  const d = show.value?.parsedDate;
  if (!d) return "";
  // Client-side nav path: parsedDate is already a Date object from allShows state
  if (d instanceof Date)
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  // SSR/new tab path: parsedDate is a "YYYY-MM-DD" string — use UTC to avoid server timezone shifting the date
  const [year, month, day] = d.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
});

const generatedDescription = ref<string | null>(null);
const descriptionLoading = ref(false);

onMounted(async () => {
  if (show.value && !show.value.description) {
    descriptionLoading.value = true;
    const response = await $fetch("/api/generate-description", {
      method: "POST",
      body: show.value,
    });
    generatedDescription.value = response.parsed ?? null;
    descriptionLoading.value = false;
  }
});
const venueCoords = computed(() => {
  if (!show.value) return null;
  return (
    venueBySlug[venueSlug(show.value.venue)] ??
    venueByAlias[venueSlug(show.value.venue)] ??
    null
  );
});

const moreAtVenue = computed(() =>
  allShows.value
    .filter(
      (s) =>
        String(s.id) !== String(showId) &&
        venueSlug(s.venue) === venueSlug(show.value?.venue ?? "") &&
        new Date(s.parsedDate) >= new Date(),
    )
    .sort(
      (a, b) =>
        new Date(a.parsedDate).getTime() - new Date(b.parsedDate).getTime(),
    )
    .slice(0, 7),
);

const formatShowDate = (parsedDate: any) => {
  if (!parsedDate) return "";
  if (parsedDate instanceof Date)
    return parsedDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  const [year, month, day] = parsedDate.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
};

const isCopied = ref(false);

const copyLink = async () => {
  try {
    // Uses the standard Clipboard API to write text
    await navigator.clipboard.writeText(window.location.href);
    console.log(window.location.href);

    // Provide temporary visual feedback to the user
    isCopied.value = true;
    toast.add({
      title: "Success",
      description: "Show copied to clipboard!",
      color: "success",
    });

    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (error) {
    console.error("Failed to copy link: ", error);
  }
};
</script>

<template>
  <div class="container mx-auto px-4 sm:px-0 py-6">
    <NuxtLink
      to="/chicago"
      class="inline-flex item s-center gap-1 text-sm font-semibold tracking-wide text-rose-200 hover:text-rose-100 transition-colors mb-6"
    >
      <UIcon name="i-lucide-arrow-left" class="size-4" />
      View All Shows
    </NuxtLink>

    <div v-if="show" class="flex flex-col">
      <div class="flex flex-col md:flex-row gap-6">
        <NuxtImg
          v-if="show.image"
          :src="show.image"
          class="rounded-md mb-6 md:mb-0 hover:grayscale shrink-0 w-full aspect-[4/3] md:aspect-[3/4] md:w-100 object-cover transition duration-300"
        />
        <div>
          <div class="flex justify-between items-start">
            <div>
              <p
                v-if="show.header"
                class="text-sm md:text-base text-neutral-400 mb-1 lowercase tracking-wide"
              >
                {{ show.header }}
              </p>
              <h1 class="text-4xl md:text-5xl font-semibold mb-1">
                <NuxtLink
                  :to="show.url"
                  target="_blank"
                  rel="noopener nofollow"
                  class="hover:underline"
                >
                  {{ show.title }}
                </NuxtLink>
              </h1>
              <p v-if="show.support" class="text-base text-neutral-400 mb-4">
                {{ show.support }}
              </p>
            </div>
            <div class="flex items-center gap-1">
              <UButton
                variant="ghost"
                color="neutral"
                icon="i-lucide-share"
                @click="copyLink"
              />
              <UButton
                variant="ghost"
                color="neutral"
                icon="i-lucide-heart"
                :class="isFavorited(show?.id) ? 'text-rose-400' : ''"
                @click.stop="toggleFavorite(show?.id)"
              />
            </div>
          </div>
          <div
            class="flex flex-col gap-2 mb-6 border-b border-(--ui-border) pb-6"
          >
            <span class="flex items-center gap-x-2">
              <UIcon
                name="i-lucide-map-pin"
                class="size-4 text-rose-200 shrink-0"
              />
              <NuxtLink
                :to="`/chicago/venues/${venueSlug(show.venue)}`"
                class="hover:underline text-xl md:text-lg font-semibold"
                >{{ show.venue }}</NuxtLink
              >
            </span>
            <span class="flex items-center gap-x-2">
              <UIcon
                name="i-lucide-calendar-days"
                class="size-4 text-rose-200 shrink-0"
              />
              <span class="flex items-center gap-x-2 justify-center">
                <p>{{ displayDate }}</p>
              </span>
            </span>
            <span v-if="show.showTime" class="flex items-center gap-x-2">
              <UIcon
                name="i-lucide-clock"
                class="size-4 text-rose-200 shrink-0"
              />
              <p>{{ show.showTime }}</p>
            </span>
            <span
              v-if="show.doorsTime !== show.showTime && show.doorsTime"
              class="flex items-center gap-x-2"
            >
              <UIcon
                name="i-lucide-door-open"
                class="size-4 text-rose-200 shrink-0"
              />
              <p>{{ show.doorsTime }}</p>
            </span>
            <span v-if="show.age" class="flex items-center gap-x-2">
              <UIcon
                name="i-lucide-user"
                class="size-4 text-rose-200 shrink-0"
              />
              <p>{{ show.age }}</p>
            </span>
          </div>
          <div class="mb-6">
            <UIcon
              v-if="descriptionLoading"
              name="i-lucide-loader-circle"
              class="size-4 text-neutral-400 animate-spin"
            />
            <p
              v-else-if="show.description || generatedDescription"
              class="text-md text-slate-400 tracking-wide"
            >
              {{ show.description || generatedDescription }}
            </p>
            <div class="flex gap-2 flex-wrap mt-4">
              <div v-for="genre in show.genreTags">
                <div
                  class="uppercase text-sm text-slate-500 border border-slate-800 rounded-xl px-2"
                >
                  {{ genre }}
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <UButton
              v-if="show.url"
              icon="i-lucide-ticket"
              size="md"
              color="neutral"
              variant="outline"
              class="w-fit"
            >
              <a :href="show.url" target="_blank" rel="noopener nofollow"
                >Tickets</a
              >
            </UButton>
            <UButton
              v-if="show.secondaryUrl"
              icon="i-lucide-circle-arrow-out-up-right"
              color="neutral"
              variant="outline"
              class="w-fit"
            >
              <a
                :href="show.secondaryUrl"
                target="_blank"
                rel="noopener nofollow"
                >Learn More</a
              >
            </UButton>
            <AddToCalendar :show="show" />
            <UButton
              icon="i-lucide-navigation"
              size="md"
              color="neutral"
              variant="outline"
              class="w-fit"
              :as="'a'"
              :href="`https://maps.google.com/?q=${encodeURIComponent(show.venue + ' Chicago')}`"
              target="_blank"
              rel="noopener nofollow"
            >
              Get Directions
            </UButton>
            <div
              class="fixed w-full md:hidden py-4 bottom-0 left-0 z-999 backdrop-blur-lg bg-neutral-900/60 text-center text-sm font-bold tracking-widest uppercase border-t border-white/10"
              @click="
                navigateTo(show.url, {
                  external: true,
                  open: {
                    target: '_blank',
                  },
                })
              "
            >
              Tickets
            </div>
          </div>
        </div>
      </div>
      <div v-if="moreAtVenue.length" class="mt-10">
        <h2 class="text-lg font-semibold mb-4">More at {{ show.venue }}</h2>
        <div class="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <NuxtLink
            v-for="s in moreAtVenue"
            :key="s.id"
            :to="`/chicago/${s.id}`"
            class="min-w-52 w-52 shrink-0 flex flex-col rounded-xl hover:shadow-xl hover:shadow-slate-800 transition duration-300"
          >
            <div class="overflow-hidden rounded-xl group">
              <NuxtImg
                v-if="s.image"
                :src="s.image"
                class="aspect-[4/3] object-cover w-full transition duration-300 group-hover:scale-105 group-hover:brightness-75"
              />
              <div v-else class="aspect-[4/3] bg-slate-800 rounded-xl" />
            </div>
            <div class="px-1 pt-2 pb-1">
              <p
                class="text-xs text-neutral-400 uppercase tracking-wide font-medium"
              >
                {{ formatShowDate(s.parsedDate) }}
              </p>
              <h3 class="text-base font-semibold leading-tight">
                {{ s.title }}
              </h3>
              <p
                v-if="s.support"
                class="text-slate-400 text-sm mt-0.5 truncate"
              >
                {{ s.support }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div v-else>Show not found.</div>
  </div>
</template>
