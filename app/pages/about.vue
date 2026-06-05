<script setup lang="ts">
const features = ref([
  {
    title: 'Show Listing',
    description: 'See a comprehensive list of all shows across Chicago to save you time and help plan an unforgettable night!',
    icon: 'i-lucide-smile',
    to: '/chicago'
  },
  {
    title: 'Reminders',
    description: 'Have our site remind you when a show is coming up so you never miss your favorite artist!',
    icon: 'i-lucide-a-large-small',
    to: '/chicago'
  },
  {
    title: 'AI Powered Filtering',
    description: 'Filter by genre so you can be sure you enjoy what you\'re going to see!',
    icon: 'i-lucide-sun-moon',
    to: '/chicago'
  }
])
const links = ref([
  {
    label: 'Explore Chicago\'s Music Scene',
    to: '/chicago',
    color: 'neutral',
    variant: 'subtle',
    trailingIcon: 'i-lucide-arrow-right'
  }
])

</script>

<template>
    <UPage>
        <UPageSection
    title="Making Live Music More Accessible"
    icon="i-lucide-rocket"
    orientation="vertical"
    :features="features"
    :links="links"
  >
    <template #description>
      I created this site to solve an issue I kept having. Who is playing a show tonight? I would have to check every venue website and see who is playing tonight to see. There are 50+ venues in Chicago so this quickly could become an annoying endeavor combined with having to keep track of everything made it impossible. Furthermore you might miss out on shows because you forget whats happening and then miss out on your favorite band. This is not an exhaustive list, there are many venues that are not included on this site. For a more comprehensive listing, check out these other great resources:
      <ul class="mt-2 space-y-1 list-disc list-inside">
        <li><NuxtLink to="https://www.chicagoshowcalendar.com/" target="_blank" class="underline hover:text-white transition-colors">Chicago Show Calendar</NuxtLink></li>
        <li><NuxtLink to="https://19hz.info/" target="_blank" class="underline hover:text-white transition-colors">19hz</NuxtLink></li>
        <li><NuxtLink to="https://www.ohmyrockness.com/" target="_blank" class="underline hover:text-white transition-colors">Oh My Rockness</NuxtLink></li>
        <li><NuxtLink to="https://musechitown.com/" target="_blank" class="underline hover:text-white transition-colors">Muse Chi Town</NuxtLink></li>
      </ul>
    </template>
  </UPageSection>
    </UPage>
</template>
