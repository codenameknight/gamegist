<script setup lang="ts">
const props = defineProps<{
  modelValue: number;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();

const hovered = ref(0);

function setRating(value: number) {
  if (props.readonly) return;
  emit("update:modelValue", value);
}
</script>

<template>
  <div class="flex gap-1">
    <button
      v-for="star in 5"
      :key="star"
      @click="setRating(star)"
      @mouseenter="!readonly && (hovered = star)"
      @mouseleave="!readonly && (hovered = 0)"
      :disabled="readonly"
      class="text-2xl transition-transform duration-100"
      :class="[
        !readonly ? 'hover:scale-125 cursor-pointer' : 'cursor-default',
        star <= (hovered || modelValue) ? 'text-yellow-400' : 'text-gray-300',
      ]"
    >
      ★
    </button>
  </div>
</template>
