<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useAggregatedShows } from '~/composables/useAggregatedShows';
import EventCard  from '~/components/EventCard.vue'
const { venues, fetchAllVenues } = useAggregatedShows();


type BatchEvent = z.output<typeof schema> & {
    status: 'pending' | 'submitting' | 'submitted' | 'error'
    error?: string
  }

onMounted(async () => {
  await fetchAllVenues();
})

const schema = z.object({
  title: z.string('Title is required'),
  header: z.string().optional(),
  support: z.string().optional(),
  parsedDate: z.iso.date(),
  venue: z.string('Venue is required'),
  doorsTime: z.string().optional(),
  age: z.string().optional(),
  url: z.string().optional(),
  source: z.literal('user')
})

                  
const selectedVenue = ref();
const customVenue = ref('');
const useCustomVenue = ref(false);
const useCustomVenueBatch = ref<boolean[]>([]);
const matchedEvents = ref([]);
const submitted = ref(false);
const honeypot = ref('');
const files = ref<File[]>([])
const loading = ref(false);
const showForm = ref(false);
const batchEvents = ref<BatchEvent[]>([]); 
const showParseFlyers = ref(false);
const uploadedImageUrl = ref<string | undefined>();

type Schema = z.output<typeof schema>

const activeVenue = computed(() => useCustomVenue.value ? customVenue.value || undefined : selectedVenue.value)

const state = reactive<Partial<Schema>>({
  title: undefined,
  header: undefined,
  support: undefined,
  parsedDate: undefined,
  venue: activeVenue,
  doorsTime: undefined,
  age: undefined,
  url: undefined,
  source: 'user'
})

useSeoMeta({
  title: 'opener.fm | Chicago Shows This Week',
  description: 'Submit a live music event in Chicago.',
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
  const response = await uploadImage(files.value[0])
  uploadedImageUrl.value = response?.imageUrl
  postData('/api/create-event', { state: { ...state, honeypot: honeypot.value, image: uploadedImageUrl.value } })
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
  files.value = [];
  showForm.value = false;
  batchEvents.value = [];
  uploadedImageUrl.value = undefined;
}

function onAlreadyListed() {
  resetForm()
  toast.add({ title: 'Got it!', description: 'You can find the event using the listing above.', color: 'info' })
}

async function onDifferentEvent() {
  postData('/api/create-event', { state: { ...state, forceSubmit: true, honeypot: honeypot.value, image: uploadedImageUrl.value } })
    .then((data) => {
      resetForm()
      matchedEvents.value = []
      submitted.value = true
      toast.add({ title: 'Submitted!', description: 'Your event has been submitted for review.', color: 'success' })
    })
    .catch((error) => console.error("Error:", error));
}

async function fetchParsed(file: File) {
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
    return parsed;
}

async function processSingleImage(file: File) {
  // calls fetchParsed
  loading.value = true;
  const newEvent = await fetchParsed(file);
  loading.value = false;
  Object.assign(state, {
      title: newEvent.title ?? undefined,
      header: newEvent.header ?? undefined,
      support: newEvent.support ?? undefined,
      parsedDate: newEvent.parsedDate ?? undefined,
      doorsTime: toHHMM(newEvent.doorsTime),
      age: newEvent.age ?? undefined,
      url: newEvent.url ?? undefined,
    })
    if (newEvent.venue) {
      const match = venues.value.find(v => v.toLowerCase() === newEvent.venue.toLowerCase())
      if (match) {
        selectedVenue.value = match
      } else {
        useCustomVenue.value = true
        customVenue.value = newEvent.venue
      }
    }
    showForm.value = true;
}

async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch('/api/upload-image', { method: 'POST', body: formData });
  return await response.json();
}

async function processBatch(files: File[]) {
  loading.value = true;
  const promises = files.map((file,index) => {
    return fetchParsed(file).then(event => ({
      ...event,
      doorsTime: toHHMM(event.doorsTime),
      venue: batchVenueSelect(event.venue, index)
    }));
  });
  batchEvents.value = await Promise.all(promises);
  loading.value = false;
}
function batchVenueSelect(venue: string | null, index: number): string | undefined {
  if (!venue) return undefined
  const match = venues.value.find(v => v.toLowerCase() === venue.toLowerCase())
  if (match) {
    return match
  } else {
    useCustomVenueBatch.value[index] = true
    return venue
  }
}
const batchRowErrors = computed(() =>
  batchEvents.value.map(event => {
    const errors: string[] = []
    if (!event.title) errors.push('Title required')
    if (!event.parsedDate) errors.push('Date required')
    if (!event.venue) errors.push('Venue required')
    return errors
  })
)

const batchIsValid = computed(() => batchRowErrors.value.every(errs => errs.length === 0))

async function submitSingleEvent(i: number) {
  batchEvents.value[i] = { ...batchEvents.value[i], status: 'submitting' }
  try {
    const imageResponse = await uploadImage(files.value[i])
    await postData('/api/create-event', { state: { ...batchEvents.value[i], forceSubmit: true, honeypot: honeypot.value, image: imageResponse?.imageUrl } })
    batchEvents.value[i] = { ...batchEvents.value[i], status: 'submitted' }
    if (batchEvents.value.every(e => e.status === 'submitted')) {
      resetForm()
      submitted.value = true
      toast.add({ title: 'Submitted!', description: 'Your events have been submitted for review.', color: 'success' })
    }
  } catch (e) {
    batchEvents.value[i] = { ...batchEvents.value[i], status: 'error', error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

async function submitBatch() {
  for (let i = 0; i < batchEvents.value.length; i++) {
    await submitSingleEvent(i)
  }
  const anyFailed = batchEvents.value.some(e => e.status === 'error')
  if (!anyFailed) {
    resetForm()
    submitted.value = true
    toast.add({ title: 'Submitted!', description: 'Your events have been submitted for review.', color: 'success' })
  } else {
    toast.add({ title: 'Some events failed', description: 'Review the errors and retry.', color: 'warning' })
  }
}
watch(files, async (newFiles, oldFiles) => {
  if (newFiles.length && newFiles.length === 1) {
    await processSingleImage(newFiles[0]);
  }
  else {
    showParseFlyers.value = true;
  }
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
    <p v-if="!showForm">Have flyers? Drop them here and we'll fill in the details for you.</p>
    <UFileUpload
      v-model="files"
      label="Drop your show flyers here!"
      description="SVG, PNG, JPG or GIF (max. 2MB)"
      class="w-96 min-h-48"
      layout="list"
      multiple
    >
    <template #files-bottom>
      <UButton v-if="files.length > 1" color="neutral" variant="outline" @click="processBatch(files)">
        Parse {{ files.length }} flyers
      </UButton>
    </template>
    </UFileUpload>
    <UProgress v-if="loading" animation="carousel" size="sm" />
    <button v-if="!showForm && batchEvents.length === 0" class="text-sm text-neutral-400 hover:text-neutral-200 underline underline-offset-2 transition-colors" @click="showForm = true">
      Enter details manually instead
    </button>

    <!-- Event form (shown after upload or manual entry) -->
    <UForm v-if="showForm" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Title" name="title" class="w-full">
        <UInput v-model="state.title" class="w-full" />
      </UFormField>

      <UFormField label="Header" name="header" class="w-full">
        <UInput v-model="state.header" placeholder="e.g. presented by, label name" class="w-full" />
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

      <UFormField label="Age Restriction" name="age" class="w-full">
        <UInput v-model="state.age" placeholder="e.g. 18+, All Ages" class="w-full" />
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

    <UForm v-if="batchEvents.length > 0" @submit="submitBatch">
      <div class="grid grid-cols-[2fr_1.5fr_1.5fr_150px_2fr_110px_80px_2fr_60px] gap-2 px-1 mb-1 text-xs text-neutral-400">
        <span>Title</span>
        <span>Header</span>
        <span>Support</span>
        <span>Date</span>
        <span>Venue</span>
        <span>Doors</span>
        <span>Age</span>
        <span>URL</span>
        <span></span>
      </div>
      <div v-for="(batchEvent, index) in batchEvents" :key="index" class="grid grid-cols-[2fr_1.5fr_1.5fr_150px_2fr_110px_80px_2fr_60px] gap-2 mb-3 items-start">
        <UInput size="sm" v-model="batchEvents[index].title" @update:modelValue="batchEvents[index]={...batchEvents[index],title:$event}" placeholder="Title" class="w-full" />
        <UInput size="sm" v-model="batchEvents[index].header" @update:modelValue="batchEvents[index]={...batchEvents[index],header:$event}" placeholder="Header" class="w-full" />
        <UInput size="sm" v-model="batchEvents[index].support" @update:modelValue="batchEvents[index]={...batchEvents[index],support:$event}" placeholder="Opening acts" class="w-full" />
        <UInput size="sm" v-model="batchEvents[index].parsedDate" @update:modelValue="batchEvents[index]={...batchEvents[index],parsedDate:$event}" type="date" class="w-full" />
        <div>
          <USelectMenu
            v-if="!useCustomVenueBatch[index]"
            size="sm"
            v-model="batchEvents[index].venue"
            @update:modelValue="batchEvents[index]={...batchEvents[index],venue:$event}"
            :items="venues"
            placeholder="Venue"
            class="w-full"
          />
          <UInput
            v-else
            size="sm"
            v-model="batchEvents[index].venue"
            @update:modelValue="batchEvents[index]={...batchEvents[index],venue:$event}"
            placeholder="Custom venue"
            class="w-full"
          />
          <button type="button" class="text-xs text-neutral-400 hover:text-neutral-200 transition-colors mt-0.5" @click="useCustomVenueBatch[index] = !useCustomVenueBatch[index]">
            {{ useCustomVenueBatch[index] ? 'Use dropdown' : 'Enter manually' }}
          </button>
        </div>
        <UInput size="sm" v-model="batchEvents[index].doorsTime" @update:modelValue="batchEvents[index]={...batchEvents[index],doorsTime:$event}" type="time" class="w-full" />
        <UInput size="sm" v-model="batchEvents[index].age" @update:modelValue="batchEvents[index]={...batchEvents[index],age:$event}" placeholder="18+, All Ages" class="w-full" />
        <UInput size="sm" v-model="batchEvents[index].url" @update:modelValue="batchEvents[index]={...batchEvents[index],url:$event}" type="url" placeholder="URL" class="w-full" />
        <div class="flex items-center gap-1 pt-1">
          <UIcon v-if="batchEvent.status === 'submitting'" name="i-lucide-loader-circle" class="size-4 animate-spin text-neutral-400" />
          <UIcon v-else-if="batchEvent.status === 'submitted'" name="i-lucide-circle-check" class="size-4 text-green-500" />
          <template v-else-if="batchEvent.status === 'error'">
            <UTooltip :text="batchEvent.error ?? 'Unknown error'">
              <UIcon name="i-lucide-circle-x" class="size-4 text-red-500" />
            </UTooltip>
            <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-refresh-cw" @click="submitSingleEvent(index)" />
          </template>
        </div>
        <div v-if="batchRowErrors[index]?.length" class="col-span-full flex gap-2 flex-wrap -mt-1">
          <p v-for="err in batchRowErrors[index]" class="text-xs text-red-400">{{ err }}</p>
        </div>
      </div>
      <UButton type="submit" icon="i-lucide-circle-check" size="md" color="neutral" variant="outline" class="mt-2" :disabled="!batchIsValid">
        Submit
      </UButton>
    </UForm>
  </div>
</template>

