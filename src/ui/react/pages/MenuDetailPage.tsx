import React from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * MenuDetailPage component - Displays menu items and allows user to order
 *
 * Layout:
 * - Left column: Menu items with checkboxes
 * - Right column: Order summary with selected items
 *
 * Features:
 * - Display menu items (Japanese name, Chinese translation, price)
 * - Select/deselect items
 * - Adjust quantities
 * - Real-time total calculation
 * - Responsive layout (single column on mobile)
 */
export const MenuDetailPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/scan')}
            className="text-gray-600 hover:text-gray-800 text-lg"
          >
            ← Back / 返回
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Order / 菜單選擇</h1>
          <div className="w-12"></div>
        </div>
      </div>

      {/* Two column layout */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Menu items */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Menu Items / 菜單項目
            </h2>
            {/* TODO: Add MenuItemCard components */}
            <div className="space-y-3">
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-gray-500 text-center py-8">
                  Loading menu data / 等待菜單數據載入...
                </p>
              </div>
            </div>
          </div>

          {/* Right column: Order summary */}
          <div>
            <div className="sticky top-20 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Order Summary / 點餐摘要
              </h3>
              {/* TODO: Add OrderSummary component */}
              <div className="space-y-3 mb-4">
                <p className="text-gray-500 text-center py-8">
                  Select items to show / 選擇菜項後顯示
                </p>
              </div>
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed"
              >
                Generate Order Card / 生成點餐卡
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
