<script setup lang="ts">
const route = useRoute();
const username = route.params.username as string;
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const wishlistStore = useWishlistStore();

interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  twitter: string | null;
  steam: string | null;
  discord: string | null;
}

interface Review {
  id: number;
  game_id: number;
  game_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

const profile = ref<Profile | null>(null);
const reviews = ref<Review[]>([]);
const wishlistCount = ref(0);
const pending = ref(true);
const isEditing = ref(false);
const uploadPending = ref(false);
const savePending = ref(false);

// Düzenleme formu
const editForm = ref({
  username: "",
  bio: "",
  twitter: "",
  steam: "",
  discord: "",
});

const isOwner = computed(
  () => wishlistStore.currentUserId === profile.value?.id,
);

onMounted(async () => {
  const { data: profileData } = await (supabase as any)
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  profile.value = profileData;

  if (profileData?.id) {
    const { data: reviewData } = await (supabase as any)
      .from("reviews")
      .select("*")
      .eq("user_id", profileData.id)
      .order("created_at", { ascending: false });

    reviews.value = reviewData ?? [];

    const { count } = await (supabase as any)
      .from("wishlists")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profileData.id);

    wishlistCount.value = count ?? 0;
  }

  pending.value = false;
});

function startEdit() {
  editForm.value = {
    username: profile.value?.username ?? "",
    bio: profile.value?.bio ?? "",
    twitter: profile.value?.twitter ?? "",
    steam: profile.value?.steam ?? "",
    discord: profile.value?.discord ?? "",
  };
  isEditing.value = true;
}

async function saveProfile() {
  if (!profile.value?.id) return;
  savePending.value = true;

  try {
    await (supabase as any)
      .from("profiles")
      .update({
        username: editForm.value.username,
        bio: editForm.value.bio,
        twitter: editForm.value.twitter,
        steam: editForm.value.steam,
        discord: editForm.value.discord,
      })
      .eq("id", profile.value.id);

    profile.value = { ...profile.value, ...editForm.value };
    isEditing.value = false;
  } catch (e) {
    console.error("Kayıt hatası:", e);
  } finally {
    savePending.value = false;
  }
}

async function uploadAvatar(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length || !profile.value?.id) return;

  const file = input.files[0];
  if (!file) return; // ✅ ekle

  uploadPending.value = true;
  const ext = file.name.split(".").pop() ?? "jpg"; // ✅ ?? 'jpg' ekle
  const path = `${profile.value.id}/avatar.${ext}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });

  if (!error) {
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    await (supabase as any)
      .from("profiles")
      .update({ avatar_url: data.publicUrl })
      .eq("id", profile.value.id);

    profile.value.avatar_url = data.publicUrl;
  }

  uploadPending.value = false;
}
</script>

<template>
  <main class="max-w-4xl mx-auto px-6 py-8">
    <p v-if="pending" class="text-gray-400 animate-pulse text-center mt-20">
      Yükleniyor...
    </p>

    <div v-else-if="!profile" class="text-center mt-20">
      <p class="text-5xl mb-4">😢</p>
      <p class="text-gray-500">Kullanıcı bulunamadı.</p>
    </div>

    <div v-else>
      <!-- Profil başlığı -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-sm">
        <div class="flex flex-col sm:flex-row items-start gap-6">
          <!-- Avatar -->
          <div class="relative group">
            <div
              class="w-24 h-24 rounded-2xl overflow-hidden bg-amber-400 flex items-center justify-center text-black text-3xl font-black shrink-0"
            >
              <img
                v-if="profile.avatar_url"
                :src="profile.avatar_url"
                class="w-full h-full object-cover"
              />
              <span v-else>{{
                profile.username?.charAt(0).toUpperCase()
              }}</span>
            </div>

            <!-- Avatar yükleme — sadece owner -->
            <label
              v-if="isOwner"
              class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <span v-if="uploadPending" class="text-white text-xs">⏳</span>
              <span v-else class="text-white text-xs font-medium">📷</span>
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="uploadAvatar"
              />
            </label>
          </div>

          <!-- Bilgiler -->
          <div class="flex-1">
            <template v-if="isEditing">
              <!-- Düzenleme formu -->
              <div class="flex flex-col gap-3">
                <input
                  v-model="editForm.username"
                  placeholder="Kullanıcı adı"
                  class="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <textarea
                  v-model="editForm.bio"
                  placeholder="Bio..."
                  rows="2"
                  class="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                />
                <div class="grid grid-cols-3 gap-2">
                  <input
                    v-model="editForm.twitter"
                    placeholder="Twitter/X"
                    class="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <input
                    v-model="editForm.steam"
                    placeholder="Steam"
                    class="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <input
                    v-model="editForm.discord"
                    placeholder="Discord"
                    class="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div class="flex gap-2">
                  <AppButton
                    size="sm"
                    @click="saveProfile"
                    :disabled="savePending"
                  >
                    {{ savePending ? "Kaydediliyor..." : "Kaydet" }}
                  </AppButton>
                  <AppButton
                    size="sm"
                    variant="outline"
                    @click="isEditing = false"
                    >İptal</AppButton
                  >
                </div>
              </div>
            </template>

            <template v-else>
              <div class="flex items-start justify-between">
                <div>
                  <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
                    {{ profile.username }}
                  </h1>
                  <p
                    v-if="profile.bio"
                    class="text-gray-500 dark:text-gray-400 text-sm mt-1"
                  >
                    {{ profile.bio }}
                  </p>
                  <div class="flex gap-4 mt-3">
                    <span class="text-sm text-gray-500 dark:text-gray-400"
                      >🎮 {{ reviews.length }} yorum</span
                    >
                    <span class="text-sm text-gray-500 dark:text-gray-400"
                      >🤍 {{ wishlistCount }} wishlist</span
                    >
                  </div>

                  <!-- Sosyal linkler -->
                  <div class="flex gap-3 mt-3">
                    <a
                      v-if="profile.twitter"
                      :href="`https://twitter.com/${profile.twitter}`"
                      target="_blank"
                      class="text-xs text-blue-400 hover:underline"
                      >𝕏 {{ profile.twitter }}</a
                    >
                    <a
                      v-if="profile.steam"
                      :href="`https://steamcommunity.com/id/${profile.steam}`"
                      target="_blank"
                      class="text-xs text-gray-400 hover:underline"
                      >Steam</a
                    >
                    <span v-if="profile.discord" class="text-xs text-indigo-400"
                      >Discord: {{ profile.discord }}</span
                    >
                  </div>
                </div>

                <!-- Düzenle butonu — sadece owner -->
                <AppButton
                  v-if="isOwner"
                  size="sm"
                  variant="outline"
                  @click="startEdit"
                >
                  ✏️ Düzenle
                </AppButton>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Reviewlar -->
      <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
        Yorumları
      </h2>

      <p v-if="reviews.length === 0" class="text-gray-500 text-sm">
        Henüz yorum yapmamış.
      </p>

      <div v-else class="flex flex-col gap-4">
        <NuxtLink
          v-for="review in reviews"
          :key="review.id"
          :to="`/games/${review.game_id}`"
          class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-medium text-gray-800 dark:text-white">
              {{ review.game_name }}
            </h3>
            <span class="text-xs text-gray-400">{{
              new Date(review.created_at).toLocaleDateString("tr-TR")
            }}</span>
          </div>
          <StarRating :modelValue="review.rating" :readonly="true" />
          <p
            v-if="review.comment"
            class="text-sm text-gray-600 dark:text-gray-300 mt-2"
          >
            {{ review.comment }}
          </p>
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
