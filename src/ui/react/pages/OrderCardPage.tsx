import React from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * OrderCardPage component - Displays the generated order card
 *
 * Features:
 * - Display selected menu items with quantities
 * - Show Japanese honorific ordering text
 * - Copy to clipboard functionality
 * - Web Share API support
 * - Return to edit selection
 */
export const OrderCardPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/menu')}
            className="text-gray-600 hover:text-gray-800 text-lg"
          >
            ← Edit / 編輯選擇
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Order Card / 點餐卡</h1>
          <div className="w-12"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* TODO: Add OrderCard component */}
        <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 mb-6">
          <div className="text-center text-gray-500 py-12">
            <p className="mb-2">Generating order card / 等待點餐卡生成...</p>
            <p className="text-sm">Complete selection to view card / 完成選擇後，點餐卡將在此顯示</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            disabled
            className="bg-gray-200 text-gray-500 py-3 px-4 rounded-lg font-semibold cursor-not-allowed hover:bg-gray-200"
          >
            📋 Copy / 複製文字
          </button>
          <button
            disabled
            className="bg-gray-200 text-gray-500 py-3 px-4 rounded-lg font-semibold cursor-not-allowed hover:bg-gray-200"
          >
            🔗 Share / 分享
          </button>
        </div>
      </div>
    </div>
  )
}
