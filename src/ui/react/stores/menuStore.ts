import { create } from 'zustand'
import type { MenuData } from '@/types/menu'

/**
 * Menu state store using Zustand
 *
 * Tracks:
 * - Current scanned menu data
 * - Uploaded image URL
 * - Menu parsing status (loading, error)
 */

export interface MenuState {
  // Menu data
  currentMenu: MenuData | null
  imageUrl: string | null
  imageFile: File | null

  // Parsing status
  isParsing: boolean
  parseError: string | null

  // Actions
  setCurrentMenu: (menu: MenuData) => void
  setImageUrl: (url: string) => void
  setImageFile: (file: File) => void
  setIsParsing: (loading: boolean) => void
  setParseError: (error: string | null) => void
  reset: () => void
}

/**
 * Zustand store for menu state management
 *
 * Usage:
 * ```tsx
 * const { currentMenu, setCurrentMenu } = useMenuStore()
 * ```
 */
export const useMenuStore = create<MenuState>((set) => ({
  // Initial state
  currentMenu: null,
  imageUrl: null,
  imageFile: null,
  isParsing: false,
  parseError: null,

  // Action creators
  setCurrentMenu: (menu) => set({ currentMenu: menu }),
  setImageUrl: (url) => set({ imageUrl: url }),
  setImageFile: (file) => set({ imageFile: file }),
  setIsParsing: (loading) => set({ isParsing: loading }),
  setParseError: (error) => set({ parseError: error }),
  reset: () =>
    set({
      currentMenu: null,
      imageUrl: null,
      imageFile: null,
      isParsing: false,
      parseError: null,
    }),
}))

/**
 * Selector hooks for better performance (optional)
 * These prevent unnecessary re-renders by only tracking specific parts of state
 */
export const selectCurrentMenu = (state: MenuState) => state.currentMenu
export const selectImageUrl = (state: MenuState) => state.imageUrl
export const selectIsParsing = (state: MenuState) => state.isParsing
export const selectParseError = (state: MenuState) => state.parseError
