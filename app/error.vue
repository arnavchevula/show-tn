<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen gap-4">
    <h1 class="text-6xl font-bold">{{ error?.statusCode }}</h1>
    <p class="text-xl text-gray-400">{{ error?.message }}</p>
    <UButton @click="handleError">Go back home</UButton>
  </div>
</template>
