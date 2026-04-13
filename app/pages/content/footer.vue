<script setup lang="ts">
  const props = defineProps({
    title: String,
    author: String,
    bio: String,
    date: String,
    urls: {} 
  });
</script>
<template>
    <h2 class="text-3xl pt-2 mt-16">About The Author</h2>
        <span class="flex items-end gap-x-2 mt-2 mb-2 pb-2">
            <UAvatar :alt="props.author" size="lg" />
            <div class="flex flex-col items-end">
                <p class="text-xs mb-2">{{ props.author }}</p>
            </div>
        </span>
        <p class="text-sm tracking-tight text-slate-500">{{ props.bio }}</p>
        <div class="flex items-center gap-x-6 mt-6 mb-6"> 
            <UTooltip v-if="urls.instagram" text="Follow on Instagram" :kbds="['meta', 'G']">
                <UButton
                    color="neutral"
                    variant="ghost"
                    :to="urls.instagram"
                    target="_blank"
                    icon="i-simple-icons-instagram"
                    aria-label="Instagram"
                    class="p-0"
                />
            </UTooltip>
            <UTooltip v-if="urls.twitter" text="Follow on Twitter" :kbds="['meta', 'G']">
                <UButton
                    color="neutral"
                    variant="ghost"
                    :to="urls.twitter"
                    target="_blank"
                    icon="i-simple-icons-twitter"
                    aria-label="Twitter"
                    class="p-0"
                />
            </UTooltip>
            <UTooltip v-if="urls.substack" text="Follow on Substack" :kbds="['meta', 'G']">
                <UButton
                    color="neutral"
                    variant="ghost"
                    :to="urls.substack"
                    target="_blank"
                    icon="i-simple-icons-substack"
                    aria-label="Substack"
                    class="p-0"
                />
            </UTooltip>
            <UTooltip v-if="urls.gmail" text="Follow on Gmail" :kbds="['meta', 'G']">
                <UButton
                    color="neutral"
                    variant="ghost"
                    :to="urls.gmail"
                    target="_blank"
                    icon="i-simple-icons-gmail"
                    aria-label="Gmail"
                    class="p-0"
                />
            </UTooltip>
        </div>
</template>