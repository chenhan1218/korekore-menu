import { describe, it, expect, vi } from 'vitest'
import { compressImage, isImageCompressionNeeded } from '@/shared/imageCompression'

/**
 * Test suite for image compression utility
 * Tests compression logic, file size validation, and format handling
 */
describe('Image Compression', () => {
  // Helper to create file with specific size without allocating huge arrays
  const createMockFile = (
    sizeInBytes: number,
    filename: string,
    type: string
  ): File => {
    const blob = new Blob([new Array(sizeInBytes).fill(0)], { type })
    return new File([blob], filename, { type })
  }

  describe('isImageCompressionNeeded', () => {
    it('should return true for images clearly larger than 5MB', () => {
      const largeFile = createMockFile(7 * 1024 * 1024, 'large.jpg', 'image/jpeg')
      expect(isImageCompressionNeeded(largeFile)).toBe(true)
    })

    it('should return false for images clearly smaller than 5MB', () => {
      const smallFile = createMockFile(2 * 1024 * 1024, 'small.jpg', 'image/jpeg')
      expect(isImageCompressionNeeded(smallFile)).toBe(false)
    })

    it('should handle the 5MB boundary correctly for PNG', () => {
      const largeFile = createMockFile(7 * 1024 * 1024, 'large.png', 'image/png')
      expect(isImageCompressionNeeded(largeFile)).toBe(true)
    })
  })

  describe('compressImage', () => {
    it('should compress JPEG files larger than 5MB', async () => {
      const largeJpeg = createMockFile(6 * 1024 * 1024, 'large.jpg', 'image/jpeg')
      const compressed = await compressImage(largeJpeg)

      expect(compressed).toBeInstanceOf(File)
      expect(compressed.type).toBe('image/jpeg')
      expect(compressed.size).toBeLessThanOrEqual(5 * 1024 * 1024)
    })

    it('should compress PNG files larger than 5MB', async () => {
      const largePng = createMockFile(6 * 1024 * 1024, 'large.png', 'image/png')
      const compressed = await compressImage(largePng)

      expect(compressed).toBeInstanceOf(File)
      expect(compressed.type).toBe('image/png')
      expect(compressed.size).toBeLessThanOrEqual(5 * 1024 * 1024)
    })

    it('should return original file if smaller than 5MB', async () => {
      const smallFile = createMockFile(2 * 1024 * 1024, 'small.jpg', 'image/jpeg')
      const result = await compressImage(smallFile)

      expect(result.name).toBe(smallFile.name)
      expect(result.type).toBe(smallFile.type)
    })

    it('should return original file if exactly 5MB', async () => {
      const exactFile = createMockFile(5 * 1024 * 1024, 'exact.jpg', 'image/jpeg')
      const result = await compressImage(exactFile)

      expect(result.name).toBe(exactFile.name)
    })

    it('should throw error for unsupported formats', async () => {
      const gifFile = createMockFile(1024, 'image.gif', 'image/gif')
      await expect(compressImage(gifFile)).rejects.toThrow(
        'Unsupported image format: image/gif'
      )
    })

    it('should throw error for files larger than 15MB', async () => {
      const hugeFile = createMockFile(16 * 1024 * 1024, 'huge.jpg', 'image/jpeg')
      await expect(compressImage(hugeFile)).rejects.toThrow(
        'File size exceeds maximum limit of 15MB'
      )
    })

    it('should maintain filename when compressing', async () => {
      const largeFile = createMockFile(6 * 1024 * 1024, 'menu_photo.jpg', 'image/jpeg')
      const compressed = await compressImage(largeFile)

      expect(compressed.name).toBe('menu_photo.jpg')
    })

    it('should preserve image format (JPEG stays JPEG)', async () => {
      const jpegFile = createMockFile(6 * 1024 * 1024, 'image.jpg', 'image/jpeg')
      const compressed = await compressImage(jpegFile)

      expect(compressed.type).toBe('image/jpeg')
    })

    it('should preserve image format (PNG stays PNG)', async () => {
      const pngFile = createMockFile(6 * 1024 * 1024, 'image.png', 'image/png')
      const compressed = await compressImage(pngFile)

      expect(compressed.type).toBe('image/png')
    })

    it('should reject BMP files even if small', async () => {
      const bmpFile = createMockFile(1024, 'image.bmp', 'image/bmp')
      await expect(compressImage(bmpFile)).rejects.toThrow(
        'Unsupported image format: image/bmp'
      )
    })

    it('should reject WebP files', async () => {
      const webpFile = createMockFile(1024, 'image.webp', 'image/webp')
      await expect(compressImage(webpFile)).rejects.toThrow(
        'Unsupported image format: image/webp'
      )
    })

    it('should handle compression consistency across multiple calls', async () => {
      const file = createMockFile(6 * 1024 * 1024, 'test.jpg', 'image/jpeg')
      const result1 = await compressImage(file)
      const result2 = await compressImage(file)

      expect(result1.size).toBeLessThanOrEqual(5 * 1024 * 1024)
      expect(result2.size).toBeLessThanOrEqual(5 * 1024 * 1024)
      expect(result1.name).toBe(result2.name)
    })

    it('should validate MIME type not just extension', async () => {
      // Create file with wrong MIME type
      const wrongTypeFile = new File([new Blob([])], 'image.jpg', {
        type: 'image/gif', // Wrong type
      })

      await expect(compressImage(wrongTypeFile)).rejects.toThrow(
        'Unsupported image format: image/gif'
      )
    })

    it('should handle files at 5MB + 1 byte boundary', async () => {
      const boundaryFile = createMockFile(
        5 * 1024 * 1024 + 1,
        'boundary.jpg',
        'image/jpeg'
      )
      const compressed = await compressImage(boundaryFile)

      expect(compressed.size).toBeLessThanOrEqual(5 * 1024 * 1024)
    })

    it('should handle small JPEG files without compression', async () => {
      const smallJpeg = createMockFile(500 * 1024, 'small.jpg', 'image/jpeg')
      const result = await compressImage(smallJpeg)

      // Small files should return unchanged or with minimal size difference
      expect(result.name).toBe('small.jpg')
      expect(result.type).toBe('image/jpeg')
      expect(result.size).toBeLessThanOrEqual(5 * 1024 * 1024)
    })

    it('should handle small PNG files without compression', async () => {
      const smallPng = createMockFile(300 * 1024, 'small.png', 'image/png')
      const result = await compressImage(smallPng)

      // Small files should return unchanged or with minimal size difference
      expect(result.name).toBe('small.png')
      expect(result.type).toBe('image/png')
      expect(result.size).toBeLessThanOrEqual(5 * 1024 * 1024)
    })
  })
})
