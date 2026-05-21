<script setup lang="ts">
import type { Game } from "~/types/game";

const route = useRoute();
const id = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

const config = useRuntimeConfig();
const apiKey = config.public.rawgKey;

const {
  data: game,
  pending,
  error,
} = useFetch<Game>(`https://api.rawg.io/api/games/${id}?key=${apiKey}`);

const wishlistStore = useWishlistStore();

// ReviewList component'ine ref
const reviewListRef = ref();

const averageRating = computed(
  () => reviewListRef.value?.averageRating ?? null,
);

async function onReviewSubmitted() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  reviewListRef.value?.fetchReviews();
}
</script>

<template>
  <main class="max-w-5xl mx-auto px-6 py-8">
    <NuxtLink
      to="/"
      class="inline-flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 mb-6 group"
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
      <span class="group-hover:-translate-x-1 transition-transform duration-200"
        >←</span
      >
      Geri Dön
    </NuxtLink>

    <!-- Yükleniyor -->
    <p v-if="pending" class="text-center mt-20 text-gray-500">Yükleniyor...</p>

    <!-- Hata -->
    <div v-else-if="error" class="text-center mt-20">
      <p class="text-4xl mb-4">😢</p>
      <p class="text-gray-600">Bir hata oluştu: {{ error.message }}</p>
    </div>

    <!-- İçerik -->
    <div v-else-if="game" class="mt-6">
      <!-- Üst kısım: resim + bilgiler -->
      <div class="flex flex-col md:flex-row gap-8">
        <img
          :src="game.background_image"
          :alt="game.name"
          class="w-full md:w-96 h-64 object-cover rounded-xl shadow-md"
        />
        <div class="flex flex-col justify-center gap-4">
          <h1 class="text-3xl font-bold text-gray-800 dark:text-white">
            {{ game.name }}
          </h1>
          <p class="text-yellow-500 text-lg">
            ⭐ {{ game.rating }} / 5
            <span class="text-gray-400 text-sm">(RAWG)</span>
          </p>
          <p v-if="averageRating" class="text-purple-500 text-lg">
            🎮 {{ averageRating }} / 5
            <span class="text-gray-400 text-sm">(GameHub)</span>
          </p>
          <div class="flex flex-wrap gap-2">
            <AppBadge v-for="genre in game.genres" :key="genre.id">
              {{ genre.name }}
            </AppBadge>
          </div>
          <div class="flex flex-wrap gap-2">
            <AppBadge
              v-for="p in game.platforms"
              :key="p.platform.id"
              variant="gray"
            >
              {{ p.platform.name }}
            </AppBadge>
          </div>
        </div>
      </div>

      <!-- Açıklama -->
      <div class="mt-8">
        <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
          Hakkında
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
          {{ game.description_raw }}
        </p>
      </div>

      <!-- Review formu — sadece giriş yapanlara göster -->
      <div class="mt-8">
        <ReviewForm
          v-if="wishlistStore.currentUserId"
          :gameId="game.id"
          :gameName="game.name"
          @submitted="onReviewSubmitted"
        />
        <p v-else class="text-gray-500 text-sm">
          Yorum yapmak için
          <NuxtLink to="/login" class="text-purple-600 hover:underline"
            >giriş yap</NuxtLink
          >.
        </p>
      </div>

      <!-- Review listesi -->
      <ReviewList ref="reviewListRef" :gameId="game.id" />
    </div>
  </main>
</template>
