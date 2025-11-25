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

const message = 'I created this site to solve an issue I kept having. Who is playing a show tonight? I would have to check every venue website and see who is playing tonight to see. There are 50+ venues in Chicago so this quickly could become an annoying endeavor combined with having to keep track of everything made it impossible. Furthermore you might miss out on shows because you forget whats happening and then miss out on your favorite band'
</script>

<template>
    <UPage>
        <UPageSection
    title="Making Live Music More Accessible"
    :description=message
    icon="i-lucide-rocket"
    orientation="vertical"
    :features="features"
    :links="links"
  >
  </UPageSection>
    </UPage>
</template>
