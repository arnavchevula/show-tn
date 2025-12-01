<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [{
  label: 'Home',
  to: '/',
  icon: 'i-lucide-book-open',
}, {
  label: 'Shows',
  to: '/chicago',
  icon: 'i-lucide-box',
  active: route.path.startsWith('/chicago')
},{
  label: 'About Us',
  to: '/about',
  icon: 'i-lucide-rocket',
  active: route.path.startsWith('/about')

}])
</script>

<template>
  <UHeader>
    <template #title>
      <Logo class="h-6 w-auto" />
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <UColorModeButton />

      <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/arnavchevula/show-tn/tree/master"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </UTooltip>
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
    </template>
  </UHeader>
</template>

