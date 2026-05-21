<script setup lang="ts">
const supabase = useSupabaseClient();
const router = useRouter();

const email = ref("");
const password = ref("");
const error = ref("");
const pending = ref(false);

async function login() {
  pending.value = true;
  error.value = "";

  const { error: err } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (err) {
    error.value = err.message;
  } else {
    router.push("/");
  }

  pending.value = false;
}
</script>

<template>
  <main
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 w-full max-w-md"
    >
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Giriş Yap
      </h1>

      <!-- Hata -->
      <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

      <div class="flex flex-col gap-4">
        <input
          v-model="email"
          type="email"
          placeholder="E-posta"
          class="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Şifre"
          class="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <AppButton @click="login" :disabled="pending" size="lg">
          {{ pending ? "Giriş yapılıyor..." : "Giriş Yap" }}
        </AppButton>
      </div>

      <p class="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
        Hesabın yok mu?
        <NuxtLink to="/register" class="text-purple-600 hover:underline"
          >Kayıt ol</NuxtLink
        >
      </p>
    </div>
  </main>
</template>
