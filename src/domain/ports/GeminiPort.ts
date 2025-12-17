/**
 * Gemini Port (Abstract Interface)
 *
 * Defines the contract for parsing menu images using Gemini API.
 * This interface is framework-agnostic and part of the Domain layer.
 * The actual implementation lives in Infrastructure layer (GeminiAdapter).
 */

import { MenuItem } from '../entities/MenuItem'

export interface GeminiPort {
  /**
   * Parse a menu image and extract menu items
   *
   * @param imageBase64 - Base64 encoded image data
   * @param language - Target language for parsing ('zh_TW' | 'en')
   * @returns Array of parsed menu items
   * @throws AppError - When parsing fails
   */
  parseImage(
    imageBase64: string,
    language?: 'zh_TW' | 'en'
  ): Promise<MenuItem[]>
}
