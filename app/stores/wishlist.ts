import type { Game } from "~/types/game";

export const useWishlistStore = defineStore("wishlist", () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const items = ref<Game[]>([]);
  const pending = ref(false);
  const currentUserId = ref<string | null>(null);

  function setUserId(id: string | null) {
    currentUserId.value = id;
  }

  // Kullanıcı giriş yapınca wishlist'i Supabase'den çek
  async function fetchWishlist(userId: string) {
    pending.value = true;
    const { data } = await (supabase as any)
      .from("wishlists")
      .select("*")
      .eq("user_id", userId);

    if (data) {
      items.value = data.map((item: any) => ({
        id: item.game_id,
        name: item.game_name,
        background_image: item.game_image,
        rating: item.game_rating,
        genres: [],
        platforms: [],
      }));
    }
    pending.value = false;
  }

  // Wishlist'e ekle
  async function addGame(game: Game, userId: string) {
    const { error } = await (supabase as any).from("wishlists").insert({
      user_id: userId,
      game_id: game.id,
      game_name: game.name,
      game_image: game.background_image,
      game_rating: game.rating,
    });

    if (!error) items.value.push(game);
  }

  // Wishlist'ten çıkar
  async function removeGame(gameId: number, userId: string) {
    const { error } = await (supabase as any)
      .from("wishlists")
      .delete()
      .eq("user_id", userId)
      .eq("game_id", gameId);

    items.value = items.value.filter((g) => g.id !== gameId);
  }

  // Toggle
  async function toggleGame(game: Game, userId: string) {
    if (isInWishlist.value(game.id)) {
      await removeGame(game.id, userId);
    } else {
      await addGame(game, userId);
    }
  }

  function clearWishlist() {
    items.value = [];
  }

  // Getter
  const isInWishlist = computed(
    () => (gameId: number) => items.value.some((g) => g.id === gameId),
  );

  const total = computed(() => items.value.length);

  return {
    items,
    pending,
    fetchWishlist,
    addGame,
    removeGame,
    toggleGame,
    isInWishlist,
    total,
    clearWishlist,
    setUserId,
    currentUserId,
  };
});
