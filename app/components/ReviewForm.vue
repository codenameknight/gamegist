<script setup lang="ts">
const props = defineProps<{
  gameId: number;
  gameName: string;
}>();

const emit = defineEmits<{
  submitted: [];
}>();

const supabase = useSupabaseClient();
const wishlistStore = useWishlistStore();

const rating = ref(0);
const comment = ref("");
const pending = ref(false);
const error = ref("");

async function submitReview() {
  if (rating.value === 0) {
    error.value = "Lütfen bir puan ver!";
    return;
  }

  if (!wishlistStore.currentUserId) {
    error.value = "Giriş yapman gerekiyor!";
    return;
  }

  pending.value = true;
  error.value = "";

  const { data, error: err } = await (supabase as any).from("reviews").upsert(
    {
      user_id: wishlistStore.currentUserId,
      game_id: props.gameId,
      game_name: props.gameName,
      rating: rating.value,
      comment: comment.value,
    },
    { onConflict: "user_id, game_id" },
  );

  if (!err) {
    rating.value = 0;
    comment.value = "";
    emit("submitted"); // direkt emit et, bekleme yok
  }

  pending.value = false;
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
    <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">
      ✍️ Yorum Yaz
    </h3>

    <p v-if="error" class="text-red-500 text-sm mb-3">{{ error }}</p>

    <div class="flex flex-col gap-4">
      <!-- Yıldız -->
      <div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Puanın:</p>
        <StarRating v-model="rating" />
      </div>

      <!-- Yorum -->
      <textarea
        v-model="comment"
        placeholder="Yorumunu yaz... (opsiyonel)"
        rows="3"
        class="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
      />

      <AppButton @click="submitReview" :disabled="pending">
        {{ pending ? "Gönderiliyor..." : "Gönder" }}
      </AppButton>
    </div>
  </div>
</template>
