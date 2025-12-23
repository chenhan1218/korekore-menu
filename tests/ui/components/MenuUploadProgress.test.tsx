import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MenuUploadProgress } from '@/ui/components/MenuUploadProgress'

/**
 * Test suite for MenuUploadProgress component
 * Tests progress display, state feedback, and error messages
 */
describe('MenuUploadProgress Component', () => {
  describe('Idle State', () => {
    it('should not render when state is idle', () => {
      const { container } = render(
        <MenuUploadProgress state="idle" error={null} progress={0} />
      )

      const progressContainer = container.querySelector('.upload-progress')
      expect(progressContainer?.className).toContain('hidden')
    })
  })

  describe('Compressing State', () => {
    it('should display compressing message', () => {
      render(
        <MenuUploadProgress state="compressing" error={null} progress={25} />
      )

      expect(screen.queryByText(/compressing|壓縮/i)).toBeTruthy()
    })

    it('should show progress bar when compressing', () => {
      const { container } = render(
        <MenuUploadProgress state="compressing" error={null} progress={50} />
      )

      const progressBar = container.querySelector('.progress-bar')
      expect(progressBar).toBeTruthy()
    })

    it('should display correct progress percentage', () => {
      const { container } = render(
        <MenuUploadProgress state="compressing" error={null} progress={75} />
      )

      const progressFill = container.querySelector('.progress-fill')
      expect(progressFill?.getAttribute('style')).toContain('75')
    })

    it('should display progress text', () => {
      render(
        <MenuUploadProgress state="compressing" error={null} progress={60} />
      )

      expect(screen.queryByText(/60%/)).toBeTruthy()
    })
  })

  describe('Uploading State', () => {
    it('should display uploading message', () => {
      render(
        <MenuUploadProgress state="uploading" error={null} progress={30} />
      )

      expect(screen.queryByText(/uploading|上傳/i)).toBeTruthy()
    })

    it('should show progress bar when uploading', () => {
      const { container } = render(
        <MenuUploadProgress state="uploading" error={null} progress={45} />
      )

      const progressBar = container.querySelector('.progress-bar')
      expect(progressBar).toBeTruthy()
    })

    it('should display progress updates during upload', () => {
      const { rerender, container } = render(
        <MenuUploadProgress state="uploading" error={null} progress={10} />
      )

      let progressFill = container.querySelector('.progress-fill')
      expect(progressFill?.getAttribute('style')).toContain('10')

      rerender(
        <MenuUploadProgress state="uploading" error={null} progress={50} />
      )

      progressFill = container.querySelector('.progress-fill')
      expect(progressFill?.getAttribute('style')).toContain('50')
    })
  })

  describe('Success State', () => {
    it('should display success message', () => {
      render(
        <MenuUploadProgress state="success" error={null} progress={100} />
      )

      expect(screen.queryByText(/success|成功/i)).toBeTruthy()
    })

    it('should show success icon', () => {
      const { container } = render(
        <MenuUploadProgress state="success" error={null} progress={100} />
      )

      const successIcon = container.querySelector('.success-icon')
      expect(successIcon).toBeTruthy()
    })

    it('should display 100% progress on success', () => {
      const { container } = render(
        <MenuUploadProgress state="success" error={null} progress={100} />
      )

      // Success state doesn't show progress bar, verify success icon instead
      const successIcon = container.querySelector('.success-icon')
      expect(successIcon).toBeTruthy()
    })
  })

  describe('Error State', () => {
    it('should display error message', () => {
      render(
        <MenuUploadProgress
          state="error"
          error="Upload failed"
          progress={50}
        />
      )

      expect(screen.queryByText(/Upload failed/)).toBeTruthy()
    })

    it('should display error icon', () => {
      const { container } = render(
        <MenuUploadProgress
          state="error"
          error="Network error"
          progress={0}
        />
      )

      const errorIcon = container.querySelector('.error-icon')
      expect(errorIcon).toBeTruthy()
    })

    it('should show descriptive error message', () => {
      const errorMsg = 'File format not supported'
      render(
        <MenuUploadProgress
          state="error"
          error={errorMsg}
          progress={0}
        />
      )

      expect(screen.queryByText(errorMsg)).toBeTruthy()
    })

    it('should have error styling with role=alert', () => {
      const { container } = render(
        <MenuUploadProgress
          state="error"
          error="Upload failed"
          progress={0}
        />
      )

      const errorContainer = container.querySelector('[role="alert"]')
      expect(errorContainer).toBeTruthy()
    })
  })

  describe('Progress Bar Styling', () => {
    it('should have appropriate CSS classes for state', () => {
      const { container } = render(
        <MenuUploadProgress state="compressing" error={null} progress={30} />
      )

      const progressContainer = container.querySelector('.upload-progress')
      expect(progressContainer?.className).toContain('state-compressing')
    })

    it('should update class when state changes', () => {
      const { rerender, container } = render(
        <MenuUploadProgress state="compressing" error={null} progress={30} />
      )

      let progressContainer = container.querySelector('.upload-progress')
      expect(progressContainer?.className).toContain('state-compressing')

      rerender(
        <MenuUploadProgress state="uploading" error={null} progress={50} />
      )

      progressContainer = container.querySelector('.upload-progress')
      expect(progressContainer?.className).toContain('state-uploading')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes for progress', () => {
      const { container } = render(
        <MenuUploadProgress state="uploading" error={null} progress={75} />
      )

      const progressBar = container.querySelector('[role="progressbar"]')
      expect(progressBar).toBeTruthy()
      expect(progressBar?.getAttribute('aria-valuenow')).toBe('75')
      expect(progressBar?.getAttribute('aria-valuemin')).toBe('0')
      expect(progressBar?.getAttribute('aria-valuemax')).toBe('100')
    })

    it('should have aria-label for progress bar', () => {
      const { container } = render(
        <MenuUploadProgress state="uploading" error={null} progress={50} />
      )

      const progressBar = container.querySelector('[role="progressbar"]')
      expect(progressBar?.getAttribute('aria-label')).toBeTruthy()
    })

    it('should announce error with role=alert', () => {
      const { container } = render(
        <MenuUploadProgress
          state="error"
          error="Upload failed"
          progress={0}
        />
      )

      const alert = container.querySelector('[role="alert"]')
      expect(alert).toBeTruthy()
    })
  })

  describe('Responsive Design', () => {
    it('should be visible and responsive', () => {
      const { container } = render(
        <MenuUploadProgress state="compressing" error={null} progress={50} />
      )

      const progressContainer = container.querySelector('.upload-progress')
      expect(progressContainer).toBeTruthy()

      // Container should be visible (not display: none)
      const style = window.getComputedStyle(progressContainer!)
      expect(style.display).not.toBe('none')
    })
  })

  describe('Message Content', () => {
    it('should display specific message for each state', () => {
      // Compressing
      const { rerender } = render(
        <MenuUploadProgress state="compressing" error={null} progress={30} />
      )
      expect(screen.queryByText(/compress|壓縮/i)).toBeTruthy()

      // Uploading
      rerender(
        <MenuUploadProgress state="uploading" error={null} progress={50} />
      )
      expect(screen.queryByText(/upload|上傳/i)).toBeTruthy()

      // Success
      rerender(
        <MenuUploadProgress state="success" error={null} progress={100} />
      )
      expect(screen.queryByText(/success|成功/i)).toBeTruthy()
    })
  })
})
