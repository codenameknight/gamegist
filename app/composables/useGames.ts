import { useGamesStore } from "~/stores/games";

export function useGames() {
  const gamesStore = useGamesStore();
  const searchStore = useSearchStore();
  const filterStore = useFilterStore();

  // Sayfa açılınca oyunları çek
  onMounted(() => {
    if (gamesStore.games.length === 0) {
      gamesStore.fetchGames();
    }
  });

  // Search değişince RAWG'a sor
  watch(
    () => searchStore.debouncedQuery,
    (query) => {
      if (query) {
        gamesStore.fetchGames("search", query);
      } else {
        gamesStore.fetchGames(gamesStore.currentCategory);
      }
    },
  );

  // Tüm genre'leri oyunlardan çıkar (tekrarsız)
  const genres = computed(() => {
    if (!gamesStore.games.length) return [];
    const allGenres = gamesStore.games.flatMap((g) => g.genres);
    return [...new Map(allGenres.map((g) => [g.id, g])).values()];
  });

  // Tüm platformları oyunlardan çıkar (tekrarsız)
  const platforms = computed(() => {
    if (!gamesStore.games.length) return [];
    const allPlatforms = gamesStore.games
      .filter((g) => g.platforms != null)
      .flatMap((g) => g.platforms.map((p) => p.platform));
    return [...new Map(allPlatforms.map((p) => [p.id, p])).values()];
  });

  // Filtrelenmiş oyunlar
  const filteredGames = computed(() => {
    if (!gamesStore.games.length) return [];

    let result = gamesStore.games;

    // Genre filtresi
    if (filterStore.selectedGenre) {
      result = result.filter((game) =>
        game.genres.some((g) => g.name === filterStore.selectedGenre),
      );
    }

    // Platform filtresi
    if (filterStore.selectedPlatform) {
      result = result.filter((game) =>
        game.platforms.some(
          (p) => p.platform.name === filterStore.selectedPlatform,
        ),
      );
    }

    // Rating filtresi
    if (filterStore.minRating > 0) {
      result = result.filter((game) => game.rating >= filterStore.minRating);
    }

    // Ordering filtresi
    if (filterStore.ordering) {
      result = [...result].sort((a, b) => {
        switch (filterStore.ordering) {
          case "-rating":
            return b.rating - a.rating;
          case "rating":
            return a.rating - b.rating;
          case "-released":
            return (
              new Date(b.released ?? "").getTime() -
              new Date(a.released ?? "").getTime()
            );
          case "released":
            return (
              new Date(a.released ?? "").getTime() -
              new Date(b.released ?? "").getTime()
            );
          case "name":
            return a.name.localeCompare(b.name);
          case "-name":
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
    }

    return result;
  });

  return {
    pending: computed(() => gamesStore.pending),
    error: computed(() => gamesStore.error),
    genres,
    platforms,
    filteredGames,
  };
}
