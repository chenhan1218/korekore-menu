/**
 * MenuUploadWithMockService Component
 * Integrates file upload with mock menu data service
 *
 * Features:
 * - Handles file upload with progress feedback
 * - Calls mock menu service after successful upload
 * - Returns menu data through callback
 * - Error handling and retry capability
 */

import { useCallback } from 'react'
import { MenuUploadWithProgress } from './MenuUploadWithProgress'
import { mockMenuService } from '@/infrastructure/mockMenuService'
import { MenuItemType } from '@/types/menu'

interface MenuUploadWithMockServiceProps {
  onMenuDataReceived: (menuData: MenuItemType[]) => void
  onError: (error: string) => void
  disabled?: boolean
}

/**
 * MenuUploadWithMockService Component
 *
 * Complete upload component that integrates with mock menu service.
 * After successful file upload, fetches menu data and passes it to callback.
 *
 * @param onMenuDataReceived - Callback when menu data is successfully retrieved
 * @param onError - Callback when validation or service fails
 * @param disabled - Whether to disable the component
 */
export function MenuUploadWithMockService({
  onMenuDataReceived,
  onError,
  disabled = false,
}: MenuUploadWithMockServiceProps) {
  const handleUploadSuccess = useCallback(
    async (file: File) => {
      try {
        // Call mock menu service to get menu data
        const menuData = await mockMenuService.scanMenu(file)

        // Call success callback with menu data
        onMenuDataReceived(menuData)
      } catch (error) {
        // Handle mock service errors
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch menu data'
        onError(errorMessage)
      }
    },
    [onMenuDataReceived, onError]
  )

  const handleError = useCallback(
    (error: string) => {
      onError(error)
    },
    [onError]
  )

  return (
    <div className="menu-upload-with-mock-service">
      <MenuUploadWithProgress
        onSuccess={handleUploadSuccess}
        onError={handleError}
        disabled={disabled}
      />
    </div>
  )
}
