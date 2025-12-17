/**
 * AI Processing Indicator Component
 * Shows animated processing state while Gemini API is working
 */

import { LoadingSpinner } from '../common'

export interface AIProcessingIndicatorProps {
  status?: 'uploading' | 'processing' | 'parsing'
}

const statusMessages = {
  uploading: '正在上傳圖片...',
  processing: '正在分析菜單...',
  parsing: '正在解析結果...',
}

export const AIProcessingIndicator = ({
  status = 'processing',
}: AIProcessingIndicatorProps) => {
  const message = statusMessages[status]

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <LoadingSpinner message={message} size="lg" />
      <p className="text-gray-500 text-sm animate-pulse">
        AI 正在智能識別菜單，請稍候...
      </p>
    </div>
  )
}
