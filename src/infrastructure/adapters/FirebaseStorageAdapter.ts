/**
 * Firebase Storage Adapter (Infrastructure Layer)
 *
 * Implements image upload to Firebase Cloud Storage.
 * Handles file validation, upload, and URL retrieval.
 */

import { getStorage, ref, uploadBytes, getDownloadURL, type FirebaseStorage } from 'firebase/storage'
import { initializeFirebase } from '@/infrastructure/config/firebase'
import { AppError, ErrorCode } from '@/shared/types'

const ALLOWED_TYPES = ['image/jpeg', 'image/png']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes
const STORAGE_BUCKET_PREFIX = 'menus'

/**
 * Firebase Storage Adapter for menu image uploads
 *
 * Handles:
 * - File validation (type, size)
 * - Upload to Firebase Cloud Storage
 * - URL retrieval from storage path
 */
export class FirebaseStorageAdapter {
  private storage: FirebaseStorage

  constructor(storage?: FirebaseStorage) {
    if (storage) {
      // Allow dependency injection for testing
      this.storage = storage
    } else {
      // Initialize Firebase if not already done
      const firebaseApp = initializeFirebase()
      this.storage = getStorage(firebaseApp)
    }
  }

  /**
   * Upload a menu image to Firebase Cloud Storage
   *
   * @param file - Image file to upload (JPG or PNG, max 10MB)
   * @returns Storage path (e.g., "menus/{timestamp}_{random}.jpg")
   * @throws AppError - When validation or upload fails
   *
   * @example
   * ```tsx
   * const adapter = new FirebaseStorageAdapter()
   * const storagePath = await adapter.uploadMenuImage(file)
   * const url = adapter.getImageUrl(storagePath)
   * ```
   */
  async uploadMenuImage(file: File): Promise<string> {
    try {
      // Validate file before uploading
      this.validateFile(file)

      // Generate unique storage path
      const storagePath = this.generateStoragePath(file.name)

      // Create reference to storage location
      const storageRef = ref(this.storage, storagePath)

      // Upload file to Firebase
      // In tests, ref and uploadBytes will be mocked
      await uploadBytes(storageRef, file, {
        contentType: file.type,
      })

      return storagePath
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }

      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new AppError(
        ErrorCode.UPLOAD_ERROR,
        `Failed to upload menu image: ${message}`,
        '菜單圖片上傳失敗，請檢查網路連線並重試',
        true
      )
    }
  }

  /**
   * Get download URL for an uploaded image
   *
   * @param storagePath - Storage path returned from uploadMenuImage
   * @returns HTTPS download URL
   *
   * @example
   * ```tsx
   * const url = adapter.getImageUrl('menus/1234567890_abc123.jpg')
   * ```
   */
  getImageUrl(storagePath: string): string {
    try {
      const storageRef = ref(this.storage, storagePath)
      // Note: This is synchronous in the Firebase SDK
      // For actual download URLs, use getDownloadURL() which is async
      return `https://storage.googleapis.com/${this.storage.bucket}/${storagePath}`
    } catch (error) {
      throw new AppError(
        ErrorCode.STORAGE_ERROR,
        `Failed to get image URL: ${error instanceof Error ? error.message : 'Unknown'}`,
        '無法獲取圖片 URL，請稍後重試',
        true
      )
    }
  }

  /**
   * Get download URL (async version for actual download)
   *
   * @param storagePath - Storage path returned from uploadMenuImage
   * @returns HTTPS download URL
   */
  async getDownloadUrl(storagePath: string): Promise<string> {
    try {
      const storageRef = ref(this.storage, storagePath)
      return await getDownloadURL(storageRef)
    } catch (error) {
      throw new AppError(
        ErrorCode.STORAGE_ERROR,
        `Failed to get download URL: ${error instanceof Error ? error.message : 'Unknown'}`,
        '無法獲取下載 URL，請稍後重試',
        true
      )
    }
  }

  /**
   * Validate file before upload
   *
   * @param file - File to validate
   * @throws AppError - When file is invalid
   */
  private validateFile(file: File): void {
    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new AppError(
        ErrorCode.INVALID_FILE_TYPE,
        `Invalid file type: ${file.type}. Allowed types: ${ALLOWED_TYPES.join(', ')}`,
        '只支援 JPG 和 PNG 格式的圖片',
        true
      )
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      const maxMB = MAX_FILE_SIZE / (1024 * 1024)
      throw new AppError(
        ErrorCode.FILE_TOO_LARGE,
        `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds ${maxMB}MB limit`,
        `圖片大小超過 ${maxMB}MB 限制`,
        true
      )
    }
  }

  /**
   * Generate unique storage path for file
   *
   * Format: menus/{timestamp}_{random}.{extension}
   *
   * @param fileName - Original file name
   * @returns Storage path
   */
  private generateStoragePath(fileName: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const extension = this.getFileExtension(fileName)

    return `${STORAGE_BUCKET_PREFIX}/${timestamp}_${random}.${extension}`
  }

  /**
   * Extract file extension from filename
   *
   * @param fileName - File name
   * @returns File extension (without dot)
   */
  private getFileExtension(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase()
    // Only allow jpg, jpeg, png
    if (ext === 'jpg' || ext === 'jpeg') return 'jpg'
    if (ext === 'png') return 'png'
    // Default to jpg if unknown
    return 'jpg'
  }
}
