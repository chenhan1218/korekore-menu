/**
 * AI Processing Page
 * Main page for menu scanning, parsing, and ordering
 *
 * Flow:
 * 1. Upload/capture menu image
 * 2. AI parses the menu (Gemini API)
 * 3. User selects items
 * 4. Generate order card
 */

import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMenuStore } from '@/store/menuStore'
import { createParseMenuImageUseCase } from '@/domain/usecases'
import { GeminiAdapter } from '@/infrastructure/adapters'
import { ErrorMessage, LoadingSpinner } from '../components/common'
import {
  AIProcessingIndicator,
  MenuCardList,
  OrderSummary,
} from '../components/features'

export const AIProcessingPage = () => {
  const navigate = useNavigate()
  const {
    currentMenu,
    selectedItems,
    isLoading,
    error,
    language,
    setCurrentMenu,
    clearCurrentMenu,
    toggleItemSelection,
    selectAllItems,
    deselectAllItems,
    setLoading,
    setError,
  } = useMenuStore()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const parseUseCaseRef = useRef<ReturnType<typeof createParseMenuImageUseCase> | null>(null)

  // Initialize parse use case
  useEffect(() => {
    if (!parseUseCaseRef.current) {
      const geminiAdapter = new GeminiAdapter()
      parseUseCaseRef.current = createParseMenuImageUseCase(geminiAdapter)
    }
  }, [])

  // Handle file selection
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError({
        code: 'INVALID_IMAGE_FORMAT' as any,
        message: '請選擇有效的圖片文件',
        userMessage: '請選擇 JPG 或 PNG 格式的圖片',
        retry: false,
      } as any)
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError({
        code: 'IMAGE_SIZE_EXCEEDED' as any,
        message: 'File size exceeds 5MB',
        userMessage: '圖片大小不能超過 5MB',
        retry: false,
      } as any)
      return
    }

    await processImage(file)
  }

  // Process image with Gemini API
  const processImage = async (file: File) => {
    try {
      setLoading(true)
      setError(null)

      // Convert file to base64
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target?.result as string

        try {
          // Call use case
          if (parseUseCaseRef.current) {
            const menuData = await parseUseCaseRef.current.execute(base64, language)
            setCurrentMenu(menuData)
          }
        } catch (err) {
          setError(err as any)
        } finally {
          setLoading(false)
        }
      }

      reader.onerror = () => {
        setError({
          code: 'PARSE_ERROR' as any,
          message: 'Failed to read file',
          userMessage: '無法讀取圖片文件',
          retry: true,
        } as any)
        setLoading(false)
      }

      reader.readAsDataURL(file)
    } catch (err) {
      setError(err as any)
      setLoading(false)
    }
  }

  // Handle upload button click
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // Handle retry
  const handleRetry = () => {
    if (fileInputRef.current?.files?.[0]) {
      processImage(fileInputRef.current.files[0])
    }
  }

  // Render: Loading state
  if (isLoading) {
    return <AIProcessingIndicator status="processing" />
  }

  // Render: No menu loaded yet
  if (!currentMenu) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">菜單掃描</h1>
          <p className="text-gray-600 mb-4">上傳或拍攝菜單圖片，AI 自動識別菜單項目</p>
        </div>

        {error && (
          <ErrorMessage
            error={error}
            onRetry={error.retry ? handleRetry : undefined}
            onDismiss={() => setError(null)}
          />
        )}

        <button
          onClick={handleUploadClick}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          📷 上傳菜單圖片
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    )
  }

  // Render: Menu loaded, show selection UI
  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 shadow-sm z-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">選擇菜品</h1>
          <p className="text-sm text-gray-600 mt-1">
            共找到 {currentMenu.items.length} 項菜品
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="max-w-7xl mx-auto p-4">
          <ErrorMessage
            error={error}
            onRetry={error.retry ? handleRetry : undefined}
            onDismiss={() => setError(null)}
          />
        </div>
      )}

      {/* Menu list */}
      <div className="max-w-7xl mx-auto p-4">
        <MenuCardList
          items={currentMenu.items}
          selectedIds={selectedItems}
          onToggleItem={toggleItemSelection}
          onSelectAll={selectAllItems}
          onDeselectAll={deselectAllItems}
        />
      </div>

      {/* Summary bar */}
      {selectedItems.size > 0 && (
        <OrderSummary
          items={currentMenu.items.filter(item => selectedItems.has(item.id))}
          onBack={() => {
            // Reset to upload screen
            clearCurrentMenu()
            deselectAllItems()
          }}
          onNext={() => {
            // Navigate to order card page
            navigate('/order-card')
          }}
        />
      )}
    </div>
  )
}
