<script setup lang="ts">
const props = defineProps<{
  gameId: number;
}>();

const supabase = useSupabaseClient();
const wishlistStore = useWishlistStore();

interface Review {
  id: number;
  user_id: string;
  game_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  } | null;
}

const reviews = ref<Review[]>([]);
const pending = ref(false);
const editingId = ref<number | null>(null);
const editComment = ref("");
const editRating = ref(0);

const averageRating = computed(() => {
  if (reviews.value.length === 0) return null;
  const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0);
  return (sum / reviews.value.length).toFixed(1);
});

async function fetchReviews() {
  pending.value = true;

  const { data, error } = await (supabase as any)
    .from("reviews")
    .select("*, profiles(username, avatar_url)")
    .eq("game_id", props.gameId)
    .order("created_at", { ascending: false });

  reviews.value = [...(data ?? [])];
  pending.value = false;
}

async function deleteReview(reviewId: number) {
  await (supabase as any).from("reviews").delete().eq("id", reviewId);

  await fetchReviews();
}

function startEdit(review: Review) {
  editingId.value = review.id;
  editComment.value = review.comment ?? "";
  editRating.value = review.rating;
}

async function saveEdit(reviewId: number) {
  const updatedComment = editComment.value;
  const updatedRating = editRating.value;

  await (supabase as any)
    .from("reviews")
    .update({ comment: updatedComment, rating: updatedRating })
    .eq("id", reviewId);

  editingId.value = null;
  editComment.value = "";
  editRating.value = 0;

  await fetchReviews();
}

// Sayfa açılınca bekle, sonra çek
onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  await fetchReviews();
});
// Sayfa her göründüğünde tekrar çek
onActivated(() => {
  fetchReviews();
});

defineExpose({ fetchReviews, averageRating });
</script>

<template>
  <div class="mt-8">
    <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
      💬 Yorumlar ({{ reviews.length }})
    </h2>

    <p v-if="pending" class="text-gray-400 animate-pulse">Yükleniyor...</p>

    <template v-else>
      <p v-if="reviews.length === 0" class="text-gray-500 text-sm">
        Henüz yorum yapılmamış. İlk yorumu sen yap!
      </p>

      <div v-else class="flex flex-col gap-4">
        <div
          v-for="review in reviews"
          :key="`${review.id}-${review.rating}-${review.comment}`"
          class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
        >
          <!-- Üst kısım: kullanıcı adı + tarih -->
          <div class="flex items-center justify-between mb-2">
            <NuxtLink
              :to="`/profile/${review.profiles?.username}`"
              class="text-sm font-medium text-purple-600 hover:underline"
            >
              👤 {{ review.profiles?.username || "Anonim" }}
            </NuxtLink>
            <span class="text-xs text-gray-400">
              {{ new Date(review.created_at).toLocaleDateString("tr-TR") }}
            </span>
          </div>

          <!-- Düzenleme modu -->
          <template v-if="editingId === review.id">
            <StarRating v-model="editRating" class="mb-2" />
            <textarea
              v-model="editComment"
              rows="2"
              class="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none mb-2"
            />
            <div class="flex gap-2">
              <AppButton size="sm" @click="saveEdit(review.id)"
                >Kaydet</AppButton
              >
              <AppButton size="sm" variant="outline" @click="editingId = null"
                >İptal</AppButton
              >
            </div>
          </template>

          <!-- Normal mod -->
          <template v-else>
            <StarRating
              :modelValue="review.rating"
              :readonly="true"
              class="mb-2"
            />
            <p
              v-if="review.comment"
              class="text-sm text-gray-600 dark:text-gray-300"
            >
              {{ review.comment }}
            </p>

            <!-- Sadece kendi yorumunda göster -->
            <div
              v-if="review.user_id === wishlistStore.currentUserId"
              class="flex gap-2 mt-3"
            >
              <AppButton size="sm" variant="outline" @click="startEdit(review)">
                ✏️ Düzenle
              </AppButton>
              <AppButton
                size="sm"
                variant="ghost"
                @click="deleteReview(review.id)"
              >
                🗑️ Sil
              </AppButton>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>
