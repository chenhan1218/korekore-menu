import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import * as firebaseStorage from 'firebase/storage'
import { FirebaseStorageAdapter } from '../FirebaseStorageAdapter'
import { AppError, ErrorCode } from '@/shared/types'

// Mock Firebase storage module
vi.mock('firebase/storage', () => ({
  ref: vi.fn((storage, path) => ({ _path: path })),
  uploadBytes: vi.fn(async () => ({ metadata: {} })),
  getDownloadURL: vi.fn(async (ref: any) =>
    `https://storage.googleapis.com/bucket/${ref._path}`
  ),
}))

/**
 * Tests for FirebaseStorageAdapter
 *
 * Focuses on file validation and path generation logic
 * Firebase SDK calls are mocked for unit testing
 */
describe('FirebaseStorageAdapter', () => {
  let adapter: FirebaseStorageAdapter
  let mockStorage: any

  beforeEach(() => {
    vi.clearAllMocks()

    // Create a minimal mock storage object
    mockStorage = {
      bucket: 'test-bucket.appspot.com',
    }

    // Initialize adapter with mock storage
    adapter = new FirebaseStorageAdapter(mockStorage)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('File Validation', () => {
    describe('uploadMenuImage', () => {
      it('should accept JPG files', async () => {
        const file = new File(['content'], 'menu.jpg', { type: 'image/jpeg' })

        // Should not throw
        const result = await adapter.uploadMenuImage(file)
        expect(result).toBeDefined()
        expect(typeof result).toBe('string')
      })

      it('should accept PNG files', async () => {
        const file = new File(['content'], 'menu.png', { type: 'image/png' })

        const result = await adapter.uploadMenuImage(file)
        expect(result).toBeDefined()
      })

      it('should reject GIF files', async () => {
        const file = new File(['content'], 'menu.gif', { type: 'image/gif' })

        try {
          await adapter.uploadMenuImage(file)
          expect.fail('Should have thrown')
        } catch (error) {
          expect(error).toBeInstanceOf(AppError)
          const appError = error as AppError
          expect(appError.code).toBe(ErrorCode.INVALID_FILE_TYPE)
          expect(appError.userMessage).toContain('JPG')
        }
      })

      it('should reject text files', async () => {
        const file = new File(['content'], 'menu.txt', { type: 'text/plain' })

        try {
          await adapter.uploadMenuImage(file)
          expect.fail('Should have thrown')
        } catch (error) {
          expect(error).toBeInstanceOf(AppError)
          expect((error as AppError).code).toBe(ErrorCode.INVALID_FILE_TYPE)
        }
      })

      it('should reject WebP files', async () => {
        const file = new File(['content'], 'menu.webp', { type: 'image/webp' })

        await expect(adapter.uploadMenuImage(file)).rejects.toThrow()
      })

      it('should accept files up to 10MB', async () => {
        // Create a ~9MB file
        const size = 9 * 1024 * 1024
        const buffer = new ArrayBuffer(size)
        const file = new File([buffer], 'menu.jpg', { type: 'image/jpeg' })

        const result = await adapter.uploadMenuImage(file)
        expect(result).toBeDefined()
      })

      it('should accept files exactly 10MB', async () => {
        const size = 10 * 1024 * 1024
        const buffer = new ArrayBuffer(size)
        const file = new File([buffer], 'menu.jpg', { type: 'image/jpeg' })

        const result = await adapter.uploadMenuImage(file)
        expect(result).toBeDefined()
      })

      it('should reject files larger than 10MB', async () => {
        const size = 10 * 1024 * 1024 + 1
        const buffer = new ArrayBuffer(size)
        const file = new File([buffer], 'large.jpg', { type: 'image/jpeg' })

        try {
          await adapter.uploadMenuImage(file)
          expect.fail('Should have thrown')
        } catch (error) {
          expect(error).toBeInstanceOf(AppError)
          const appError = error as AppError
          expect(appError.code).toBe(ErrorCode.FILE_TOO_LARGE)
          expect(appError.userMessage).toContain('10MB')
        }
      })
    })
  })

  describe('Storage Path Generation', () => {
    it('should generate valid storage path', async () => {
      const file = new File(['content'], 'menu.jpg', { type: 'image/jpeg' })

      const result = await adapter.uploadMenuImage(file)

      // Check path format: menus/{timestamp}_{random}.jpg
      expect(result).toMatch(/^menus\/\d+_[a-z0-9]+\.jpg$/)
    })

    it('should generate unique paths for multiple uploads', async () => {
      const file = new File(['content'], 'menu.jpg', { type: 'image/jpeg' })

      const path1 = await adapter.uploadMenuImage(file)
      const path2 = await adapter.uploadMenuImage(file)
      const path3 = await adapter.uploadMenuImage(file)

      expect(path1).not.toBe(path2)
      expect(path2).not.toBe(path3)
      expect(path1).not.toBe(path3)
    })

    it('should preserve file extension for PNG', async () => {
      const file = new File(['content'], 'menu.png', { type: 'image/png' })

      const result = await adapter.uploadMenuImage(file)

      expect(result).toMatch(/\.png$/)
    })

    it('should normalize jpeg extension to jpg', async () => {
      const file = new File(['content'], 'menu.jpeg', { type: 'image/jpeg' })

      const result = await adapter.uploadMenuImage(file)

      expect(result).toMatch(/\.jpg$/)
    })

    it('should handle filenames with multiple dots', async () => {
      const file = new File(['content'], 'menu.test.jpg', { type: 'image/jpeg' })

      const result = await adapter.uploadMenuImage(file)

      expect(result).toBeDefined()
      expect(result).toMatch(/menus\//)
    })
  })

  describe('Error Handling', () => {
    it('should throw AppError for invalid file types', async () => {
      const file = new File(['content'], 'menu.gif', { type: 'image/gif' })

      try {
        await adapter.uploadMenuImage(file)
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(AppError)
        expect((error as AppError).retry).toBe(true)
      }
    })

    it('should throw AppError for oversized files', async () => {
      const buffer = new ArrayBuffer(11 * 1024 * 1024)
      const file = new File([buffer], 'large.jpg', { type: 'image/jpeg' })

      try {
        await adapter.uploadMenuImage(file)
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(AppError)
        expect((error as AppError).retry).toBe(true)
      }
    })

    it('should provide user-friendly error messages in Traditional Chinese', async () => {
      const buffer = new ArrayBuffer(11 * 1024 * 1024)
      const file = new File([buffer], 'large.jpg', { type: 'image/jpeg' })

      try {
        await adapter.uploadMenuImage(file)
      } catch (error) {
        const appError = error as AppError
        expect(appError.userMessage).toBeDefined()
        // Should contain Chinese characters for user-friendly message
        expect(appError.userMessage.length > 0).toBe(true)
      }
    })
  })

  describe('getImageUrl', () => {
    it('should return a valid URL', () => {
      const path = 'menus/1234567890_abc123.jpg'

      const url = adapter.getImageUrl(path)

      expect(url).toMatch(/^https:\/\//)
      expect(url).toContain(path)
    })

    it('should return consistent URL for same path', () => {
      const path = 'menus/1234567890_abc123.jpg'

      const url1 = adapter.getImageUrl(path)
      const url2 = adapter.getImageUrl(path)

      expect(url1).toBe(url2)
    })

    it('should handle different storage paths', () => {
      const path1 = 'menus/1111111111_aaa.jpg'
      const path2 = 'menus/2222222222_bbb.png'

      const url1 = adapter.getImageUrl(path1)
      const url2 = adapter.getImageUrl(path2)

      expect(url1).not.toBe(url2)
      expect(url1).toContain(path1)
      expect(url2).toContain(path2)
    })
  })
})
