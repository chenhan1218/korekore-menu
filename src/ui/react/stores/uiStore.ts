import { create } from 'zustand'

/**
 * Global UI state store using Zustand
 *
 * Tracks:
 * - Loading state for async operations
 * - Error messages and toast notifications
 * - Global UI visibility states
 */

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

export interface UIState {
  // Global loading
  isLoading: boolean
  loadingMessage: string

  // Global error
  globalError: string | null

  // Toasts
  toasts: Toast[]

  // Modal/dialog visibility
  isModalOpen: string | null

  // Actions
  setIsLoading: (loading: boolean, message?: string) => void
  setGlobalError: (error: string | null) => void
  showToast: (
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    duration?: number
  ) => void
  dismissToast: (id: string) => void
  clearAllToasts: () => void
  openModal: (modalId: string) => void
  closeModal: () => void
  reset: () => void
}

/**
 * Zustand store for global UI state management
 *
 * Usage:
 * ```tsx
 * const { isLoading, showToast } = useUIStore()
 *
 * showToast('success', 'Upload complete!')
 * ```
 */
export const useUIStore = create<UIState>((set) => ({
  // Initial state
  isLoading: false,
  loadingMessage: '',
  globalError: null,
  toasts: [],
  isModalOpen: null,

  // Action creators
  setIsLoading: (loading, message = '') =>
    set({
      isLoading: loading,
      loadingMessage: message,
    }),

  setGlobalError: (error) =>
    set({
      globalError: error,
    }),

  showToast: (type, message, duration) =>
    set((state) => {
      const id = `toast-${Date.now()}-${Math.random()}`
      const newToast: Toast = {
        id,
        type,
        message,
        duration: duration ?? 3000,
      }

      // Auto-dismiss after duration
      if (duration !== 0) {
        setTimeout(() => {
          set((s) => ({
            toasts: s.toasts.filter((t) => t.id !== id),
          }))
        }, newToast.duration)
      }

      return {
        toasts: [...state.toasts, newToast],
      }
    }),

  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearAllToasts: () =>
    set({
      toasts: [],
    }),

  openModal: (modalId) =>
    set({
      isModalOpen: modalId,
    }),

  closeModal: () =>
    set({
      isModalOpen: null,
    }),

  reset: () =>
    set({
      isLoading: false,
      loadingMessage: '',
      globalError: null,
      toasts: [],
      isModalOpen: null,
    }),
}))

/**
 * Selector hooks for better performance
 */
export const selectIsLoading = (state: UIState) => state.isLoading
export const selectGlobalError = (state: UIState) => state.globalError
export const selectToasts = (state: UIState) => state.toasts
export const selectIsModalOpen = (state: UIState) => state.isModalOpen
