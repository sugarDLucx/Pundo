import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false, // Light mode by default
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'pundo-theme-storage',
    }
  )
);
