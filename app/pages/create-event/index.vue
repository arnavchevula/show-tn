<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useAggregatedShows } from '~/composables/useAggregatedShows';
import EventCard  from '~/components/EventCard.vue'
const { venues, fetchAllVenues } = useAggregatedShows();
onMounted(async () => {
  await fetchAllVenues();
})


const schema = z.object({
  title: z.string('Title is required'),
  parsedDate: z.iso.date(),
  venue: z.string('Venue is required'),
  doorsTime: z.string(),
  url: z.string(),
  source: z.literal('user')
})

const selectedVenue = ref();
const customVenue = ref('');
const useCustomVenue = ref(false);
const matchedEvents = ref([]);
const submitted = ref(false);
const honeypot = ref('');

type Schema = z.output<typeof schema>

const activeVenue = computed(() => useCustomVenue.value ? customVenue.value || undefined : selectedVenue.value)

const state = reactive<Partial<Schema>>({
  title: undefined,
  parsedDate: undefined,
  venue: activeVenue,
  doorsTime: undefined,
  url: undefined,
  source: 'user'
})

const toast = useToast()

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  postData('/api/create-event', { state: { ...state, honeypot: honeypot.value } })
    .then((data) => {
      if (!data.message && data) {
        matchedEvents.value = data
      } else {
        submitted.value = true
        resetForm();
        matchedEvents.value=[];
        toast.add({ title: 'Success', description: 'Your event has been submitted for review.', color: 'success' })
      }
    })
    .catch((error) => console.error("Error:", error));
}

function resetForm() {
  state.title = undefined
  state.parsedDate = undefined
  state.doorsTime = undefined
  state.url = undefined
  selectedVenue.value = undefined
  customVenue.value = ''
  useCustomVenue.value = false
}

function onAlreadyListed() {
  resetForm()
  toast.add({ title: 'Got it!', description: 'You can find the event using the listing above.', color: 'info' })
}

async function onDifferentEvent() {
  postData('/api/create-event', { state: { ...state, forceSubmit: true, honeypot: honeypot.value } })
    .then((data) => {
      resetForm()
      matchedEvents.value = []
      submitted.value = true
      toast.add({ title: 'Submitted!', description: 'Your event has been submitted for review.', color: 'success' })
    })
    .catch((error) => console.error("Error:", error));
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="m-2 space-y-4" @submit="onSubmit">
    <NuxtLink to="/chicago" class="inline-flex items-center gap-1 text-sm font-semibold tracking-wide text-rose-200 hover:text-rose-100 transition-colors mb-6">
      <UIcon name="i-lucide-arrow-left" class="size-4" />
      View All Shows
    </NuxtLink>
    <h1 class="text-4xl">Create an Event</h1>
    <p> Didn't see your event listed? We're working everyday to ensure our data is up to date and includes every venues listings. Please enter your events information here and we will make sure it gets listed on the platform!</p>
    <UFormField label="Title" name="title" class="w-full">
      <UInput v-model="state.title" class="w-full" />
    </UFormField>

    <UFormField label="Date" name="date" class="w-full">
      <UInput v-model="state.parsedDate" type="date" class="w-full" />
    </UFormField>

    <UFormField label="Venue" name="venue" class="w-full">
      <USelectMenu
        v-if="!useCustomVenue"
        v-model="selectedVenue"
        :items="venues"
        placeholder="All venues"
        class="w-full"
      />
      <UInput
        v-else
        v-model="customVenue"
        placeholder="e.g. Someone's Basement, DIY Space"
        class="w-full"
      />
      <UCheckbox v-model="useCustomVenue" label="Don't see your venue? Enter it manually" class="mt-2" />
    </UFormField>

    <UFormField label="Doors Time" name="doorsTime" class="w-full">
      <UInput v-model="state.doorsTime" type="time" class="w-full" />
    </UFormField>

    <UFormField label="Event Url" name="url" class="w-full">
      <UInput v-model="state.url" type="url" class="w-full" />
    </UFormField>

    <input v-model="honeypot" name="website" type="text" autocomplete="off" tabindex="-1" aria-hidden="true" style="display:none" />
    <UButton type="submit" icon="i-lucide-circle-check" size="md" color="neutral" variant="outline">
      Submit
    </UButton>
    <div v-if="matchedEvents && matchedEvents.length > 0">
      <p class="font-medium">We already have these events at this venue on that date — is yours one of them?</p>
      <div v-for="show in matchedEvents" :key="show.id">
        <NuxtLink :to="`/chicago/${show.id}`">
          <EventCard :show="show" />
        </NuxtLink>
      </div>
      <div class="flex items-center gap-x-2 mt-3">
        <UButton color="neutral" variant="outline" @click="onAlreadyListed">Yes, it's already listed</UButton>
        <UButton color="neutral" variant="outline" @click="onDifferentEvent">No, mine is different</UButton>
      </div>
    </div>
  </UForm>
</template>

