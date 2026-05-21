<script setup lang="ts">
const supabase = useSupabaseClient();
const router = useRouter();

const password = ref("");
const confirmPassword = ref("");
const pending = ref(false);
const error = ref("");

async function resetPassword() {
  if (password.value !== confirmPassword.value) {
    error.value = "Şifreler eşleşmiyor!";
    return;
  }

  if (password.value.length < 6) {
    error.value = "Şifre en az 6 karakter olmalı!";
    return;
  }

  pending.value = true;
  error.value = "";

  const { error: err } = await supabase.auth.updateUser({
    password: password.value,
  });

  if (err) {
    error.value = err.message;
  } else {
    router.push("/login");
  }

  pending.value = false;
}
</script>

<template>
  <main
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-6"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 w-full max-w-md"
    >
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        Yeni Şifre
      </h1>
      <p class="text-gray-500 text-sm mb-6">Yeni şifreni belirle.</p>

      <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

      <div class="flex flex-col gap-4">
        <input
          v-model="password"
          type="password"
          placeholder="Yeni şifre"
          class="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Şifreyi tekrarla"
          class="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <AppButton @click="resetPassword" :disabled="pending" size="lg">
          {{ pending ? "Kaydediliyor..." : "Şifremi Sıfırla" }}
        </AppButton>
      </div>
    </div>
  </main>
</template>
