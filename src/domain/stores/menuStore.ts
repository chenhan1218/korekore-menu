import { create } from 'zustand'
import type { VariantType } from '@types/menu'

interface MenuStoreState {
  // State
  selectedItemIds: string[]
  selectedVariants: Record<string, VariantType>

  // Actions
  toggleSelectItem: (itemId: string, selected: boolean) => void
  selectVariant: (itemId: string, variant: VariantType) => void
  reset: () => void

  // Helpers
  isItemSelected: (itemId: string) => boolean
  getSelectedVariant: (itemId: string) => VariantType | undefined
  getTotalSelectedCount: () => number
}

export const useMenuStore = create<MenuStoreState>((set, get) => ({
  // Initial state
  selectedItemIds: [],
  selectedVariants: {},

  // Actions
  toggleSelectItem: (itemId: string, selected: boolean) => {
    set((state) => {
      if (selected) {
        // Add to selection if not already present
        if (!state.selectedItemIds.includes(itemId)) {
          return {
            selectedItemIds: [...state.selectedItemIds, itemId],
          }
        }
      } else {
        // Remove from selection
        return {
          selectedItemIds: state.selectedItemIds.filter((id) => id !== itemId),
        }
      }
      return state
    })
  },

  selectVariant: (itemId: string, variant: VariantType) => {
    set((state) => ({
      selectedVariants: {
        ...state.selectedVariants,
        [itemId]: variant,
      },
    }))
  },

  reset: () => {
    set({
      selectedItemIds: [],
      selectedVariants: {},
    })
  },

  // Helpers
  isItemSelected: (itemId: string) => {
    return get().selectedItemIds.includes(itemId)
  },

  getSelectedVariant: (itemId: string) => {
    return get().selectedVariants[itemId]
  },

  getTotalSelectedCount: () => {
    return get().selectedItemIds.length
  },
}))
