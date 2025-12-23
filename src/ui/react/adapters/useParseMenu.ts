/**
 * useParseMenu Hook (UI Adapter)
 *
 * React adapter that wraps the parseMenuImage UseCase
 * Bridges Domain logic with React state management
 *
 * Key point: The business logic is in Domain, this only handles React-specific concerns
 */

import { useState, useCallback } from 'react';
import { createParseMenuImageUseCase } from '@/domain/usecases';
import { MenuData } from '@/domain/entities';
import { AppError, ErrorCode } from '@/shared/types';
import { GeminiAdapter } from '@/infrastructure/adapters';

interface UseParseMenuResult {
  parse: (imageBase64: string, language?: 'zh_TW' | 'en') => Promise<MenuData | null>;
  loading: boolean;
  error: AppError | null;
  clearError: () => void;
}

/**
 * React Hook to parse menu images
 *
 * This hook:
 * 1. Wraps the Domain UseCase (createParseMenuImageUseCase)
 * 2. Manages React-specific state (loading, error)
 * 3. Provides convenient React callback
 *
 * Can be easily replaced with Vue Composable or other framework without touching Domain logic
 *
 * @returns Object with parse function and state
 *
 * @example
 * ```tsx
 * const { parse, loading, error } = useParseMenu()
 *
 * const handleUpload = async (imageBase64: string) => {
 *   const menu = await parse(imageBase64)
 *   if (menu) {
 *     // Handle success
 *   }
 * }
 * ```
 */
export const useParseMenu = (): UseParseMenuResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  // Create Use Case (dependency injection)
  // In production, this would be provided via Context or Props
  const geminiAdapter = new GeminiAdapter();
  const parseMenuUseCase = createParseMenuImageUseCase(geminiAdapter);

  const parse = useCallback(
    async (imageBase64: string, language: 'zh_TW' | 'en' = 'zh_TW'): Promise<MenuData | null> => {
      setLoading(true);
      setError(null);

      try {
        // Call Domain UseCase
        const menuData = await parseMenuUseCase.execute(imageBase64, language);
        return menuData;
      } catch (err) {
        const appError =
          err instanceof AppError
            ? err
            : new AppError(ErrorCode.UNKNOWN_ERROR, String(err), '發生未知錯誤，請重試');

        setError(appError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [parseMenuUseCase]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { parse, loading, error, clearError };
};

/**
 * Alternative: For Vue, the same logic would be:
 *
 * ```typescript
 * import { ref } from 'vue'
 *
 * export const useParseMenu = () => {
 *   const loading = ref(false)
 *   const error = ref<AppError | null>(null)
 *
 *   const geminiAdapter = new GeminiAdapter()
 *   const parseMenuUseCase = createParseMenuImageUseCase(geminiAdapter)
 *
 *   const parse = async (imageBase64: string, language: 'zh_TW' | 'en' = 'zh_TW') => {
 *     loading.value = true
 *     error.value = null
 *
 *     try {
 *       return await parseMenuUseCase.execute(imageBase64, language)
 *     } catch (err) {
 *       error.value = err instanceof AppError ? err : new AppError(...)
 *       return null
 *     } finally {
 *       loading.value = false
 *     }
 *   }
 *
 *   const clearError = () => {
 *     error.value = null
 *   }
 *
 *   return { parse, loading, error, clearError }
 * }
 * ```
 *
 * Notice: The business logic (UseCase logic) is 100% identical!
 * Only React/Vue specific state management differs.
 */
