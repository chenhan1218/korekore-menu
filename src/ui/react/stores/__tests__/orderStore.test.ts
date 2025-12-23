import { describe, it, expect, beforeEach } from 'vitest'
import { useOrderStore } from '../orderStore'
import type { MenuItem } from '@/domain/entities'

/**
 * Tests for OrderStore (Zustand store)
 *
 * Verifies:
 * - Initial state is correct
 * - Adding/removing items works
 * - Quantity updates work
 * - Total calculations are correct
 * - Order summary is accurate
 */
describe('OrderStore', () => {
  const mockMenuItem: MenuItem = {
    id: 'item_1',
    name: 'Katsudon',
    name_zh_TW: '豬排蓋飯',
    price: '¥1,200',
    description: 'Breaded pork cutlet over rice',
  }

  const mockMenuItem2: MenuItem = {
    id: 'item_2',
    name: 'Tempura',
    name_zh_TW: '天婦羅',
    price: '¥1,500',
    description: 'Crispy tempura',
  }

  beforeEach(() => {
    // Reset store state before each test
    useOrderStore.getState().clearOrder()
  })

  it('should have correct initial state', () => {
    const state = useOrderStore.getState()

    expect(state.selectedItems).toEqual([])
    expect(state.orderTotal).toBe(0)
  })

  it('should add a single item', () => {
    useOrderStore.getState().addItem(mockMenuItem)

    const state = useOrderStore.getState()
    expect(state.selectedItems).toHaveLength(1)
    expect(state.selectedItems[0]?.item.id).toBe('item_1')
    expect(state.selectedItems[0]?.quantity).toBe(1)
  })

  it('should add item with custom quantity', () => {
    useOrderStore.getState().addItem(mockMenuItem, 3)

    const state = useOrderStore.getState()
    expect(state.selectedItems[0]?.quantity).toBe(3)
  })

  it('should increase quantity when adding duplicate item', () => {
    useOrderStore.getState().addItem(mockMenuItem, 1)
    useOrderStore.getState().addItem(mockMenuItem, 2)

    const state = useOrderStore.getState()
    expect(state.selectedItems).toHaveLength(1)
    expect(state.selectedItems[0]?.quantity).toBe(3)
  })

  it('should remove item from order', () => {
    useOrderStore.getState().addItem(mockMenuItem)
    useOrderStore.getState().addItem(mockMenuItem2)

    useOrderStore.getState().removeItem('item_1')

    const state = useOrderStore.getState()
    expect(state.selectedItems).toHaveLength(1)
    expect(state.selectedItems[0]?.item.id).toBe('item_2')
  })

  it('should update item quantity', () => {
    useOrderStore.getState().addItem(mockMenuItem, 1)
    useOrderStore.getState().updateQuantity('item_1', 5)

    const state = useOrderStore.getState()
    expect(state.selectedItems[0]?.quantity).toBe(5)
  })

  it('should remove item when quantity becomes 0', () => {
    useOrderStore.getState().addItem(mockMenuItem)
    useOrderStore.getState().updateQuantity('item_1', 0)

    const state = useOrderStore.getState()
    expect(state.selectedItems).toHaveLength(0)
  })

  it('should clear all items', () => {
    useOrderStore.getState().addItem(mockMenuItem)
    useOrderStore.getState().addItem(mockMenuItem2)

    useOrderStore.getState().clearOrder()

    const state = useOrderStore.getState()
    expect(state.selectedItems).toHaveLength(0)
    expect(state.orderTotal).toBe(0)
  })

  it('should get correct item quantity', () => {
    useOrderStore.getState().addItem(mockMenuItem, 3)

    const quantity = useOrderStore.getState().getItemQuantity('item_1')
    expect(quantity).toBe(3)
  })

  it('should return 0 for non-existent item quantity', () => {
    const quantity = useOrderStore.getState().getItemQuantity('non-existent')
    expect(quantity).toBe(0)
  })

  it('should calculate correct order summary', () => {
    useOrderStore.getState().addItem(mockMenuItem, 2)
    useOrderStore.getState().addItem(mockMenuItem2, 1)

    const summary = useOrderStore.getState().getOrderSummary()
    expect(summary.itemCount).toBe(3) // 2 + 1
    expect(summary.uniqueItems).toBe(2)
    expect(summary.total).toMatch(/¥/) // Check that price includes yen symbol
  })

  it('should support subscribing to state changes', () => {
    let callCount = 0
    const unsubscribe = useOrderStore.subscribe(() => {
      callCount++
    })

    useOrderStore.getState().addItem(mockMenuItem)
    expect(callCount).toBeGreaterThan(0)

    unsubscribe()
  })
})
