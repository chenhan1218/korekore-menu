/**
 * API request/response type definitions
 */

import { MenuItem, ParsedMenuResponse } from './menu'

/**
 * Gemini API response structure
 */
export interface GeminiApiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string
      }>
    }
  }>
  error?: {
    code: number
    message: string
    status: string
  }
}

/**
 * Generic API error response
 */
export interface ApiErrorResponse {
  code: string
  message: string
  details?: Record<string, unknown>
}

/**
 * Generic API success response wrapper
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiErrorResponse
}

/**
 * Menu parsing request payload
 */
export interface MenuParseRequest {
  imageBase64: string
  language: 'zh_TW' | 'en'
  context?: string // Optional additional context for parsing
}

/**
 * Menu parsing response
 */
export interface MenuParseResponse extends ParsedMenuResponse {
  rawResponse?: string // Raw response from Gemini for debugging
}

/**
 * Firestore menu document type
 */
export interface FirestoreMenuDoc {
  imageUrl: string
  items: MenuItem[]
  originalLanguage: string
  uploadedAt: Date
  notes?: string
  confidence?: number
}

/**
 * User profile in Firebase
 */
export interface UserProfile {
  uid: string
  email?: string
  language: 'zh_TW' | 'en'
  createdAt: Date
  lastUpdatedAt: Date
  isAnonymous: boolean
}
