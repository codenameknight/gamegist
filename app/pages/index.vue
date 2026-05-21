<script setup lang="ts">
const { pending, error, genres, platforms, filteredGames } = useGames();
const filterStore = useFilterStore();
const gamesStore = useGamesStore();
const categories = [
  { key: "popular", label: "🔥 Popüler" },
  { key: "last30days", label: "📅 Son 30 Gün" },
  { key: "thisweek", label: "📆 Bu Hafta" },
  { key: "bestofyear", label: "🏆 Yılın En İyileri" },

  { key: "alltop", label: "👑 All Time Top" },
];

function selectCategory(key: string) {
  gamesStore.fetchGames(key as any);
  filterStore.resetFilters();
}

const loadedCount = ref(0);
const allLoaded = computed(
  () => loadedCount.value >= filteredGames.value.length,
);

function handleCardLoaded() {
  loadedCount.value++;
}

// Filtreler değişince sıfırla
watch(filteredGames, () => {
  loadedCount.value = 0;
});
</script>

<template>
  <main class="max-w-7xl mx-auto px-6">
    <h1 class="text-2xl font-bold my-6 text-gray-800 dark:text-white">
      🎮 Oyun Listesi
    </h1>

    <!-- Kategoriler -->
    <div class="flex flex-wrap gap-2 mb-4">
      <button
        v-for="cat in categories"
        :key="cat.key"
        @click="selectCategory(cat.key)"
        class="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200"
        :class="
          gamesStore.currentCategory === cat.key
            ? 'text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        "
        :style="
          gamesStore.currentCategory === cat.key
            ? 'background-color: #593b8b'
            : ''
        "
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Filtreler -->
    <div class="flex flex-wrap gap-3 my-4">
      <!-- Genre -->
      <select
        v-model="filterStore.selectedGenre"
        class="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        <option value="">Tüm Türler</option>
        <option v-for="genre in genres" :key="genre.id" :value="genre.name">
          {{ genre.name }}
        </option>
      </select>

      <!-- Platform -->
      <select
        v-model="filterStore.selectedPlatform"
        class="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        <option value="">Tüm Platformlar</option>
        <option
          v-for="platform in platforms"
          :key="platform.id"
          :value="platform.name"
        >
          {{ platform.name }}
        </option>
      </select>

      <!-- Sıralama -->
      <select
        v-model="filterStore.ordering"
        class="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        <option value="">Varsayılan Sıralama</option>
        <option value="-rating">⭐ En Yüksek Puan</option>
        <option value="rating">⭐ En Düşük Puan</option>
        <option value="-released">📅 En Yeni</option>
        <option value="released">📅 En Eski</option>
        <option value="name">🔤 A-Z</option>
        <option value="-name">🔤 Z-A</option>
      </select>

      <!-- Min Rating -->
      <select
        v-model="filterStore.minRating"
        class="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        <option :value="0">Tüm Puanlar</option>
        <option :value="3">3+ ⭐</option>
        <option :value="4">4+ ⭐</option>
        <option :value="4.5">4.5+ ⭐</option>
      </select>

      <!-- Filtreleri Sıfırla -->
      <button
        v-if="filterStore.hasFilter"
        @click="filterStore.resetFilters()"
        class="text-sm text-red-500 hover:text-red-700 px-3 py-2"
      >
        ✕ Sıfırla
      </button>
    </div>

    <!-- Skeleton -->
    <div
      v-if="pending"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <GameCardSkeleton v-for="n in 10" :key="n" />
    </div>

    <!-- Hata -->
    <div v-else-if="error" class="text-center mt-20">
      <p class="text-4xl mb-4">😢</p>
      <p class="text-gray-600">Bir hata oluştu: {{ error }}</p>
    </div>

    <!-- Skeleton -->
    <div
      v-if="pending"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <GameCardSkeleton v-for="n in 10" :key="n" />
    </div>

    <!-- Hata -->
    <div v-else-if="error" class="text-center mt-20">
      <p class="text-4xl mb-4">😢</p>
      <p class="text-gray-600">Bir hata oluştu: {{ error }}</p>
    </div>

    <!-- Oyunlar -->
    <div
      v-else-if="filteredGames.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6"
    >
      <GameCard v-for="game in filteredGames" :key="game.id" :game="game" />
    </div>

    <!-- Daha Fazla Yükle -->
    <div v-if="gamesStore.hasMore" class="flex justify-center mt-8">
      <AppButton
        @click="gamesStore.loadMore()"
        :disabled="gamesStore.pendingMore"
        variant="outline"
        size="lg"
      >
        {{ gamesStore.pendingMore ? "Yükleniyor..." : "Daha Fazla Yükle" }}
      </AppButton>
    </div>

    <!-- Boş -->
    <p v-else class="text-center text-gray-500 mt-20">Hiç oyun bulunamadı 😢</p>
  </main>
</template>
