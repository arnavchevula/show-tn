<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useAggregatedShows } from '~/composables/useAggregatedShows';
const { venues, fetchAllVenues } = useAggregatedShows();
await fetchAllVenues();


const schema = z.object({
  title: z.string('Title is required'),
  parsedDate: z.iso.date(),
  venue: z.string('Venue is required'),
  doorsTime: z.string(),
  url: z.string(),
  source: z.literal('user')
})

const selectedVenues = ref();


type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  title: undefined,
  parsedDate: undefined,
  venue: selectedVenues,
  doorsTime: undefined,
  url: undefined,
  source: 'user'
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST", // Specify the request method
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // Convert the JavaScript object to a JSON string
  });

  if (!response.ok) {
    // Fetch only rejects on network errors, so you must check for HTTP errors (e.g., 404, 500)
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json(); // Parse the response body as JSON
}
// Usage:
postData('/api/create-event', {state})
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
  console.log(event.data)
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="m-2 space-y-4" @submit="onSubmit">
    <h1 class="text-4xl">Create an Event</h1>
    <p> Didn't see your event listed? We're working everyday to ensure our data is up to date and includes every venues listings. Please enter your events information here and we will make sure it gets listed on the platform!</p>
    <UFormField label="Title" name="title">
      <UInput v-model="state.title" />
    </UFormField>
    
    <UFormField label="Date" name="date">
      <UInput v-model="state.parsedDate" type="date" />
    </UFormField>

    <UFormField label="Venue" name="venue">
        <USelectMenu
        v-model="selectedVenues"
        :items="venues"
        placeholder="All venues"
        class="mb-2 w-full sm:w-auto"
      />   
    </UFormField>

    <UFormField label="Doors Time" name="doorsTime">
      <UInput v-model="state.doorsTime" type="time" />
    </UFormField>

    <UFormField label="Event Url" name="url">
      <UInput v-model="state.url" type="url" />
    </UFormField>

    <UButton type="submit" icon="i-lucide-circle-check" size="md" color="neutral" variant="outline">
      Submit
    </UButton>
  </UForm>
</template>

