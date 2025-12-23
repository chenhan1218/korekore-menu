import { describe, it, expect, beforeEach } from 'vitest'
import { useMenuStore } from '../menuStore'
import type { MenuData } from '@/types/menu'

/**
 * Tests for MenuStore (Zustand store)
 *
 * Verifies:
 * - Initial state is correct
 * - State updates work properly
 * - Selectors return correct values
 * - Reset functionality works
 */
describe('MenuStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useMenuStore.getState()
    store.reset()
  })

  it('should have correct initial state', () => {
    const state = useMenuStore.getState()

    expect(state.currentMenu).toBeNull()
    expect(state.imageUrl).toBeNull()
    expect(state.imageFile).toBeNull()
    expect(state.isParsing).toBe(false)
    expect(state.parseError).toBeNull()
  })

  it('should set current menu', () => {
    const mockMenu: MenuData = {
      id: 'menu_1',
      imageUrl: 'https://example.com/menu.jpg',
      items: [],
      originalLanguage: 'ja',
      uploadedAt: new Date(),
    }

    useMenuStore.getState().setCurrentMenu(mockMenu)

    const state = useMenuStore.getState()
    expect(state.currentMenu).toEqual(mockMenu)
  })

  it('should set image URL', () => {
    const url = 'https://example.com/image.jpg'
    useMenuStore.getState().setImageUrl(url)

    const state = useMenuStore.getState()
    expect(state.imageUrl).toBe(url)
  })

  it('should set image file', () => {
    const file = new File(['content'], 'menu.jpg', { type: 'image/jpeg' })
    useMenuStore.getState().setImageFile(file)

    const state = useMenuStore.getState()
    expect(state.imageFile).toBe(file)
  })

  it('should set parsing state', () => {
    useMenuStore.getState().setIsParsing(true)
    expect(useMenuStore.getState().isParsing).toBe(true)

    useMenuStore.getState().setIsParsing(false)
    expect(useMenuStore.getState().isParsing).toBe(false)
  })

  it('should set and clear parse error', () => {
    const error = 'Failed to parse menu'
    useMenuStore.getState().setParseError(error)
    expect(useMenuStore.getState().parseError).toBe(error)

    useMenuStore.getState().setParseError(null)
    expect(useMenuStore.getState().parseError).toBeNull()
  })

  it('should reset all state', () => {
    // Set up some state
    useMenuStore.getState().setIsParsing(true)
    useMenuStore.getState().setImageUrl('https://example.com/image.jpg')
    useMenuStore.getState().setParseError('Some error')

    // Reset
    useMenuStore.getState().reset()

    const state = useMenuStore.getState()
    expect(state.currentMenu).toBeNull()
    expect(state.imageUrl).toBeNull()
    expect(state.imageFile).toBeNull()
    expect(state.isParsing).toBe(false)
    expect(state.parseError).toBeNull()
  })

  it('should support subscribing to state changes', () => {
    let callCount = 0
    const unsubscribe = useMenuStore.subscribe(() => {
      callCount++
    })

    useMenuStore.getState().setIsParsing(true)
    expect(callCount).toBeGreaterThan(0)

    unsubscribe()
  })
})
