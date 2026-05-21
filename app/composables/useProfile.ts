export function useProfile() {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const profile = ref<{
    username: string | null;
    avatar_url: string | null;
  } | null>(null);

  async function fetchProfile(userId: string) {
    const { data } = await (supabase as any)
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", userId)
      .single();

    profile.value = data;
  }

  // Client tarafında çalış
  onMounted(async () => {
    if (user.value?.id) {
      await fetchProfile(user.value.id);
    }
  });

  // Kullanıcı değişince tekrar çek
  watch(user, (newUser) => {
    if (newUser?.id) {
      fetchProfile(newUser.id);
    } else {
      profile.value = null;
    }
  });

  return { profile, fetchProfile };
}
