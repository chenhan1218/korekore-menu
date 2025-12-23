import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MenuUploadInput } from '@/ui/components/MenuUploadInput'

/**
 * Test suite for MenuUploadInput component
 * Tests file selection, validation, and callbacks
 */
describe('MenuUploadInput Component', () => {
  const mockOnFileSelect = vi.fn()
  const mockOnError = vi.fn()

  beforeEach(() => {
    mockOnFileSelect.mockClear()
    mockOnError.mockClear()
  })

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      render(<MenuUploadInput onFileSelect={mockOnFileSelect} onError={mockOnError} />)
      expect(screen.queryByText(/upload|select/i)).toBeTruthy()
    })

    it('should render a file input element', () => {
      const { container } = render(
        <MenuUploadInput onFileSelect={mockOnFileSelect} onError={mockOnError} />
      )
      const input = container.querySelector('input[type="file"]')
      expect(input).toBeTruthy()
    })

    it('should accept only JPG and PNG files', () => {
      const { container } = render(
        <MenuUploadInput onFileSelect={mockOnFileSelect} onError={mockOnError} />
      )
      const input = container.querySelector('input[type="file"]') as HTMLInputElement
      expect(input?.accept).toContain('image/jpeg')
      expect(input?.accept).toContain('image/png')
    })
  })

  describe('File Selection and Validation', () => {
    it('should handle valid JPG file selection', async () => {
      const { container } = render(
        <MenuUploadInput onFileSelect={mockOnFileSelect} onError={mockOnError} />
      )
      const input = container.querySelector('input[type="file"]') as HTMLInputElement

      const file = new File([new Blob([])], 'photo.jpg', { type: 'image/jpeg' })
      fireEvent.change(input, { target: { files: [file] } })

      expect(mockOnFileSelect).toHaveBeenCalled()
      expect(mockOnError).not.toHaveBeenCalled()
    })

    it('should handle valid PNG file selection', async () => {
      const { container } = render(
        <MenuUploadInput onFileSelect={mockOnFileSelect} onError={mockOnError} />
      )
      const input = container.querySelector('input[type="file"]') as HTMLInputElement

      const file = new File([new Blob([])], 'menu.png', { type: 'image/png' })
      fireEvent.change(input, { target: { files: [file] } })

      expect(mockOnFileSelect).toHaveBeenCalled()
      expect(mockOnError).not.toHaveBeenCalled()
    })

    it('should reject GIF files', () => {
      const { container } = render(
        <MenuUploadInput onFileSelect={mockOnFileSelect} onError={mockOnError} />
      )
      const input = container.querySelector('input[type="file"]') as HTMLInputElement

      const file = new File([new Blob([])], 'image.gif', { type: 'image/gif' })
      fireEvent.change(input, { target: { files: [file] } })

      expect(mockOnError).toHaveBeenCalledWith(expect.stringContaining('not supported'))
      expect(mockOnFileSelect).not.toHaveBeenCalled()
    })

    it('should reject BMP files', () => {
      const { container } = render(
        <MenuUploadInput onFileSelect={mockOnFileSelect} onError={mockOnError} />
      )
      const input = container.querySelector('input[type="file"]') as HTMLInputElement

      const file = new File([new Blob([])], 'image.bmp', { type: 'image/bmp' })
      fireEvent.change(input, { target: { files: [file] } })

      expect(mockOnError).toHaveBeenCalled()
      expect(mockOnFileSelect).not.toHaveBeenCalled()
    })

    it('should reject files larger than 15MB', () => {
      const { container } = render(
        <MenuUploadInput onFileSelect={mockOnFileSelect} onError={mockOnError} />
      )
      const input = container.querySelector('input[type="file"]') as HTMLInputElement

      // Create a file larger than 15MB
      const largeFile = new File(
        [new Blob([new Array(16 * 1024 * 1024)])],
        'huge.jpg',
        { type: 'image/jpeg' }
      )
      fireEvent.change(input, { target: { files: [largeFile] } })

      expect(mockOnError).toHaveBeenCalledWith(expect.stringContaining('15MB'))
      expect(mockOnFileSelect).not.toHaveBeenCalled()
    })

    it('should accept files exactly 15MB', () => {
      const { container } = render(
        <MenuUploadInput onFileSelect={mockOnFileSelect} onError={mockOnError} />
      )
      const input = container.querySelector('input[type="file"]') as HTMLInputElement

      const maxFile = new File(
        [new Blob([new Array(15 * 1024 * 1024)])],
        'max.jpg',
        { type: 'image/jpeg' }
      )
      fireEvent.change(input, { target: { files: [maxFile] } })

      expect(mockOnFileSelect).toHaveBeenCalled()
      expect(mockOnError).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling and Messages', () => {
    it('should pass correct file to onFileSelect callback', () => {
      const { container } = render(
        <MenuUploadInput onFileSelect={mockOnFileSelect} onError={mockOnError} />
      )
      const input = container.querySelector('input[type="file"]') as HTMLInputElement

      const file = new File([new Blob([])], 'menu.jpg', { type: 'image/jpeg' })
      fireEvent.change(input, { target: { files: [file] } })

      expect(mockOnFileSelect).toHaveBeenCalledWith(expect.any(File))
      const passedFile = mockOnFileSelect.mock.calls[0][0] as File
      expect(passedFile.name).toBe('menu.jpg')
      expect(passedFile.type).toBe('image/jpeg')
    })

    it('should pass descriptive error message on validation failure', () => {
      const { container } = render(
        <MenuUploadInput onFileSelect={mockOnFileSelect} onError={mockOnError} />
      )
      const input = container.querySelector('input[type="file"]') as HTMLInputElement

      const file = new File([new Blob([])], 'image.gif', { type: 'image/gif' })
      fireEvent.change(input, { target: { files: [file] } })

      expect(mockOnError).toHaveBeenCalledWith(expect.any(String))
      const errorMsg = mockOnError.mock.calls[0][0] as string
      expect(errorMsg.length).toBeGreaterThan(0)
    })

    it('should not call callbacks when no file is selected', () => {
      const { container } = render(
        <MenuUploadInput onFileSelect={mockOnFileSelect} onError={mockOnError} />
      )
      const input = container.querySelector('input[type="file"]') as HTMLInputElement

      fireEvent.change(input, { target: { files: [] } })

      expect(mockOnFileSelect).not.toHaveBeenCalled()
      expect(mockOnError).not.toHaveBeenCalled()
    })
  })

  describe('UI State and Feedback', () => {
    it('should be disabled prop respected when provided', () => {
      const { container } = render(
        <MenuUploadInput
          onFileSelect={mockOnFileSelect}
          onError={mockOnError}
          disabled={true}
        />
      )
      const input = container.querySelector('input[type="file"]') as HTMLInputElement

      expect(input?.disabled).toBe(true)
    })

    it('should show loading state when isLoading prop is true', () => {
      const { rerender, container } = render(
        <MenuUploadInput
          onFileSelect={mockOnFileSelect}
          onError={mockOnError}
          isLoading={false}
        />
      )

      rerender(
        <MenuUploadInput
          onFileSelect={mockOnFileSelect}
          onError={mockOnError}
          isLoading={true}
        />
      )

      // Check if loading indicator exists
      expect(container.querySelector('.loading, [data-testid="loading"]')).toBeTruthy()
    })

    it('should display error message when provided', () => {
      render(
        <MenuUploadInput
          onFileSelect={mockOnFileSelect}
          onError={mockOnError}
          errorMessage="Upload failed"
        />
      )

      expect(screen.queryByText(/Upload failed/)).toBeTruthy()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      const { container } = render(
        <MenuUploadInput onFileSelect={mockOnFileSelect} onError={mockOnError} />
      )
      const input = container.querySelector('input[type="file"]')

      expect(input?.getAttribute('aria-label')).toBeTruthy()
    })

    it('should be keyboard accessible', () => {
      const { container } = render(
        <MenuUploadInput onFileSelect={mockOnFileSelect} onError={mockOnError} />
      )
      const input = container.querySelector('input[type="file"]') as HTMLInputElement

      expect(input?.tabIndex).toBeGreaterThanOrEqual(-1)
    })
  })

  describe('Integration Tests', () => {
    it('should handle file selection and call both callbacks appropriately', () => {
      const { container } = render(
        <MenuUploadInput onFileSelect={mockOnFileSelect} onError={mockOnError} />
      )
      const input = container.querySelector('input[type="file"]') as HTMLInputElement

      // Select valid file
      const file = new File([new Blob([])], 'menu.jpg', { type: 'image/jpeg' })
      fireEvent.change(input, { target: { files: [file] } })

      expect(mockOnFileSelect).toHaveBeenCalledTimes(1)
      expect(mockOnError).not.toHaveBeenCalled()

      // Reset mocks
      mockOnFileSelect.mockClear()
      mockOnError.mockClear()

      // Select invalid file
      const invalidFile = new File([new Blob([])], 'image.gif', { type: 'image/gif' })
      fireEvent.change(input, { target: { files: [invalidFile] } })

      expect(mockOnFileSelect).not.toHaveBeenCalled()
      expect(mockOnError).toHaveBeenCalledTimes(1)
    })
  })
})
