export const useSearchStore = defineStore("search", () => {
  // Kullanıcının yazdığı anlık değer
  const searchQuery = ref("");

  // 500ms debounce — kullanıcı yazmayı bırakınca güncellenir
  const debouncedQuery = useDebounce(searchQuery, 500);

  // Getter — arama var mı?
  const hasSearch = computed(() => debouncedQuery.value.trim().length > 0);

  return { searchQuery, debouncedQuery, hasSearch };
});
