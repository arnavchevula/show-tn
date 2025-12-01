<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[] = [
  {
    label: 'About',
    to: '/about',
    target: '_blank'

  },
  {
    label: 'Contact',
    to: 'https://mrarnav.netlify.app/',
    target: '_blank'
  },
  {
    label: 'Releases',
    to: 'https://github.com/arnavchevula/show-tn/tree/master',
    target: '_blank'
  }
]
</script>

<template>
  <UFooter>
    <template #left>
      <p class="text-muted text-sm">Copyright © {{ new Date().getFullYear() }}</p>
    </template>
    <UNavigationMenu :items="items" variant="link" />
  </UFooter>
</template>
