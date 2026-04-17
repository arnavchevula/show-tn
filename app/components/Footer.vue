<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[] = [
  {
    label: 'About',
    to: '/about',
    target: '_self'
  },
  {
    label: 'Shows',
    to: '/chicago',
    target: '_self'
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
  <UFooter :ui="{ container:'!px-0' }">
    <template #left>
      <p class="text-muted text-sm">Copyright © {{ new Date().getFullYear() }}</p>
    </template>
    <UNavigationMenu :items="items" variant="link" />
    <template #right>
      <a href="https://www.buymeacoffee.com/navviec" target="_blank" rel="noopener">
        <img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me a Coffee" style="height: 45px !important; width: 163px !important;">
      </a>
    </template>
  </UFooter>
</template>
