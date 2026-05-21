<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: "primary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
  }>(),
  {
    variant: "primary",
    size: "md",
  },
);
</script>

<template>
  <button
    class="inline-flex items-center gap-2 font-medium rounded-lg transition-colors duration-200"
    :class="{
      // Variant
      'text-white': variant === 'primary',
      'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700':
        variant === 'outline',
      'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700':
        variant === 'ghost',

      // Size
      'px-3 py-1.5 text-xs': size === 'sm',
      'px-4 py-2 text-sm': size === 'md',
      'px-6 py-3 text-base': size === 'lg',
    }"
    :style="variant === 'primary' ? 'background-color: #593b8b;' : ''"
    @mouseenter="
      (e) => {
        if (variant === 'primary')
          (e.currentTarget as HTMLElement).style.backgroundColor = '#4a3275';
      }
    "
    @mouseleave="
      (e) => {
        if (variant === 'primary')
          (e.currentTarget as HTMLElement).style.backgroundColor = '#593b8b';
      }
    "
  >
    <slot />
  </button>
</template>
