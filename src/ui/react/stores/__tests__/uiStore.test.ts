import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useUIStore } from '../uiStore'

/**
 * Tests for UIStore (Zustand store)
 *
 * Verifies:
 * - Initial state is correct
 * - Loading state management works
 * - Error handling works
 * - Toast notifications work
 * - Modal/dialog management works
 */
describe('UIStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUIStore.getState().reset()
  })

  it('should have correct initial state', () => {
    const state = useUIStore.getState()

    expect(state.isLoading).toBe(false)
    expect(state.loadingMessage).toBe('')
    expect(state.globalError).toBeNull()
    expect(state.toasts).toEqual([])
    expect(state.isModalOpen).toBeNull()
  })

  it('should set loading state', () => {
    useUIStore.getState().setIsLoading(true, 'Loading...')

    const state = useUIStore.getState()
    expect(state.isLoading).toBe(true)
    expect(state.loadingMessage).toBe('Loading...')
  })

  it('should clear loading state', () => {
    useUIStore.getState().setIsLoading(true)
    useUIStore.getState().setIsLoading(false)

    const state = useUIStore.getState()
    expect(state.isLoading).toBe(false)
  })

  it('should set global error', () => {
    const error = 'An error occurred'
    useUIStore.getState().setGlobalError(error)

    expect(useUIStore.getState().globalError).toBe(error)
  })

  it('should clear global error', () => {
    useUIStore.getState().setGlobalError('Some error')
    useUIStore.getState().setGlobalError(null)

    expect(useUIStore.getState().globalError).toBeNull()
  })

  it('should show success toast', () => {
    useUIStore.getState().showToast('success', 'Success!', 0) // 0 = no auto-dismiss for testing

    const state = useUIStore.getState()
    expect(state.toasts).toHaveLength(1)
    expect(state.toasts[0]?.type).toBe('success')
    expect(state.toasts[0]?.message).toBe('Success!')
  })

  it('should show error toast', () => {
    useUIStore.getState().showToast('error', 'Error message', 0)

    const state = useUIStore.getState()
    expect(state.toasts[0]?.type).toBe('error')
  })

  it('should show warning and info toasts', () => {
    useUIStore.getState().showToast('warning', 'Warning', 0)
    useUIStore.getState().showToast('info', 'Info', 0)

    const state = useUIStore.getState()
    expect(state.toasts).toHaveLength(2)
  })

  it('should dismiss toast by id', () => {
    useUIStore.getState().showToast('success', 'Toast 1', 0)
    useUIStore.getState().showToast('success', 'Toast 2', 0)

    const state = useUIStore.getState()
    const toastId = state.toasts[0]?.id

    if (toastId) {
      useUIStore.getState().dismissToast(toastId)
    }

    expect(useUIStore.getState().toasts).toHaveLength(1)
  })

  it('should clear all toasts', () => {
    useUIStore.getState().showToast('success', 'Toast 1', 0)
    useUIStore.getState().showToast('error', 'Toast 2', 0)

    useUIStore.getState().clearAllToasts()

    expect(useUIStore.getState().toasts).toHaveLength(0)
  })

  it('should auto-dismiss toast after duration', async () => {
    vi.useFakeTimers()

    useUIStore.getState().showToast('success', 'Will disappear', 100)

    expect(useUIStore.getState().toasts).toHaveLength(1)

    // Fast-forward time
    vi.advanceTimersByTime(150)

    expect(useUIStore.getState().toasts).toHaveLength(0)

    vi.useRealTimers()
  })

  it('should open modal', () => {
    useUIStore.getState().openModal('confirm-dialog')

    expect(useUIStore.getState().isModalOpen).toBe('confirm-dialog')
  })

  it('should close modal', () => {
    useUIStore.getState().openModal('confirm-dialog')
    useUIStore.getState().closeModal()

    expect(useUIStore.getState().isModalOpen).toBeNull()
  })

  it('should reset all UI state', () => {
    // Set up some state
    useUIStore.getState().setIsLoading(true)
    useUIStore.getState().setGlobalError('Error')
    useUIStore.getState().showToast('success', 'Toast', 0)
    useUIStore.getState().openModal('dialog')

    // Reset
    useUIStore.getState().reset()

    const state = useUIStore.getState()
    expect(state.isLoading).toBe(false)
    expect(state.globalError).toBeNull()
    expect(state.toasts).toHaveLength(0)
    expect(state.isModalOpen).toBeNull()
  })

  it('should support subscribing to state changes', () => {
    let callCount = 0
    const unsubscribe = useUIStore.subscribe(() => {
      callCount++
    })

    useUIStore.getState().setIsLoading(true)
    expect(callCount).toBeGreaterThan(0)

    unsubscribe()
  })
})
