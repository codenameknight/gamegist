<template>
  <div class="flex justify-center">
    <div
      class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md w-full max-w-xs"
    >
      <div class="w-full h-44 bg-gray-300 dark:bg-gray-600 skeleton"></div>
      <div class="p-4">
        <div
          class="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-3/4 skeleton"
        ></div>
        <div
          class="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1 w-1/4 skeleton"
        ></div>
        <div
          class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 skeleton"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
</style>
