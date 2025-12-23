/**
 * Error types and error handling utilities
 * Shared across all layers (Domain, Infrastructure, UI)
 */

export enum ErrorCode {
  // Image-related errors
  INVALID_IMAGE_FORMAT = 'INVALID_IMAGE_FORMAT',
  IMAGE_SIZE_EXCEEDED = 'IMAGE_SIZE_EXCEEDED',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',

  // Upload errors
  UPLOAD_ERROR = 'UPLOAD_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',

  // API errors
  GEMINI_API_ERROR = 'GEMINI_API_ERROR',
  FIREBASE_ERROR = 'FIREBASE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',

  // Parsing errors
  PARSE_ERROR = 'PARSE_ERROR',

  // Authentication errors
  AUTH_ERROR = 'AUTH_ERROR',

  // Unknown errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Application-wide error class with user-friendly messages
 */
export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public userMessage: string, // Message to display to user
    public retry: boolean = false // Whether the operation can be retried
  ) {
    super(message)
    this.name = 'AppError'
  }
}

/**
 * Type guard to check if an error is an AppError
 */
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError
}

/**
 * Convert any error to AppError
 */
export const toAppError = (error: unknown): AppError => {
  if (isAppError(error)) {
    return error
  }

  const message = error instanceof Error ? error.message : String(error)
  return new AppError(
    ErrorCode.UNKNOWN_ERROR,
    message,
    '發生未知錯誤，請重試',
    true
  )
}
