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
  support: z.string().optional(),
  parsedDate: z.iso.date(),
  venue: z.string('Venue is required'),
  doorsTime: z.string().optional(),
  url: z.string().optional(),
  source: z.literal('user')
})

const selectedVenue = ref();
const customVenue = ref('');
const useCustomVenue = ref(false);
const matchedEvents = ref([]);
const submitted = ref(false);
const honeypot = ref('');
const files = ref<File>()
const loading = ref(false);
const showForm = ref(false);

type Schema = z.output<typeof schema>

const activeVenue = computed(() => useCustomVenue.value ? customVenue.value || undefined : selectedVenue.value)

const state = reactive<Partial<Schema>>({
  title: undefined,
  support: undefined,
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
  state.support = undefined
  state.parsedDate = undefined
  state.doorsTime = undefined
  state.url = undefined
  selectedVenue.value = undefined
  customVenue.value = ''
  useCustomVenue.value = false
  files.value = undefined;
  showForm.value = false;
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
async function processImage() {
  loading.value = true;
  try {
    const file = files.value
    const formData = new FormData();
    formData.append('file', file); // 'file' is the key the server expects
    const response = await fetch('/api/create-event-from-flyer', {
      method: 'POST',
      body: formData,
      // IMPORTANT: Do NOT manually set 'Content-Type' header. 
      // The browser will set it automatically with the correct boundary.
    });
    const result = await response.json();
    const { parsed } = result;
    console.log(result);
    Object.assign(state, {
      title: parsed.title ?? undefined,
      support: parsed.support ?? undefined,
      parsedDate: parsed.parsedDate ?? undefined,
      doorsTime: toHHMM(parsed.doorsTime),
      url: parsed.url ?? undefined,
    })
    if (parsed.venue) {
      const match = venues.value.find(v => v.toLowerCase() === parsed.venue.toLowerCase())
      if (match) {
        selectedVenue.value = match
      } else {
        useCustomVenue.value = true
        customVenue.value = parsed.venue
      }
    }
    showForm.value = true;
  } catch (e) {
    console.error('processImage error:', e)
  } finally {
    loading.value = false;
  }
}
watch(files, async (newFiles, oldFiles) => {
  console.log(newFiles);
  console.log(oldFiles);
  if (newFiles) await processImage();
})
const toHHMM = (timeStr: string | null): string | undefined => {
  if (!timeStr) return undefined
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i)
  if (!match) return undefined
  let hour = parseInt(match[1], 10)
  const minute = match[2]
  const meridiem = match[3]?.toLowerCase()
  if (meridiem === 'pm' && hour < 12) hour += 12
  if (meridiem === 'am' && hour === 12) hour = 0
  return `${String(hour).padStart(2, '0')}:${minute}`
}

</script>

<template>
  <div class="m-2 space-y-4">
    <NuxtLink to="/chicago" class="inline-flex items-center gap-1 text-sm font-semibold tracking-wide text-rose-200 hover:text-rose-100 transition-colors mb-6">
      <UIcon name="i-lucide-arrow-left" class="size-4" />
      View All Shows
    </NuxtLink>
    <h1 class="text-4xl">Create an Event</h1>

    <!-- Upload -->
    <p v-if="!showForm">Have a flyer? Drop it here and we'll fill in the details for you.</p>
    <UFileUpload
      v-model="files"
      label="Drop your show flyer here!"
      description="SVG, PNG, JPG or GIF (max. 2MB)"
      class="w-96 min-h-48"
      layout="list"
    />
    <UProgress v-if="loading" animation="carousel" size="sm" />
    <button v-if="!showForm" class="text-sm text-neutral-400 hover:text-neutral-200 underline underline-offset-2 transition-colors" @click="showForm = true">
      Enter details manually instead
    </button>

    <!-- Event form (shown after upload or manual entry) -->
    <UForm v-else :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Title" name="title" class="w-full">
        <UInput v-model="state.title" class="w-full" />
      </UFormField>

      <UFormField label="Support" name="support" class="w-full">
        <UInput v-model="state.support" placeholder="Opening acts" class="w-full" />
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
  </div>
</template>

