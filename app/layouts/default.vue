<script setup lang="ts">
const searchStore = useSearchStore();
const wishlistStore = useWishlistStore();
const { isDark, toggleTheme } = useTheme();
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const router = useRouter();
const username = ref<string | null>(null);
const isMenuOpen = ref(false);
const isReady = ref(false);
const searchFocused = ref(false);

onMounted(async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user?.id) {
    wishlistStore.setUserId(session.user.id);
    const { data } = await (supabase as any)
      .from("profiles")
      .select("username")
      .eq("id", session.user.id)
      .single();
    username.value = data?.username ?? null;
    await wishlistStore.fetchWishlist(session.user.id);
  } else {
    wishlistStore.setUserId(null);
  }

  isReady.value = true;

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN" && session?.user?.id) {
      wishlistStore.setUserId(session.user.id);
      const { data } = await (supabase as any)
        .from("profiles")
        .select("username")
        .eq("id", session.user.id)
        .single();
      username.value = data?.username ?? null;
      await wishlistStore.fetchWishlist(session.user.id);
    } else if (event === "SIGNED_OUT") {
      username.value = null;
      wishlistStore.clearWishlist();
    }
  });
});

async function logout() {
  await supabase.auth.signOut();
  router.push("/login");
}
</script>

<template>
  <div
    class="min-h-screen transition-colors duration-500"
    :class="isDark ? 'bg-[#0a0e1a]' : 'bg-[#f4f3f0]'"
  >
    <!-- Scanline overlay — sadece dark modda -->
    <div
      v-if="isDark"
      class="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
      style="
        background-image: repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(255, 255, 255, 0.8) 2px,
          rgba(255, 255, 255, 0.8) 4px
        );
      "
    ></div>

    <!-- Loading -->
    <div
      v-if="!isReady"
      class="min-h-screen flex items-center justify-center relative z-10"
    >
      <div class="flex flex-col items-center gap-4">
        <div
          class="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"
        ></div>
        <p class="text-amber-400 text-xs tracking-[0.3em] uppercase font-mono">
          Initializing...
        </p>
      </div>
    </div>

    <template v-else>
      <!-- Navbar -->
      <header
        class="sticky top-0 z-50 border-b"
        :class="
          isDark
            ? 'bg-[#0a0e1a]/90 border-amber-400/10 backdrop-blur-xl'
            : 'bg-white/90 border-gray-200 backdrop-blur-xl'
        "
      >
        <nav class="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
          <!-- Logo -->
          <NuxtLink to="/" class="shrink-0 group">
            <span
              class="font-black text-xl tracking-wider uppercase font-display"
              :class="isDark ? 'text-white' : 'text-gray-900'"
            >
              GAME<span
                class="text-amber-400 group-hover:text-amber-300 transition-colors"
                style="text-shadow: 0 0 20px rgba(251, 191, 36, 0.5)"
                >GIST</span
              >
            </span>
          </NuxtLink>

          <!-- Search -->
          <div class="flex-1 max-w-md relative">
            <div
              class="absolute inset-y-0 left-3 flex items-center pointer-events-none"
            >
              <svg
                class="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              v-model="searchStore.searchQuery"
              type="text"
              placeholder="Search games..."
              @focus="searchFocused = true"
              @blur="searchFocused = false"
              class="w-full pl-10 pr-4 py-2 text-sm rounded-lg outline-none transition-all duration-200 font-mono"
              :class="
                isDark
                  ? searchFocused
                    ? 'bg-[#1a1f35] border border-amber-400/50 text-white placeholder-gray-500 shadow-[0_0_15px_rgba(251,191,36,0.1)]'
                    : 'bg-[#1a1f35] border border-white/5 text-white placeholder-gray-500 hover:border-white/10'
                  : searchFocused
                    ? 'bg-white border border-amber-400 text-gray-900 placeholder-gray-400 shadow-sm'
                    : 'bg-gray-100 border border-transparent text-gray-900 placeholder-gray-400 hover:bg-gray-200'
              "
            />
          </div>

          <!-- Sağ butonlar -->
          <div class="hidden md:flex items-center gap-2 ml-auto">
            <!-- Dark mode toggle -->
            <button
              @click="toggleTheme"
              class="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200"
              :class="
                isDark
                  ? 'text-gray-400 hover:text-amber-400 hover:bg-amber-400/10'
                  : 'text-gray-500 hover:text-amber-500 hover:bg-amber-50'
              "
            >
              <svg
                v-if="isDark"
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <svg
                v-else
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </button>

            <template v-if="user">
              <!-- Wishlist -->
              <NuxtLink
                to="/wishlist"
                class="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 relative"
                :class="
                  isDark
                    ? 'text-gray-400 hover:text-amber-400 hover:bg-amber-400/10'
                    : 'text-gray-500 hover:text-amber-500 hover:bg-amber-50'
                "
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span
                  v-if="wishlistStore.total > 0"
                  class="absolute -top-1 -right-1 bg-amber-400 text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                >
                  {{ wishlistStore.total }}
                </span>
              </NuxtLink>

              <!-- Kullanıcı -->
              <NuxtLink
                :to="`/profile/${username}`"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200"
                :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'"
              >
                <div
                  class="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center text-black text-xs font-black"
                >
                  {{ username?.charAt(0).toUpperCase() || "?" }}
                </div>
                <span
                  class="text-sm font-medium"
                  :class="isDark ? 'text-gray-300' : 'text-gray-700'"
                >
                  {{ username || user.email }}
                </span>
              </NuxtLink>

              <!-- Çıkış -->
              <button
                @click="logout"
                class="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </template>

            <template v-else>
              <NuxtLink
                to="/login"
                class="px-4 py-2 text-sm transition-colors duration-200"
                :class="
                  isDark
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                "
              >
                Giriş Yap
              </NuxtLink>
              <NuxtLink
                to="/register"
                class="px-4 py-2 text-sm font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-amber-400/25 tracking-wide uppercase font-display"
              >
                Kayıt Ol
              </NuxtLink>
            </template>
          </div>

          <!-- Mobil hamburger -->
          <button
            @click="isMenuOpen = true"
            class="md:hidden ml-auto w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200"
            :class="
              isDark
                ? 'text-gray-400 hover:text-amber-400 hover:bg-amber-400/10'
                : 'text-gray-500 hover:bg-gray-100'
            "
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </nav>
      </header>

      <!-- Sayfa içeriği -->
      <main class="py-6 relative z-10">
        <slot />
      </main>

      <!-- Karartma -->
      <div
        v-if="isMenuOpen"
        @click="isMenuOpen = false"
        class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden"
      />

      <!-- Drawer -->
      <div
        class="fixed top-0 right-0 h-full w-72 z-50 md:hidden transform transition-transform duration-300 ease-out border-l border-amber-400/10"
        :class="isMenuOpen ? 'translate-x-0' : 'translate-x-full'"
        style="background: #0a0e1a"
      >
        <div
          class="flex items-center justify-between px-6 py-5 border-b border-amber-400/10"
        >
          <span
            class="font-black text-white tracking-wider uppercase font-display"
          >
            GAME<span class="text-amber-400">GIST</span>
          </span>
          <button
            @click="isMenuOpen = false"
            class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 transition-all"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="px-4 py-6 flex flex-col gap-1">
          <button
            @click="toggleTheme"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 transition-all text-sm font-mono"
          >
            <span>{{ isDark ? "☀️" : "🌙" }}</span>
            {{ isDark ? "Light Mode" : "Dark Mode" }}
          </button>

          <template v-if="user">
            <NuxtLink
              to="/wishlist"
              class="flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 transition-all text-sm"
              @click="isMenuOpen = false"
            >
              <span>Wishlist</span>
              <span
                v-if="wishlistStore.total > 0"
                class="bg-amber-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
              >
                {{ wishlistStore.total }}
              </span>
            </NuxtLink>
            <NuxtLink
              v-if="username"
              :to="`/profile/${username}`"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 transition-all text-sm"
              @click="isMenuOpen = false"
            >
              <div
                class="w-6 h-6 rounded-md bg-amber-400 flex items-center justify-center text-black text-xs font-black"
              >
                {{ username?.charAt(0).toUpperCase() }}
              </div>
              {{ username }}
            </NuxtLink>
            <button
              @click="logout"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-sm text-left"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Çıkış Yap
            </button>
          </template>

          <template v-else>
            <NuxtLink
              to="/login"
              class="flex items-center px-3 py-2.5 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-amber-400/10 transition-all text-sm"
              @click="isMenuOpen = false"
            >
              Giriş Yap
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="flex items-center px-3 py-2.5 rounded-lg text-black bg-amber-400 hover:bg-amber-300 transition-all text-sm font-bold uppercase font-display tracking-wide"
              @click="isMenuOpen = false"
            >
              Kayıt Ol
            </NuxtLink>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap");

* {
  font-family: "DM Sans", sans-serif;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
