/**
 * Order Summary Component
 * Shows selected items summary with action buttons
 */

import { MenuItem } from '@/domain/entities'
import { Button } from '../common'

export interface OrderSummaryProps {
  items: MenuItem[]
  onNext?: () => void
  onBack?: () => void
  isLoading?: boolean
}

export const OrderSummary = ({
  items,
  onNext,
  onBack,
  isLoading = false,
}: OrderSummaryProps) => {
  if (items.length === 0) {
    return null
  }

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-3">
          {/* Summary info */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">已選菜品</p>
              <p className="text-lg font-semibold text-gray-900">{items.length} 項</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">點擊下方按鈕生成點餐卡</p>
            </div>
          </div>

          {/* Selected items preview */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex flex-wrap gap-2">
              {items.slice(0, 5).map(item => (
                <span
                  key={item.id}
                  className="px-2.5 py-1.5 bg-blue-100 text-blue-800 text-xs rounded font-medium truncate max-w-xs"
                >
                  {item.name}
                </span>
              ))}
              {items.length > 5 && (
                <span className="px-2.5 py-1.5 bg-gray-200 text-gray-800 text-xs rounded font-medium">
                  +{items.length - 5} 項
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            {onBack && (
              <Button
                variant="secondary"
                fullWidth
                onClick={onBack}
                disabled={isLoading}
              >
                返回
              </Button>
            )}
            {onNext && (
              <Button
                variant="primary"
                fullWidth
                onClick={onNext}
                isLoading={isLoading}
              >
                生成點餐卡
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
