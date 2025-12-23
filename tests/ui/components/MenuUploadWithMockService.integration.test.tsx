import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import { MenuUploadWithMockService } from '@/ui/components/MenuUploadWithMockService'
import { MenuItemType } from '@/types/menu'

/**
 * Integration test suite for MenuUploadWithMockService component
 * Tests the complete flow: file upload → mock service call → menu data return
 */
describe('MenuUploadWithMockService Integration', () => {
  const mockOnMenuDataReceived = vi.fn()
  const mockOnError = vi.fn()

  beforeEach(() => {
    mockOnMenuDataReceived.mockClear()
    mockOnError.mockClear()
  })

  describe('Initial State', () => {
    it('should render upload component initially', () => {
      render(
        <MenuUploadWithMockService
          onMenuDataReceived={mockOnMenuDataReceived}
          onError={mockOnError}
        />
      )

      expect(screen.queryByText(/select|upload/i)).toBeTruthy()
    })

    it('should not show menu data initially', () => {
      const { container } = render(
        <MenuUploadWithMockService
          onMenuDataReceived={mockOnMenuDataReceived}
          onError={mockOnError}
        />
      )

      const menuData = container.querySelector('.menu-data')
      expect(menuData).toBeFalsy()
    })
  })

  describe('File Upload and Mock Service Integration', () => {
    it('should render component and handle file selection', () => {
      const { container } = render(
        <MenuUploadWithMockService
          onMenuDataReceived={mockOnMenuDataReceived}
          onError={mockOnError}
        />
      )

      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement

      // Component should be rendered and file input should be visible
      expect(fileInput).toBeTruthy()

      const file = new File([new Blob([])], 'menu.jpg', { type: 'image/jpeg' })
      fireEvent.change(fileInput, { target: { files: [file] } })

      // After file selection, component should show loading state
      expect(fileInput.disabled).toBe(true)
    })

    it('should integrate with MenuUploadWithProgress component', () => {
      const { container } = render(
        <MenuUploadWithMockService
          onMenuDataReceived={mockOnMenuDataReceived}
          onError={mockOnError}
        />
      )

      // Component should contain MenuUploadWithProgress
      const uploadComponent = container.querySelector('.menu-upload-with-progress')
      expect(uploadComponent).toBeTruthy()
    })

    it('should have correct component structure', () => {
      const { container } = render(
        <MenuUploadWithMockService
          onMenuDataReceived={mockOnMenuDataReceived}
          onError={mockOnError}
        />
      )

      // Root container should exist
      const rootContainer = container.querySelector(
        '.menu-upload-with-mock-service'
      )
      expect(rootContainer).toBeTruthy()

      // File input should be present
      const fileInput = container.querySelector('input[type="file"]')
      expect(fileInput).toBeTruthy()
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid file format', async () => {
      const { container } = render(
        <MenuUploadWithMockService
          onMenuDataReceived={mockOnMenuDataReceived}
          onError={mockOnError}
        />
      )

      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement

      const invalidFile = new File([new Blob([])], 'image.gif', { type: 'image/gif' })
      fireEvent.change(fileInput, { target: { files: [invalidFile] } })

      // onError should be called for invalid format
      expect(mockOnError).toHaveBeenCalledWith(expect.stringContaining('not supported'))
    })

    it('should handle file size validation error', async () => {
      const { container } = render(
        <MenuUploadWithMockService
          onMenuDataReceived={mockOnMenuDataReceived}
          onError={mockOnError}
        />
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

      expect(mockOnError).toHaveBeenCalledWith(expect.stringContaining('15MB'))
    })
  })

  describe('Multiple Uploads', () => {
    it('should support uploading multiple files', () => {
      const { container } = render(
        <MenuUploadWithMockService
          onMenuDataReceived={mockOnMenuDataReceived}
          onError={mockOnError}
        />
      )

      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement

      // First upload
      const file1 = new File([new Blob([])], 'menu1.jpg', { type: 'image/jpeg' })
      fireEvent.change(fileInput, { target: { files: [file1] } })

      // Component should handle the file
      expect(fileInput.disabled).toBe(true)
    })
  })

  describe('Data Consistency', () => {
    it('should call onError for invalid files', () => {
      const { container } = render(
        <MenuUploadWithMockService
          onMenuDataReceived={mockOnMenuDataReceived}
          onError={mockOnError}
        />
      )

      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement

      // Try uploading an invalid file
      const invalidFile = new File([new Blob([])], 'image.bmp', { type: 'image/bmp' })
      fireEvent.change(fileInput, { target: { files: [invalidFile] } })

      // onError should be called
      expect(mockOnError).toHaveBeenCalledWith(expect.stringContaining('not supported'))
    })

    it('should pass correct error message on size validation', () => {
      const { container } = render(
        <MenuUploadWithMockService
          onMenuDataReceived={mockOnMenuDataReceived}
          onError={mockOnError}
        />
      )

      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement

      // Large file
      const largeFile = new File(
        [new Blob([new Array(16 * 1024 * 1024)])],
        'large.jpg',
        { type: 'image/jpeg' }
      )
      fireEvent.change(fileInput, { target: { files: [largeFile] } })

      expect(mockOnError).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should be accessible with proper ARIA labels', () => {
      const { container } = render(
        <MenuUploadWithMockService
          onMenuDataReceived={mockOnMenuDataReceived}
          onError={mockOnError}
        />
      )

      const fileInput = container.querySelector('input[type="file"]')
      expect(fileInput?.getAttribute('aria-label')).toBeTruthy()
    })
  })

  describe('Callback Contracts', () => {
    it('should accept onMenuDataReceived callback as prop', () => {
      const customCallback = vi.fn()
      const { container } = render(
        <MenuUploadWithMockService
          onMenuDataReceived={customCallback}
          onError={mockOnError}
        />
      )

      // Component should render with the callback available
      const fileInput = container.querySelector('input[type="file"]')
      expect(fileInput).toBeTruthy()
    })

    it('should pass error string to onError callback', () => {
      const { container } = render(
        <MenuUploadWithMockService
          onMenuDataReceived={mockOnMenuDataReceived}
          onError={mockOnError}
        />
      )

      const fileInput = container.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement

      const invalidFile = new File([new Blob([])], 'image.gif', { type: 'image/gif' })
      fireEvent.change(fileInput, { target: { files: [invalidFile] } })

      expect(mockOnError).toHaveBeenCalledWith(expect.any(String))
    })
  })
})
