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
  <UHeader :ui="{ container: 'flex items-center justify-between gap-3 h-full px-2 sm:px-0 lg:px-0' }">
    <template #title>
      <Logo class="h-6 w-auto" />
    </template>
    <UNavigationMenu :items="items" />
    <template #left>
      <NuxtLink to="/chicago">
        <svg width="160" height="40" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Play button -->
            <polygon points="8,6 32,20 8,34" fill="#14B8A6"/>

            <!-- Waveform inside play button -->
              <polyline 
                points="10,20 14,20 16,14 20,26 24,18 28,20" 
                fill="none" 
                stroke="#0F172A" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
              />

            <!-- Text -->
            <text 
              x="40" 
              y="25" 
              font-family="Inter, Arial, sans-serif" 
              font-size="18" 
              fill="#14B8A6" 
              letter-spacing="0.5"
              >
              opener.fm
            </text>
        </svg>
      </NuxtLink>
    </template>
    <template #right>

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

