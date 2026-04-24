<script setup lang="ts">
const props = defineProps({ show: {} })
</script>

<template>
  <UCollapsible class="flex flex-col gap-2 w-fit">
    <UButton
      label="Add to Calendar"
      icon="i-lucide-calendar-plus"
      color="neutral"
      variant="outline"
      trailing-icon="i-lucide-chevron-down"
    />
    <template #content>
      <div class="flex flex-col gap-2">
        <UButton icon="i-lucide-download" size="md" color="neutral" variant="outline" @click="downloadIcs(props.show)">
          Download .ics File
        </UButton>
        <UButton icon="i-lucide-calendar-check" size="md" color="neutral" variant="outline" @click="openGoogleCalendar(props.show)">
          Add to Google Calendar
        </UButton>
      </div>

    </template>
  </UCollapsible>
</template>
