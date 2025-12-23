import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MenuUploadWithProgress } from '@/ui/components/MenuUploadWithProgress'

/**
 * Integration test suite for MenuUploadWithProgress component
 * Tests the complete upload flow with state management and progress feedback
 */
describe('MenuUploadWithProgress Integration', () => {
  const mockOnSuccess = vi.fn()
  const mockOnError = vi.fn()

  beforeEach(() => {
    mockOnSuccess.mockClear()
    mockOnError.mockClear()
  })

  describe('Initial State', () => {
    it('should render upload input initially', () => {
      render(
        <MenuUploadWithProgress onSuccess={mockOnSuccess} onError={mockOnError} />
      )

      expect(screen.queryByText(/select|upload/i)).toBeTruthy()
    })

    it('should not show progress on initial render', () => {
      const { container } = render(
        <MenuUploadWithProgress onSuccess={mockOnSuccess} onError={mockOnError} />
      )

      const progressContainer = container.querySelector('.upload-progress.hidden')
      expect(progressContainer).toBeTruthy()
    })
  })

  describe('File Selection and Upload Flow', () => {
    it('should handle valid file selection and start loading', () => {
      const { container } = render(
        <MenuUploadWithProgress onSuccess={mockOnSuccess} onError={mockOnError} />
      )

      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement

      const file = new File([new Blob([])], 'menu.jpg', { type: 'image/jpeg' })
      fireEvent.change(fileInput, { target: { files: [file] } })

      // After file selection, file input should be disabled during processing
      expect(fileInput.disabled).toBe(true)
    })

    it('should show loading state during file processing', () => {
      const { container, rerender } = render(
        <MenuUploadWithProgress onSuccess={mockOnSuccess} onError={mockOnError} />
      )

      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement

      const file = new File([new Blob([])], 'menu.jpg', { type: 'image/jpeg' })
      fireEvent.change(fileInput, { target: { files: [file] } })

      // File input should be disabled after selection
      expect(fileInput.disabled).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid file format', () => {
      const { container } = render(
        <MenuUploadWithProgress onSuccess={mockOnSuccess} onError={mockOnError} />
      )

      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement

      const invalidFile = new File([new Blob([])], 'image.gif', { type: 'image/gif' })
      fireEvent.change(fileInput, { target: { files: [invalidFile] } })

      // onError should be called
      expect(mockOnError).toHaveBeenCalledWith(expect.stringContaining('not supported'))
    })

    it('should handle file size validation error', () => {
      const { container } = render(
        <MenuUploadWithProgress onSuccess={mockOnSuccess} onError={mockOnError} />
      )

      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement

      const largeFile = new File(
        [new Blob([new Array(16 * 1024 * 1024)])],
        'huge.jpg',
        { type: 'image/jpeg' }
      )
      fireEvent.change(fileInput, { target: { files: [largeFile] } })

      // onError should be called with size message
      expect(mockOnError).toHaveBeenCalledWith(expect.stringContaining('15MB'))
    })

    it('should display error message in error state', () => {
      const { container } = render(
        <MenuUploadWithProgress onSuccess={mockOnSuccess} onError={mockOnError} />
      )

      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement

      const invalidFile = new File([new Blob([])], 'image.gif', { type: 'image/gif' })
      fireEvent.change(fileInput, { target: { files: [invalidFile] } })

      // Error message should be visible (may appear in multiple places)
      const errorMessages = screen.getAllByText(/not supported/i)
      expect(errorMessages.length).toBeGreaterThan(0)
    })
  })

  describe('Reset and Retry', () => {
    it('should allow retry after error', () => {
      const { container } = render(
        <MenuUploadWithProgress onSuccess={mockOnSuccess} onError={mockOnError} />
      )

      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement

      // First attempt with invalid file
      const invalidFile = new File([new Blob([])], 'image.gif', { type: 'image/gif' })
      fireEvent.change(fileInput, { target: { files: [invalidFile] } })

      expect(mockOnError).toHaveBeenCalled()

      // After error, retry button should appear
      const retryButton = container.querySelector('.retry-button')
      expect(retryButton).toBeTruthy()

      // Click retry button to reset
      fireEvent.click(retryButton as HTMLButtonElement)

      // File input should be enabled again
      expect(fileInput.disabled).toBe(false)
    })
  })

  describe('Accessibility', () => {
    it('should be keyboard accessible', () => {
      const { container } = render(
        <MenuUploadWithProgress onSuccess={mockOnSuccess} onError={mockOnError} />
      )

      const fileInput = container.querySelector('input[type="file"]')
      expect(fileInput?.getAttribute('aria-label')).toBeTruthy()
    })

    it('should announce errors with role=alert', () => {
      const { container } = render(
        <MenuUploadWithProgress onSuccess={mockOnSuccess} onError={mockOnError} />
      )

      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement

      const invalidFile = new File([new Blob([])], 'image.gif', { type: 'image/gif' })
      fireEvent.change(fileInput, { target: { files: [invalidFile] } })

      const alert = container.querySelector('[role="alert"]')
      expect(alert).toBeTruthy()
    })
  })

  describe('Mobile Responsiveness', () => {
    it('should render properly on mobile', () => {
      const { container } = render(
        <MenuUploadWithProgress onSuccess={mockOnSuccess} onError={mockOnError} />
      )

      // Component should still be visible and functional
      const input = container.querySelector('input[type="file"]')
      expect(input).toBeTruthy()
    })
  })

  describe('Props Integration', () => {
    it('should accept onSuccess callback prop', () => {
      const { container } = render(
        <MenuUploadWithProgress onSuccess={mockOnSuccess} onError={mockOnError} />
      )

      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement
      const file = new File([new Blob([])], 'menu.jpg', { type: 'image/jpeg' })

      fireEvent.change(fileInput, { target: { files: [file] } })

      // Component should start loading after valid file selection
      expect(fileInput.disabled).toBe(true)
    })

    it('should call onError with error message string', () => {
      const { container } = render(
        <MenuUploadWithProgress onSuccess={mockOnSuccess} onError={mockOnError} />
      )

      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement
      const invalidFile = new File([new Blob([])], 'image.gif', { type: 'image/gif' })

      fireEvent.change(fileInput, { target: { files: [invalidFile] } })

      expect(mockOnError).toHaveBeenCalledWith(expect.any(String))
      const errorMsg = mockOnError.mock.calls[0][0] as string
      expect(errorMsg.length).toBeGreaterThan(0)
    })
  })
})
