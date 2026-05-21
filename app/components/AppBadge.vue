<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: "purple" | "gray";
  }>(),
  {
    variant: "purple",
  },
);
</script>

<template>
  <span
    class="text-xs px-3 py-1 rounded-full font-medium"
    :class="{
      'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300':
        variant === 'purple',
      'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400':
        variant === 'gray',
    }"
  >
    <slot />
  </span>
</template>
