<script setup lang="ts">
const error = useError();

function goHome() {
  clearError({ redirect: "/" });
}
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-6"
  >
    <div class="text-center">
      <p class="text-8xl mb-6">
        {{ error?.statusCode === 404 ? "🔍" : "😵" }}
      </p>
      <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-4">
        {{ error?.statusCode === 404 ? "Sayfa Bulunamadı" : "Bir Hata Oluştu" }}
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mb-8">
        {{
          error?.statusCode === 404
            ? "Aradığın sayfa mevcut değil veya taşınmış olabilir."
            : "Beklenmedik bir hata oluştu. Lütfen tekrar dene."
        }}
      </p>
      <button
        @click="goHome"
        class="inline-flex items-center gap-2 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors duration-200"
        style="background-color: #593b8b"
        @mouseenter="
          (e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor = '#4a3275')
        "
        @mouseleave="
          (e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor = '#593b8b')
        "
      >
        🏠 Ana Sayfaya Dön
      </button>
    </div>
  </div>
</template>
