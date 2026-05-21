<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const wishlistStore = useWishlistStore();
const user = useSupabaseUser();
</script>

<template>
  <main class="max-w-7xl mx-auto px-6">
    <h1 class="text-2xl font-bold my-6 text-gray-800 dark:text-white">
      ❤️ Wishlistim
    </h1>

    <!-- Yükleniyor -->
    <div
      v-if="wishlistStore.pending"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6"
    >
      <GameCardSkeleton v-for="n in 4" :key="n" />
    </div>

    <!-- Boş wishlist -->
    <div v-else-if="wishlistStore.items.length === 0" class="text-center mt-20">
      <p class="text-5xl mb-4">😢</p>
      <p class="text-gray-500">Henüz wishlist'ine oyun eklemedin.</p>
      <NuxtLink
        to="/"
        class="text-blue-500 hover:underline text-sm mt-2 inline-block"
      >
        Oyunlara göz at →
      </NuxtLink>
    </div>

    <!-- Oyunlar -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6"
    >
      <GameCard
        v-for="game in wishlistStore.items"
        :key="game.id"
        :game="game"
      />
    </div>
  </main>
</template>
