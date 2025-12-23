import React from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * MenuScanPage component - Allows users to upload menu images
 *
 * Features:
 * - File upload or camera capture
 * - Image preview
 * - Upload progress display
 * - Error handling
 */
export const MenuScanPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800 text-lg"
          >
            ← Back / 返回
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Scan Menu / 菜單掃描</h1>
          <div className="w-12"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* TODO: Add FileUploadInput component */}
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <p className="text-gray-500 mb-2">📸 Select image or take photo / 選擇菜單圖片或拍照</p>
            <p className="text-sm text-gray-400">JPG, PNG format, max 10MB / JPG、PNG 格式，最大 10MB</p>
          </div>
        </div>

        {/* TODO: Add ImagePreview component */}
        {/* TODO: Add ProgressBar component */}
      </div>
    </div>
  )
}
