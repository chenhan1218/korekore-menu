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
 * Selected item with quantity information
 */
export interface SelectedItem extends MenuItem {
  quantity: number
}

/**
 * Menu store state interface
 */
export interface MenuStoreState {
  // Current menu data
  currentMenu: MenuData | null

  // Selected menu items with quantity (itemId -> quantity)
  selectedItems: Map<string, number>

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
  updateItemQuantity: (itemId: string, quantity: number) => void
  incrementItemQuantity: (itemId: string) => void
  decrementItemQuantity: (itemId: string) => void
  removeItem: (itemId: string) => void
  selectAllItems: () => void
  deselectAllItems: () => void
  setLoading: (loading: boolean) => void
  setError: (error: AppError | null) => void
  setLanguage: (language: 'zh_TW' | 'en') => void
  getSelectedItems: () => SelectedItem[]
  getSelectedItemsCount: () => number
  getTotalPrice: () => number
  resetState: () => void
}

/**
 * Create menu store with Zustand
 */
export const useMenuStore = create<MenuStoreState>((set, get) => ({
  // Initial state
  currentMenu: null,
  selectedItems: new Map(),
  isLoading: false,
  error: null,
  language: 'zh_TW',

  // Action: Set current menu
  setCurrentMenu: (menu: MenuData) => {
    set({
      currentMenu: menu,
      selectedItems: new Map(),
      error: null,
    })
  },

  // Action: Clear current menu
  clearCurrentMenu: () => {
    set({
      currentMenu: null,
      selectedItems: new Map(),
      error: null,
    })
  },

  // Action: Toggle item selection (add with qty=1 or remove)
  toggleItemSelection: (itemId: string) => {
    set(state => {
      const newSelected = new Map(state.selectedItems)
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId)
      } else {
        newSelected.set(itemId, 1)
      }
      return { selectedItems: newSelected }
    })
  },

  // Action: Update item quantity to specific value
  updateItemQuantity: (itemId: string, quantity: number) => {
    set(state => {
      const newSelected = new Map(state.selectedItems)
      if (quantity <= 0) {
        newSelected.delete(itemId)
      } else {
        newSelected.set(itemId, quantity)
      }
      return { selectedItems: newSelected }
    })
  },

  // Action: Increment item quantity
  incrementItemQuantity: (itemId: string) => {
    set(state => {
      const newSelected = new Map(state.selectedItems)
      const currentQty = newSelected.get(itemId) || 0
      newSelected.set(itemId, currentQty + 1)
      return { selectedItems: newSelected }
    })
  },

  // Action: Decrement item quantity (remove if reaches 0)
  decrementItemQuantity: (itemId: string) => {
    set(state => {
      const newSelected = new Map(state.selectedItems)
      const currentQty = newSelected.get(itemId) || 0
      if (currentQty <= 1) {
        newSelected.delete(itemId)
      } else {
        newSelected.set(itemId, currentQty - 1)
      }
      return { selectedItems: newSelected }
    })
  },

  // Action: Remove item from selection
  removeItem: (itemId: string) => {
    set(state => {
      const newSelected = new Map(state.selectedItems)
      newSelected.delete(itemId)
      return { selectedItems: newSelected }
    })
  },

  // Action: Select all items with qty=1
  selectAllItems: () => {
    set(state => {
      if (!state.currentMenu) return state
      const newSelected = new Map<string, number>()
      state.currentMenu.items.forEach(item => {
        newSelected.set(item.id, 1)
      })
      return { selectedItems: newSelected }
    })
  },

  // Action: Deselect all items
  deselectAllItems: () => {
    set({ selectedItems: new Map() })
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

  // Getter: Get selected menu items with quantity info
  getSelectedItems: () => {
    const state = get()
    if (!state.currentMenu) return []

    const selectedList: SelectedItem[] = []
    state.selectedItems.forEach((quantity, itemId) => {
      const menuItem = state.currentMenu!.items.find(item => item.id === itemId)
      if (menuItem) {
        selectedList.push({
          ...menuItem,
          quantity,
        })
      }
    })

    return selectedList
  },

  // Getter: Get count of selected item types (not total quantity)
  getSelectedItemsCount: () => {
    return get().selectedItems.size
  },

  // Getter: Get total price of selected items
  getTotalPrice: () => {
    const state = get()
    let total = 0

    state.selectedItems.forEach((quantity, itemId) => {
      const menuItem = state.currentMenu?.items.find(item => item.id === itemId)
      if (menuItem && menuItem.price) {
        const price = parseFloat(menuItem.price)
        if (!isNaN(price)) {
          total += price * quantity
        }
      }
    })

    return total
  },

  // Action: Reset all state
  resetState: () => {
    set({
      currentMenu: null,
      selectedItems: new Map(),
      isLoading: false,
      error: null,
      language: 'zh_TW',
    })
  },
}))
