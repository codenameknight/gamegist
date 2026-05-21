import type { Game } from "~/types/game";

type Category =
  | "popular"
  | "last30days"
  | "thisweek"
  | "bestofyear"
  | "alltop"
  | "search";

export const useGamesStore = defineStore("games", () => {
  const config = useRuntimeConfig();
  const apiKey = config.public.rawgKey;

  const games = ref<Game[]>([]);
  const pending = ref(false);
  const pendingMore = ref(false);
  const error = ref<string | null>(null);
  const currentCategory = ref<Category>("popular");
  const nextPage = ref<string | null>(null);
  const hasMore = computed(() => nextPage.value !== null);

  function getCategoryParams(category: Category): string {
    const today = new Date();
    const format = (d: Date) => d.toISOString().split("T")[0];

    switch (category) {
      case "last30days": {
        const last30 = new Date(today);
        last30.setDate(today.getDate() - 30);
        return `dates=${format(last30)},${format(today)}&ordering=-added`;
      }
      case "thisweek": {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `dates=${format(weekStart)},${format(weekEnd)}&ordering=-added`;
      }
      case "bestofyear": {
        const year = today.getFullYear();
        return `dates=${year}-01-01,${year}-12-31&ordering=-added`;
      }
      case "alltop":
        return `ordering=-rating&metacritic=90,100`;
      case "popular":
      default:
        return `ordering=-added`;
    }
  }

  // İlk yükleme
  async function fetchGames(
    category: Category = "popular",
    searchQuery?: string,
  ) {
    pending.value = true;
    error.value = null;
    currentCategory.value = category;
    games.value = [];
    nextPage.value = null;

    try {
      let url = `https://api.rawg.io/api/games?key=${apiKey}&page_size=40`;

      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}&search_precise=true&ordering=-rating&metacritic=1,100`;
      } else {
        url += `&${getCategoryParams(category)}`;
      }

      const data = await $fetch<{ results: Game[]; next: string | null }>(url);
      games.value = data.results;
      nextPage.value = data.next;
    } catch (e) {
      error.value = "Oyunlar yüklenemedi";
    } finally {
      pending.value = false;
    }
  }

  // Daha fazla yükle
  async function loadMore() {
    if (!nextPage.value || pendingMore.value) return;

    pendingMore.value = true;

    try {
      // next URL'deki key'i bizim key'imizle değiştir
      const url = nextPage.value.replace(/key=[^&]*/, `key=${apiKey}`);

      const data = await $fetch<{ results: Game[]; next: string | null }>(url);
      games.value = [...games.value, ...data.results];
      nextPage.value = data.next;
    } catch (e) {
      error.value = "Daha fazla yüklenemedi";
    } finally {
      pendingMore.value = false;
    }
  }

  return {
    games,
    pending,
    pendingMore,
    error,
    currentCategory,
    hasMore,
    fetchGames,
    loadMore,
  };
});
