/**
 * MenuScanPage Component
 * Main page for menu scanning functionality
 *
 * Integrates:
 * - File upload with progress feedback
 * - Menu display with item cards
 * - Item selection and variant selection
 * - Menu state management via Zustand store
 */

import { useState, useCallback } from 'react'
import { MenuUploadWithMockService } from '@/ui/components/MenuUploadWithMockService'
import { MenuList } from '@/ui/components/MenuList'
import { useMenuStore } from '@/domain/stores/menuStore'
import type { MenuItemType } from '@/types/menu'

interface MenuScanPageState {
  isLoading: boolean
  error: string | null
  menuData: MenuItemType[] | null
}

/**
 * MenuScanPage Component
 *
 * Complete page for menu scanning workflow:
 * 1. Upload menu image
 * 2. Display parsed menu items
 * 3. Allow user to select items and variants
 *
 * @returns React component
 */
export function MenuScanPage() {
  // Local state for upload and menu data
  const [pageState, setPageState] = useState<MenuScanPageState>({
    isLoading: false,
    error: null,
    menuData: null,
  })

  // Global state for selected items
  const selectedItemIds = useMenuStore((state) => state.selectedItemIds)
  const selectedVariants = useMenuStore((state) => state.selectedVariants)
  const toggleSelectItem = useMenuStore((state) => state.toggleSelectItem)
  const selectVariant = useMenuStore((state) => state.selectVariant)

  /**
   * Handle successful menu data retrieval
   */
  const handleMenuDataReceived = useCallback((menuData: MenuItemType[]) => {
    setPageState({
      isLoading: false,
      error: null,
      menuData,
    })
  }, [])

  /**
   * Handle upload or service errors
   */
  const handleError = useCallback((error: string) => {
    setPageState((prev) => ({
      ...prev,
      isLoading: false,
      error,
    }))
  }, [])

  /**
   * Handle item selection/deselection
   */
  const handleSelectItem = useCallback(
    (itemId: string, selected: boolean) => {
      toggleSelectItem(itemId, selected)
    },
    [toggleSelectItem]
  )

  /**
   * Handle variant selection
   */
  const handleSelectVariant = useCallback(
    (itemId: string, variant: any) => {
      selectVariant(itemId, variant)
    },
    [selectVariant]
  )

  return (
    <div
      data-testid="menu-scan-page"
      className="min-h-screen bg-gradient-to-b from-orange-50 to-white p-4 md:p-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            KoreKore
          </h1>
          <p className="text-gray-600">日本餐廳菜單翻譯工具</p>
        </header>

        {/* Upload Section */}
        {!pageState.menuData ? (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              上傳菜單
            </h2>

            {pageState.error && (
              <div
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
                role="alert"
              >
                <p className="font-semibold">上傳失敗</p>
                <p className="text-sm">{pageState.error}</p>
              </div>
            )}

            <div className="flex justify-center">
              <MenuUploadWithMockService
                onMenuDataReceived={handleMenuDataReceived}
                onError={handleError}
                disabled={pageState.isLoading}
              />
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>支援 JPG 和 PNG 格式</p>
              <p>檔案大小限制：15MB（超過 5MB 會自動壓縮）</p>
            </div>
          </div>
        ) : (
          /* Menu Display Section */
          <div>
            {/* Results Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                菜單已解析
              </h2>
              <p className="text-gray-600">
                共找到 {pageState.menuData.length} 個菜項
              </p>
            </div>

            {/* Menu List */}
            <MenuList
              menuItems={pageState.menuData}
              selectedItemIds={selectedItemIds}
              selectedVariants={selectedVariants}
              onSelectItem={handleSelectItem}
              onSelectVariant={handleSelectVariant}
            />

            {/* Selected Items Summary */}
            {selectedItemIds.length > 0 && (
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-3">
                  已選擇菜項 ({selectedItemIds.length})
                </h3>
                <ul className="space-y-2">
                  {selectedItemIds.map((itemId) => {
                    const item = pageState.menuData!.find((i) => i.id === itemId)
                    const variant = selectedVariants[itemId]
                    return (
                      <li key={itemId} className="text-blue-800">
                        <span className="font-semibold">{item?.name_zh}</span>
                        {variant && (
                          <span className="text-sm text-blue-700 ml-2">
                            - {variant.spec} (¥{variant.price}{' '}
                            {variant.tax_type})
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4 justify-center">
              <button
                onClick={() => {
                  setPageState({
                    isLoading: false,
                    error: null,
                    menuData: null,
                  })
                }}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
              >
                上傳新菜單
              </button>
              <button
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedItemIds.length === 0}
              >
                確認點餐 ({selectedItemIds.length})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
