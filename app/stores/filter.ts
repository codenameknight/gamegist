export const useFilterStore = defineStore("filter", () => {
  const route = useRoute();
  const router = useRouter();

  // URL'den başlangıç değerlerini al
  const selectedGenre = ref((route.query.genre as string) || "");
  const selectedPlatform = ref((route.query.platform as string) || "");
  const minRating = ref(Number(route.query.rating) || 0);
  const ordering = ref((route.query.ordering as string) || "");

  // Filtreler değişince URL'yi güncelle
  watch(
    [selectedGenre, selectedPlatform, minRating, ordering],
    ([genre, platform, rating, ord]) => {
      const query: Record<string, string> = {};
      if (genre) query.genre = genre;
      if (platform) query.platform = platform;
      if (rating > 0) query.rating = String(rating);
      if (ord) query.ordering = ord;
      router.push({ query });
    },
  );

  // Getter — herhangi bir filtre var mı?
  const hasFilter = computed(
    () =>
      selectedGenre.value.trim().length > 0 ||
      selectedPlatform.value.trim().length > 0 ||
      minRating.value > 0 ||
      ordering.value.trim().length > 0,
  );

  // Filtreleri sıfırla
  function resetFilters() {
    selectedGenre.value = "";
    selectedPlatform.value = "";
    minRating.value = 0;
    ordering.value = "";
  }

  return {
    selectedGenre,
    selectedPlatform,
    minRating,
    ordering,
    hasFilter,
    resetFilters,
  };
});
