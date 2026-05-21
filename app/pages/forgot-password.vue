<script setup lang="ts">
const supabase = useSupabaseClient();
const email = ref("");
const pending = ref(false);
const sent = ref(false);
const error = ref("");

async function sendResetEmail() {
  pending.value = true;
  error.value = "";

  const { error: err } = await supabase.auth.resetPasswordForEmail(
    email.value,
    {
      redirectTo: `${window.location.origin}/reset-password`,
    },
  );

  if (err) {
    error.value = err.message;
  } else {
    sent.value = true;
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
      <!-- Gönderildi -->
      <div v-if="sent" class="text-center">
        <p class="text-5xl mb-4">📧</p>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Email gönderildi!
        </h1>
        <p class="text-gray-500 text-sm mb-6">
          Şifre sıfırlama linki email adresine gönderildi.
        </p>
        <NuxtLink to="/login" class="text-purple-600 hover:underline text-sm"
          >Giriş yap →</NuxtLink
        >
      </div>

      <!-- Form -->
      <div v-else>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Şifremi Unuttum
        </h1>
        <p class="text-gray-500 text-sm mb-6">
          Email adresini gir, sana sıfırlama linki gönderelim.
        </p>

        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

        <div class="flex flex-col gap-4">
          <input
            v-model="email"
            type="email"
            placeholder="E-posta"
            class="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <AppButton @click="sendResetEmail" :disabled="pending" size="lg">
            {{ pending ? "Gönderiliyor..." : "Sıfırlama Linki Gönder" }}
          </AppButton>
        </div>

        <p class="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
          <NuxtLink to="/login" class="text-purple-600 hover:underline"
            >← Giriş yap</NuxtLink
          >
        </p>
      </div>
    </div>
  </main>
</template>
