<script setup lang="ts">
const route = useRoute();
const email = route.query.email as string;
</script>

<template>
  <main
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-6"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 w-full max-w-md text-center"
    >
      <p class="text-5xl mb-4">📧</p>
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        Email'ini doğrula
      </h1>
      <p class="text-gray-500 dark:text-gray-400 text-sm mb-6">
        Kayıt olduğun email adresine bir doğrulama linki gönderdik. Linke
        tıklayarak hesabını aktif et.
      </p>
      <p class="text-xs text-gray-400 mb-6">
        Email gelmedi mi? Spam klasörünü kontrol et.
      </p>
      <NuxtLink
        to="/login"
        class="inline-flex items-center gap-2 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors duration-200"
        style="background-color: #593b8b"
      >
        Giriş Yap
      </NuxtLink>
    </div>
  </main>
</template>
