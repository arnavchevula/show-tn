<script setup lang="ts">
const url = useRequestURL();

useSeoMeta({
  title: "opener.fm | Upcoming Chicago Shows",
  description:
    "Browse upcoming live music events in Chicago. Shows at Beat Kitchen, Empty Bottle, Lincoln Hall, Thalia Hall, SmartBar, Salt Shed, and more.",
  ogTitle: "opener.fm | Upcoming Chicago Shows",
  ogDescription:
    "Browse upcoming live music events in Chicago. Shows at Beat Kitchen, Empty Bottle, Lincoln Hall, Thalia Hall, SmartBar, Salt Shed, and more.",
  ogType: "website",
  ogUrl: url.href,
  ogSiteName: "opener.fm",
  ogImage: "https://opener.fm/og-image.png",
  twitterCard: "summary_large_image",
  twitterImage: "https://opener.fm/og-image.png",
  twitterTitle: "opener.fm | Upcoming Chicago Shows",
  twitterDescription:
    "Browse upcoming live music events in Chicago. Shows at Beat Kitchen, Empty Bottle, Lincoln Hall, Thalia Hall, SmartBar, Salt Shed, and more.",
  keywords:
    "upcoming chicago live music, chicago shows, chicago concerts, events in chicago, what to do in chicago, chicago nightlife, Beat Kitchen shows, Thalia Hall shows, The Hideout Chicago, Sleeping Village Chicago, Coles Bar Chicago, Dorians Chicago, Aragon Ballroom shows, Chop Shop Chicago, Bottom Lounge Chicago, The Whistler Chicago, California Clipper Chicago, SmartBar Chicago, Gman Tavern Chicago, Podlasie Club Chicago, Lemon Chicago, Book Club Chicago, The Salt Shed Chicago, Clara Chicago, Smoke and Mirrors Chicago, Avondale Music Hall Chicago, Cobra Lounge Chicago, Lincoln Hall Chicago, Schubas Tavern Chicago, SubT Chicago, Empty Bottle Chicago, Park West Chicago, The Vic Chicago, The Riviera Chicago",
});

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Show TN",
        url: url.origin,
        description:
          "Find upcoming live music events and shows across Chicago venues.",
        potentialAction: {
          "@type": "SearchAction",
          target: `${url.origin}/chicago`,
          "query-input": "required name=search_term_string",
        },
      }),
    },
  ],
});

const links = ref([
  {
    label: "Learn More",
    to: "/about",
    icon: "i-lucide-square-play",
  },
  {
    label: "Live Show Listings",
    to: "/chicago",
    color: "neutral",
    variant: "subtle",
    trailingIcon: "i-lucide-arrow-right",
  },
]);
const headlines: string[] = [
  "Aren't you tired of missing all your favorite bands? Bored on a Wednesday night? Want to switch it up from hitting the bars in Wrigley and Logan? Get cultured now.",
  "Discover live music events happening in Chicago. From intimate venues to iconic stages, explore a diverse lineup of shows across the city and never miss out on the vibrant music scene again.",
  "Wake up, its the first of the month!",
  "Don't be a goofy.",
  "Tom Skilling's favorite Chicago live music aggregator.",
  "Onions, celery salt, pickle spear, relish, mustard, tomatoes and sport peppers.",
  "Hot or sweet peppers?",
  "Hold the ketchup.",
  "Malort & Old Style only.",
  "Go Cubs, Go.",
  "Go Sox.",
  "Bear Down.",
  "Bears, Hawks, Sox, Bulls.",
  "Like 90's Jordan but for music.",
  "No Federales tonight, I beg you.",
  "Only city with El Milagro Tortillas.",
  "Best architecture & best music scene in the world.",
  "North Coast is the best coast.",
  "We gonna blow New Jersey up.",
  "Get up off the couch and get in the pit.",
  "No bottle service here, just music.",
  "You're scaring the hoes.",
  "What the fuck is up Dennys?",
  "The Home of Chief Keef and Wilco.",
  "This is not a fucking John Hughes movie.",
  "We're not in Naperville any more.",
  "Count your days Dave Matthews.",
  "Life, Laugh, Love.",
  "The Windy City beckons for you.",
  "Where else are you gonna go? Cleveland?",
  "Evanston is not a part of Chicago.",
  "Sugar, we're going down.",
];
</script>

<template>
  <div
    class="w-full max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center py-24 sm:py-32 lg:py-40"
  >
    <div class="text-center">
      <h1
        class="text-5xl sm:text-7xl lg:text-8xl text-pretty tracking-tight font-bold text-highlighted"
      >
        support the Chicago scene.
      </h1>
      <p class="text-lg sm:text-xl lg:text-2xl italic text-muted text-balance mt-6">
        {{ headlines[Math.floor(Math.random() * headlines.length)] }}
      </p>
      <p class="text-sm sm:text-base lg:text-lg text-dimmed mt-3">
        Find your next show in Chicago.
      </p>
      <div
        class="flex flex-wrap gap-x-6 gap-y-3 items-center justify-center mt-10"
      >
      <NuxtLink to="/about">
          <UButton
            color="neutral"
            variant="outline"
            size="xl"
            icon="i-lucide-square-play"
            >Learn More</UButton
          >
        </NuxtLink>
        <NuxtLink to="/chicago">
          <UButton
            color="primary"
            variant="solid"
            size="xl"
            icon="i-lucide-arrow-right"
            >Live Show Listings</UButton
          >
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
