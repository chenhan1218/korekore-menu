import { create } from 'zustand'
import type { MenuItem } from '@/domain/entities'

/**
 * Order selection state store using Zustand
 *
 * Tracks:
 * - Selected menu items with quantities
 * - Order total calculations
 * - Persistent state to localStorage
 */

export interface OrderItem {
  item: MenuItem
  quantity: number
}

export interface OrderState {
  // Selected items
  selectedItems: OrderItem[]
  orderTotal: number

  // Actions
  addItem: (item: MenuItem, quantity?: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearOrder: () => void

  // Computed values
  getItemQuantity: (itemId: string) => number
  getOrderSummary: () => { itemCount: number; uniqueItems: number; total: string }
}

/**
 * Zustand store for order state management
 *
 * This store calculates totals automatically and can be persisted to localStorage
 *
 * Usage:
 * ```tsx
 * const { selectedItems, addItem, removeItem } = useOrderStore()
 * ```
 */
export const useOrderStore = create<OrderState>((set, get) => ({
  // Initial state
  selectedItems: [],
  orderTotal: 0,

  // Action creators
  addItem: (item, quantity = 1) =>
    set((state) => {
      const existing = state.selectedItems.find((o) => o.item.id === item.id)

      let newItems: OrderItem[]

      if (existing) {
        // If item already exists, update quantity
        newItems = state.selectedItems.map((o) =>
          o.item.id === item.id ? { ...o, quantity: o.quantity + quantity } : o
        )
      } else {
        // Otherwise, add new item
        newItems = [...state.selectedItems, { item, quantity }]
      }

      // Calculate new total
      const newTotal = calculateTotal(newItems)

      return {
        selectedItems: newItems,
        orderTotal: newTotal,
      }
    }),

  removeItem: (itemId) =>
    set((state) => {
      const newItems = state.selectedItems.filter((o) => o.item.id !== itemId)
      const newTotal = calculateTotal(newItems)

      return {
        selectedItems: newItems,
        orderTotal: newTotal,
      }
    }),

  updateQuantity: (itemId, quantity) =>
    set((state) => {
      let newItems: OrderItem[]

      if (quantity <= 0) {
        // Remove item if quantity becomes 0 or negative
        newItems = state.selectedItems.filter((o) => o.item.id !== itemId)
      } else {
        // Update quantity for existing item
        newItems = state.selectedItems.map((o) =>
          o.item.id === itemId ? { ...o, quantity } : o
        )
      }

      const newTotal = calculateTotal(newItems)

      return {
        selectedItems: newItems,
        orderTotal: newTotal,
      }
    }),

  clearOrder: () =>
    set({
      selectedItems: [],
      orderTotal: 0,
    }),

  // Computed values
  getItemQuantity: (itemId) => {
    const item = get().selectedItems.find((o) => o.item.id === itemId)
    return item?.quantity ?? 0
  },

  getOrderSummary: () => {
    const state = get()
    return {
      itemCount: state.selectedItems.reduce((sum, o) => sum + o.quantity, 0),
      uniqueItems: state.selectedItems.length,
      total: formatPrice(state.orderTotal),
    }
  },
}))

/**
 * Helper function to calculate total price from items
 *
 * Note: This is a placeholder - real implementation depends on MenuItem price format
 * Prices in MenuItem are strings like "¥1,200", need to parse and sum them
 */
function calculateTotal(items: OrderItem[]): number {
  return items.reduce((sum, order) => {
    // Parse price from MenuItem
    // This is a placeholder - actual implementation depends on price format
    const priceStr = order.item.price || '0'
    const price = parseFloat(priceStr.replace(/[^\d.-]/g, '')) || 0
    return sum + price * order.quantity
  }, 0)
}

/**
 * Helper function to format price for display
 */
function formatPrice(price: number): string {
  return `¥${price.toLocaleString('en-US', { minimumFractionDigits: 0 })}`
}

/**
 * Selector hooks for better performance
 */
export const selectSelectedItems = (state: OrderState) => state.selectedItems
export const selectOrderTotal = (state: OrderState) => state.orderTotal
