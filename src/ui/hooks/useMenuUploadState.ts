import { useState, useCallback } from 'react'

/**
 * Upload state type definition
 * - idle: Initial state, no upload in progress
 * - compressing: Image is being compressed
 * - uploading: File is being uploaded to server
 * - success: Upload completed successfully
 * - error: Upload failed
 */
type UploadState = 'idle' | 'compressing' | 'uploading' | 'success' | 'error'

/**
 * Return type for useMenuUploadState hook
 */
interface MenuUploadStateResult {
  // State
  state: UploadState
  error: string | null
  progress: number
  isLoading: boolean

  // State transition methods
  startCompression: () => void
  startUploading: () => void
  completeSuccess: () => void
  setError: (error: string) => void
  reset: () => void

  // Progress management
  setProgress: (progress: number) => void

  // State query helpers
  isIdle: boolean
  isCompressing: boolean
  isUploading: boolean
  isSuccess: boolean
  isError: boolean
}

/**
 * Custom hook for managing menu upload state machine
 *
 * Handles the lifecycle of uploading a menu image:
 * 1. idle → compressing (image is being compressed)
 * 2. compressing → uploading (compressed image is being uploaded)
 * 3. uploading → success (upload completed)
 * 4. Any state → error (if something fails)
 * 5. Any state → idle (reset for retry or new upload)
 *
 * @returns {MenuUploadStateResult} Current state and control methods
 *
 * @example
 * const uploadState = useMenuUploadState()
 * if (uploadState.isCompressing) {
 *   return <div>Compressing image...</div>
 * }
 */
export function useMenuUploadState(): MenuUploadStateResult {
  const [state, setState] = useState<UploadState>('idle')
  const [error, setErrorState] = useState<string | null>(null)
  const [progress, setProgressState] = useState(0)

  const startCompression = useCallback(() => {
    setState('compressing')
    setErrorState(null)
    setProgressState(0)
  }, [])

  const startUploading = useCallback(() => {
    setState('uploading')
    setErrorState(null)
  }, [])

  const completeSuccess = useCallback(() => {
    setState('success')
    setErrorState(null)
    setProgressState(100)
  }, [])

  const setError = useCallback((error: string) => {
    setState('error')
    setErrorState(error)
    setProgressState(0)
  }, [])

  const reset = useCallback(() => {
    setState('idle')
    setErrorState(null)
    setProgressState(0)
  }, [])

  const setProgress = useCallback((newProgress: number) => {
    // Clamp progress between 0 and 100
    const clampedProgress = Math.min(Math.max(newProgress, 0), 100)
    setProgressState(clampedProgress)
  }, [])

  const isLoading = state === 'compressing' || state === 'uploading'

  return {
    // State
    state,
    error,
    progress,
    isLoading,

    // Methods
    startCompression,
    startUploading,
    completeSuccess,
    setError,
    reset,
    setProgress,

    // Query helpers
    isIdle: state === 'idle',
    isCompressing: state === 'compressing',
    isUploading: state === 'uploading',
    isSuccess: state === 'success',
    isError: state === 'error',
  }
}
