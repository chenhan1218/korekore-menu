import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile, UserPreferences } from "@/types/user";

interface UserState {
  // 使用者資料
  user: UserProfile | null;
  // 使用者偏好
  preferences: UserPreferences;
  // Loading 狀態
  isLoading: boolean;

  // Actions
  setUser: (user: UserProfile | null) => void;
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  setLanguage: (language: "zh-TW" | "en") => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

const initialState = {
  user: null,
  preferences: {
    language: "zh-TW" as const,
    theme: "system" as const,
  },
  isLoading: true,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user) => set({ user }),

      setPreferences: (newPreferences) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...newPreferences,
          },
        })),

      setLanguage: (language) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            language,
          },
        })),

      setTheme: (theme) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            theme,
          },
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      logout: () =>
        set({
          user: null,
        }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        preferences: state.preferences,
      }),
    }
  )
);
