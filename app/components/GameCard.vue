<script setup lang="ts">
import { useWishlistStore } from "~/stores/wishlist";
import type { Game } from "~/types/game";

const props = defineProps<{
  game: Game;
  userId?: string;
}>();

const wishlistStore = useWishlistStore();
const user = useSupabaseUser();
const router = useRouter();
const isAnimating = ref(false);

function handleWishlist(game: any) {
  if (!wishlistStore.currentUserId) {
    router.push("/login");
    return;
  }
  wishlistStore.toggleGame(game, wishlistStore.currentUserId);
}

const imageLoaded = ref(false);
</script>

<template>
  <div class="flex justify-center">
    <div
      class="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-200 w-full max-w-xs flex flex-col"
    >
      <!-- Wishlist butonu -->
      <button
        @click="handleWishlist(game)"
        class="absolute top-2 right-2 z-10 bg-white dark:bg-gray-700 rounded-full p-1.5 shadow"
        :class="isAnimating ? 'scale-125' : 'scale-100'"
        style="transition: transform 0.2s cubic-bezier(0.17, 0.89, 0.32, 1.49)"
      >
        {{ wishlistStore.isInWishlist(game.id) ? "❤️" : "🤍" }}
      </button>

      <NuxtLink :to="`/games/${game.id}`" class="flex flex-col h-full">
        <!-- Resim -->
        <div class="w-full h-44 shrink-0 relative bg-gray-200 dark:bg-gray-700">
          <img
            :src="game.background_image"
            :alt="game.name"
            loading="lazy"
            class="w-full h-full object-cover object-top transition-opacity duration-500"
            :class="imageLoaded ? 'opacity-100' : 'opacity-0'"
            @load="imageLoaded = true"
          />
          <div
            v-if="!imageLoaded"
            class="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"
          />
        </div>

        <!-- İçerik -->
        <div class="p-4 flex flex-col justify-between flex-1">
          <h2
            class="text-base font-bold text-gray-800 dark:text-white mb-2 line-clamp-1"
          >
            {{ game.name }}
          </h2>
          <div>
            <p class="text-sm text-yellow-500">⭐ {{ game.rating }}</p>
            <p
              class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1"
            >
              🎮 {{ game.genres?.map((g) => g.name).join(", ") }}
            </p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
