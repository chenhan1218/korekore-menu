import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMenuUploadState } from '@/ui/hooks/useMenuUploadState'

/**
 * Test suite for useMenuUploadState hook
 * Tests state management and transitions for menu upload process
 */
describe('useMenuUploadState Hook', () => {
  describe('Initial State', () => {
    it('should initialize with idle state', () => {
      const { result } = renderHook(() => useMenuUploadState())

      expect(result.current.state).toBe('idle')
      expect(result.current.error).toBeNull()
      expect(result.current.progress).toBe(0)
      expect(result.current.isLoading).toBe(false)
    })

    it('should have all required state methods', () => {
      const { result } = renderHook(() => useMenuUploadState())

      expect(typeof result.current.startCompression).toBe('function')
      expect(typeof result.current.startUploading).toBe('function')
      expect(typeof result.current.completeSuccess).toBe('function')
      expect(typeof result.current.setError).toBe('function')
      expect(typeof result.current.reset).toBe('function')
    })
  })

  describe('State Transitions', () => {
    it('should transition from idle to compressing', () => {
      const { result } = renderHook(() => useMenuUploadState())

      act(() => {
        result.current.startCompression()
      })

      expect(result.current.state).toBe('compressing')
      expect(result.current.isLoading).toBe(true)
    })

    it('should transition from compressing to uploading', () => {
      const { result } = renderHook(() => useMenuUploadState())

      act(() => {
        result.current.startCompression()
        result.current.startUploading()
      })

      expect(result.current.state).toBe('uploading')
      expect(result.current.isLoading).toBe(true)
    })

    it('should transition from uploading to success', () => {
      const { result } = renderHook(() => useMenuUploadState())

      act(() => {
        result.current.startCompression()
        result.current.startUploading()
        result.current.completeSuccess()
      })

      expect(result.current.state).toBe('success')
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should transition to error state and preserve error message', () => {
      const { result } = renderHook(() => useMenuUploadState())
      const errorMessage = 'Upload failed: Network error'

      act(() => {
        result.current.startCompression()
        result.current.setError(errorMessage)
      })

      expect(result.current.state).toBe('error')
      expect(result.current.error).toBe(errorMessage)
      expect(result.current.isLoading).toBe(false)
    })

    it('should allow transition to error from any state', () => {
      const { result } = renderHook(() => useMenuUploadState())

      // Start in idle
      act(() => {
        result.current.setError('Error in idle')
      })
      expect(result.current.state).toBe('error')
      expect(result.current.error).toBe('Error in idle')

      // Reset and test from uploading
      act(() => {
        result.current.reset()
        result.current.startCompression()
        result.current.startUploading()
        result.current.setError('Error while uploading')
      })

      expect(result.current.state).toBe('error')
      expect(result.current.error).toBe('Error while uploading')
    })

    it('should reset to idle state with clean state', () => {
      const { result } = renderHook(() => useMenuUploadState())

      // Set up a complex state
      act(() => {
        result.current.startCompression()
        result.current.startUploading()
        result.current.completeSuccess()
      })

      expect(result.current.state).toBe('success')

      // Reset
      act(() => {
        result.current.reset()
      })

      expect(result.current.state).toBe('idle')
      expect(result.current.error).toBeNull()
      expect(result.current.progress).toBe(0)
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('Error Handling', () => {
    it('should clear error when resetting', () => {
      const { result } = renderHook(() => useMenuUploadState())

      act(() => {
        result.current.setError('Some error')
      })

      expect(result.current.error).toBe('Some error')

      act(() => {
        result.current.reset()
      })

      expect(result.current.error).toBeNull()
    })

    it('should handle empty error message', () => {
      const { result } = renderHook(() => useMenuUploadState())

      act(() => {
        result.current.setError('')
      })

      // Empty string should still transition to error state
      expect(result.current.state).toBe('error')
      expect(result.current.error).toBe('')
    })

    it('should allow updating error message in error state', () => {
      const { result } = renderHook(() => useMenuUploadState())

      act(() => {
        result.current.setError('First error')
      })

      expect(result.current.error).toBe('First error')

      act(() => {
        result.current.setError('Updated error')
      })

      expect(result.current.error).toBe('Updated error')
      expect(result.current.state).toBe('error')
    })
  })

  describe('Progress Tracking', () => {
    it('should allow setting progress value', () => {
      const { result } = renderHook(() => useMenuUploadState())

      act(() => {
        result.current.setProgress(50)
      })

      expect(result.current.progress).toBe(50)
    })

    it('should clamp progress between 0 and 100', () => {
      const { result } = renderHook(() => useMenuUploadState())

      act(() => {
        result.current.setProgress(-10)
      })

      expect(result.current.progress).toBe(0)

      act(() => {
        result.current.setProgress(150)
      })

      expect(result.current.progress).toBe(100)
    })

    it('should reset progress when resetting state', () => {
      const { result } = renderHook(() => useMenuUploadState())

      act(() => {
        result.current.setProgress(75)
      })

      expect(result.current.progress).toBe(75)

      act(() => {
        result.current.reset()
      })

      expect(result.current.progress).toBe(0)
    })

    it('should allow progress updates during uploading state', () => {
      const { result } = renderHook(() => useMenuUploadState())

      act(() => {
        result.current.startCompression()
        result.current.startUploading()
        result.current.setProgress(25)
      })

      expect(result.current.progress).toBe(25)
      expect(result.current.state).toBe('uploading')
    })
  })

  describe('isLoading Flag', () => {
    it('should be true in compressing state', () => {
      const { result } = renderHook(() => useMenuUploadState())

      act(() => {
        result.current.startCompression()
      })

      expect(result.current.isLoading).toBe(true)
    })

    it('should be true in uploading state', () => {
      const { result } = renderHook(() => useMenuUploadState())

      act(() => {
        result.current.startCompression()
        result.current.startUploading()
      })

      expect(result.current.isLoading).toBe(true)
    })

    it('should be false in idle state', () => {
      const { result } = renderHook(() => useMenuUploadState())

      expect(result.current.isLoading).toBe(false)
    })

    it('should be false in success state', () => {
      const { result } = renderHook(() => useMenuUploadState())

      act(() => {
        result.current.startCompression()
        result.current.startUploading()
        result.current.completeSuccess()
      })

      expect(result.current.isLoading).toBe(false)
    })

    it('should be false in error state', () => {
      const { result } = renderHook(() => useMenuUploadState())

      act(() => {
        result.current.startCompression()
        result.current.setError('Upload failed')
      })

      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('State Queries', () => {
    it('should provide state-specific query methods', () => {
      const { result } = renderHook(() => useMenuUploadState())

      expect(result.current.isIdle).toBe(true)
      expect(result.current.isCompressing).toBe(false)
      expect(result.current.isUploading).toBe(false)
      expect(result.current.isSuccess).toBe(false)
      expect(result.current.isError).toBe(false)
    })

    it('should update query methods with state changes', () => {
      const { result } = renderHook(() => useMenuUploadState())

      act(() => {
        result.current.startCompression()
      })

      expect(result.current.isIdle).toBe(false)
      expect(result.current.isCompressing).toBe(true)

      act(() => {
        result.current.startUploading()
      })

      expect(result.current.isCompressing).toBe(false)
      expect(result.current.isUploading).toBe(true)
    })
  })

  describe('Integration Scenarios', () => {
    it('should handle complete upload flow: idle → compressing → uploading → success', () => {
      const { result } = renderHook(() => useMenuUploadState())

      // Initial state
      expect(result.current.isIdle).toBe(true)

      // Start compression
      act(() => {
        result.current.startCompression()
      })
      expect(result.current.isCompressing).toBe(true)
      expect(result.current.isLoading).toBe(true)

      // Progress during compression
      act(() => {
        result.current.setProgress(50)
      })
      expect(result.current.progress).toBe(50)

      // Start uploading
      act(() => {
        result.current.startUploading()
      })
      expect(result.current.isUploading).toBe(true)
      expect(result.current.isCompressing).toBe(false)

      // Progress during upload
      act(() => {
        result.current.setProgress(100)
      })
      expect(result.current.progress).toBe(100)

      // Complete
      act(() => {
        result.current.completeSuccess()
      })
      expect(result.current.isSuccess).toBe(true)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should handle error recovery flow', () => {
      const { result } = renderHook(() => useMenuUploadState())

      // Start and encounter error
      act(() => {
        result.current.startCompression()
        result.current.setError('Compression failed')
      })

      expect(result.current.isError).toBe(true)
      expect(result.current.error).toBe('Compression failed')

      // User retries
      act(() => {
        result.current.reset()
      })

      expect(result.current.isIdle).toBe(true)
      expect(result.current.error).toBeNull()

      // Try again successfully
      act(() => {
        result.current.startCompression()
        result.current.startUploading()
        result.current.completeSuccess()
      })

      expect(result.current.isSuccess).toBe(true)
    })

    it('should handle multiple sequential uploads', () => {
      const { result } = renderHook(() => useMenuUploadState())

      // First upload
      act(() => {
        result.current.startCompression()
        result.current.startUploading()
        result.current.completeSuccess()
      })
      expect(result.current.isSuccess).toBe(true)

      // Reset for second upload
      act(() => {
        result.current.reset()
      })
      expect(result.current.isIdle).toBe(true)

      // Second upload
      act(() => {
        result.current.startCompression()
        result.current.startUploading()
        result.current.completeSuccess()
      })
      expect(result.current.isSuccess).toBe(true)
    })
  })
})
