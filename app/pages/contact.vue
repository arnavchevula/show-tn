<script setup lang="ts">
const form = reactive({ name: "", email: "", message: "" });
const loading = ref(false);
const sent = ref(false);
const error = ref<string | null>(null);

const submit = async () => {
  loading.value = true;
  error.value = null;
  try {
    await $fetch("/api/contact", {
      method: "POST",
      body: form,
    });
    sent.value = true;
  } catch (e: any) {
    error.value = e?.data?.message ?? "Something went wrong. Try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="container mx-auto px-4 sm:px-0 py-12 max-w-lg">
    <p class="text-sm text-neutral-400 uppercase tracking-wide mb-1">opener.fm</p>
    <h1 class="text-4xl font-semibold mb-2">Get in touch</h1>
    <p class="text-neutral-400 mb-8">
      Venue missing? Bug to report? Just want to say hi? Drop a note.
    </p>

    <div v-if="sent" class="flex flex-col gap-2">
      <UIcon name="i-lucide-circle-check" class="size-8 text-green-400" />
      <p class="text-lg font-medium">Message sent.</p>
      <p class="text-neutral-400 text-sm">I'll get back to you soon.</p>
    </div>

    <form v-else class="flex flex-col gap-4" @submit.prevent="submit">
      <UFormField label="Name">
        <UInput v-model="form.name" placeholder="Your name" required class="w-full" />
      </UFormField>

      <UFormField label="Email">
        <UInput v-model="form.email" type="email" placeholder="you@example.com" required class="w-full" />
      </UFormField>

      <UFormField label="Message">
        <UTextarea v-model="form.message" placeholder="What's on your mind?" required :rows="5" class="w-full" />
      </UFormField>

      <p v-if="error" class="text-sm text-red-400">{{ error }}</p>

      <UButton type="submit" :loading="loading" class="w-fit">
        Send message
      </UButton>
    </form>
  </div>
</template>
