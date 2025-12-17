/**
 * Menu-related type definitions
 */

/**
 * Single menu item extracted from a menu image
 */
export interface MenuItem {
  id: string // Unique identifier (UUID or similar)
  name: string // Original menu item name (e.g., 天婦羅)
  name_zh_TW: string // Traditional Chinese translation + brief taste description
  price: string // Price in original format (e.g., ¥1500)
  description?: string // Optional additional description
  image?: string // Optional image URL for the dish
}

/**
 * Complete menu data with metadata
 */
export interface MenuData {
  id: string // Firestore document ID
  imageUrl: string // URL to the uploaded menu image (Cloud Storage)
  items: MenuItem[]
  originalLanguage: string // Language of the original menu
  uploadedAt: Date // Upload timestamp
  notes?: string // Optional user notes
  confidence?: number // AI parsing confidence (0-1)
}

/**
 * Menu data storage for local/Firebase operations
 */
export interface MenuDataDTO extends Omit<MenuData, 'uploadedAt'> {
  uploadedAt: string // ISO string for serialization
}

/**
 * Parsed menu response from Gemini API
 */
export interface ParsedMenuResponse {
  items: MenuItem[]
  metadata: {
    parsedAt: string // ISO timestamp
    confidence: number // AI confidence level (0-1)
    language: string // Detected or target language
  }
}

/**
 * Menu ordering state
 */
export interface OrderState {
  menuId: string
  selectedItemIds: string[]
  notes?: string
}

/**
 * Language type definition
 */
export type Language = 'zh_TW' | 'en'
