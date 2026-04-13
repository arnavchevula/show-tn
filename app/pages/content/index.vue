<script setup lang="ts">
const { data: home } = await useAsyncData(() => queryCollection('content').all())

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description
})
console.log(home)
</script>

<template>
  <h1 class="text-5xl mb-2 p-2 text-center font-bold">Editorial</h1>
      <div v-for="article in home">
        <div class="border-b-red-200 border-b p-2">
          <NuxtLink :to="`/content/${article.stem}`">
          <h2 class="text-4xl">{{ article.title }}</h2>
          <span class="flex items-end gap-x-2 mt-2 mb-2">
            <UAvatar :alt="article.meta?.author" size="md" />
            <p class="text-xs mb-2">{{ article.meta.author }}</p>
          </span>
          <p class="text-sm">{{article.description }}</p>
        </NuxtLink>
        </div>
      </div>

</template>