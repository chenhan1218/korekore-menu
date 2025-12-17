/**
 * Menu Store (Zustand)
 *
 * Global state management for menu parsing and ordering flow
 * Bridges between React UI and Domain layer
 */

import { create } from 'zustand'
import { MenuItem, MenuData } from '@/domain/entities'
import { AppError } from '@/shared/types'

/**
 * Menu store state interface
 */
export interface MenuStoreState {
  // Current menu data
  currentMenu: MenuData | null

  // Selected menu items (checked by user)
  selectedItems: Set<string>

  // Loading state
  isLoading: boolean

  // Error state
  error: AppError | null

  // Current language
  language: 'zh_TW' | 'en'

  // Actions
  setCurrentMenu: (menu: MenuData) => void
  clearCurrentMenu: () => void
  toggleItemSelection: (itemId: string) => void
  selectAllItems: () => void
  deselectAllItems: () => void
  setLoading: (loading: boolean) => void
  setError: (error: AppError | null) => void
  setLanguage: (language: 'zh_TW' | 'en') => void
  getSelectedItems: () => MenuItem[]
  getSelectedItemsCount: () => number
  resetState: () => void
}

/**
 * Create menu store with Zustand
 */
export const useMenuStore = create<MenuStoreState>((set, get) => ({
  // Initial state
  currentMenu: null,
  selectedItems: new Set(),
  isLoading: false,
  error: null,
  language: 'zh_TW',

  // Action: Set current menu
  setCurrentMenu: (menu: MenuData) => {
    set({
      currentMenu: menu,
      selectedItems: new Set(),
      error: null,
    })
  },

  // Action: Clear current menu
  clearCurrentMenu: () => {
    set({
      currentMenu: null,
      selectedItems: new Set(),
      error: null,
    })
  },

  // Action: Toggle item selection
  toggleItemSelection: (itemId: string) => {
    set(state => {
      const newSelected = new Set(state.selectedItems)
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId)
      } else {
        newSelected.add(itemId)
      }
      return { selectedItems: newSelected }
    })
  },

  // Action: Select all items
  selectAllItems: () => {
    set(state => {
      if (!state.currentMenu) return state
      const allIds = new Set(state.currentMenu.items.map(item => item.id))
      return { selectedItems: allIds }
    })
  },

  // Action: Deselect all items
  deselectAllItems: () => {
    set({ selectedItems: new Set() })
  },

  // Action: Set loading state
  setLoading: (loading: boolean) => {
    set({ isLoading: loading })
  },

  // Action: Set error state
  setError: (error: AppError | null) => {
    set({ error })
  },

  // Action: Set language
  setLanguage: (language: 'zh_TW' | 'en') => {
    set({ language })
  },

  // Getter: Get selected menu items
  getSelectedItems: () => {
    const state = get()
    if (!state.currentMenu) return []
    return state.currentMenu.items.filter(item => state.selectedItems.has(item.id))
  },

  // Getter: Get count of selected items
  getSelectedItemsCount: () => {
    return get().selectedItems.size
  },

  // Action: Reset all state
  resetState: () => {
    set({
      currentMenu: null,
      selectedItems: new Set(),
      isLoading: false,
      error: null,
      language: 'zh_TW',
    })
  },
}))
