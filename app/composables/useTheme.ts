export function useTheme() {
  const isDark = ref(false);

  // Sayfa açılınca localStorage'dan tema tercihini al
  onMounted(() => {
    isDark.value = localStorage.getItem("theme") === "dark";
    applyTheme(isDark.value);
  });

  function applyTheme(dark: boolean) {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  function toggleTheme() {
    isDark.value = !isDark.value;
    applyTheme(isDark.value);
    localStorage.setItem("theme", isDark.value ? "dark" : "light");
  }

  return { isDark, toggleTheme };
}
