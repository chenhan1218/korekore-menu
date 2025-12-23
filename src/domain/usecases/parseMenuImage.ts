/**
 * Parse Menu Image UseCase
 *
 * This is a core business use case that:
 * 1. Takes a menu image (base64)
 * 2. Uses Gemini API (via port) to extract menu items
 * 3. Returns structured MenuData
 *
 * Framework-agnostic: Pure business logic
 */

import { MenuItem, MenuData, createMenuData } from '../entities';
import { GeminiPort } from '../ports';
import { AppError, ErrorCode } from '@/shared/types';

export interface ParseMenuImageUseCase {
  execute(imageBase64: string, language?: 'zh_TW' | 'en'): Promise<MenuData>;
}

/**
 * Factory function to create ParseMenuImageUseCase
 *
 * @param geminiPort - Gemini API port (dependency injection)
 * @param id - Menu document ID (optional, defaults to UUID)
 * @returns Use case instance
 *
 * @example
 * ```typescript
 * const useCase = createParseMenuImageUseCase(geminiAdapter)
 * const result = await useCase.execute(imageBase64)
 * ```
 */
export const createParseMenuImageUseCase = (
  geminiPort: GeminiPort,
  generateId: () => string = () => Math.random().toString(36).substring(7)
): ParseMenuImageUseCase => {
  return {
    async execute(imageBase64: string, language: 'zh_TW' | 'en' = 'zh_TW'): Promise<MenuData> {
      // Input validation
      if (!imageBase64 || imageBase64.length === 0) {
        throw new AppError(
          ErrorCode.INVALID_IMAGE_FORMAT,
          'Image data is empty',
          '圖片數據無效，請重試',
          false
        );
      }

      if (!language || !['zh_TW', 'en'].includes(language)) {
        throw new AppError(
          ErrorCode.INVALID_IMAGE_FORMAT,
          `Invalid language: ${language}`,
          '語言設置無效',
          false
        );
      }

      try {
        // Call Gemini API via port (abstracted dependency)
        const items: MenuItem[] = await geminiPort.parseImage(imageBase64, language);

        // Validate response
        if (!Array.isArray(items) || items.length === 0) {
          throw new AppError(
            ErrorCode.PARSE_ERROR,
            'No menu items found in image',
            'AI 無法識別菜單，請嘗試其他圖片',
            true
          );
        }

        // Create MenuData entity
        const menuData = createMenuData(
          generateId(),
          imageBase64, // Temporary: Will be replaced with Cloud Storage URL in Infrastructure layer
          items,
          language,
          new Date(),
          undefined,
          0.95 // Default confidence for initial parse
        );

        return menuData;
      } catch (error) {
        // Handle known errors
        if (error instanceof AppError) {
          throw error;
        }

        // Wrap unknown errors
        throw new AppError(
          ErrorCode.GEMINI_API_ERROR,
          error instanceof Error ? error.message : String(error),
          'AI 服務暫時不可用，請稍後重試',
          true
        );
      }
    },
  };
};
