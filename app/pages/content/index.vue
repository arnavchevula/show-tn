<script setup lang="ts">
const { data: home } = await useAsyncData(() => queryCollection('content').all())

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description
})
console.log(home)
</script>

<template>
  <h1 class="text-3xl p-2 text-center font-medium">Editorial</h1>
  <hr class="border-t border-(--ui-border) mb-1" />
      <NuxtLink v-for="article in home" :to="`/content/${article.stem}`" class="block py-2 px-2 hover:bg-neutral-800 rounded-md border-b border-(--ui-border) last:border-b-0">
        <p class="text-xs text-slate-500 mb-1">{{ article.meta.length }} minute read</p>
        <h2 class="text-xl sm:text-2xl">{{ article.title }}</h2>
        <p class="text-sm text-slate-400 mb-1 italic tracking-tight">{{ article.description }}</p>
        <div class="flex items-center gap-x-2 text-xs sm:text-sm">
          <span class="font-medium text-slate-200">{{ article.meta.author }}</span>
          <span class="text-slate-600">·</span>
          <span class="text-slate-500">{{ article.meta.date }}</span>
        </div>
      </NuxtLink>

</template>