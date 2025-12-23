import React from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * HomePage component - Landing page of the KoreKore application
 *
 * Displays the main entry point with options to:
 * - Scan a new menu
 * - View menu history (future feature)
 * - View settings (future feature)
 */
export const HomePage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Hero section */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          KoreKore
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          日本語メニュー翻訳アシスタント
        </p>
        <p className="text-gray-500 mb-12">
          AI驅動的日文菜單翻譯，協助您在日本餐廳輕鬆點餐
        </p>

        {/* CTA button */}
        <button
          onClick={() => navigate('/scan')}
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors mb-4"
        >
          📸 掃描菜單 / Scan Menu
        </button>

        {/* Secondary actions (disabled for MVP) */}
        <button
          disabled
          className="w-full bg-gray-200 text-gray-500 py-3 px-6 rounded-lg font-semibold cursor-not-allowed mb-4"
        >
          📋 菜單歷史 / History
        </button>

        <button
          disabled
          className="w-full bg-gray-200 text-gray-500 py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
        >
          ⚙️ 設置 / Settings
        </button>
      </div>
    </div>
  )
}
