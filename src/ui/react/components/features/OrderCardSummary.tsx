/**
 * Order Card Summary Component
 * Displays total and action buttons
 */

import { Button } from '../common'

export interface OrderCardSummaryProps {
  itemCount: number
  totalQuantity: number
  totalPrice: number
  onBack?: () => void
}

export const OrderCardSummary = ({
  itemCount,
  totalQuantity,
  totalPrice,
  onBack,
}: OrderCardSummaryProps) => {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col gap-4">
          {/* Summary info */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-600 mb-1">菜品數</p>
              <p className="text-lg font-semibold text-gray-900">{itemCount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">總份數</p>
              <p className="text-lg font-semibold text-gray-900">{totalQuantity}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">總計</p>
              <p className="text-lg font-semibold text-blue-600">
                ¥{totalPrice.toFixed(0)}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          {onBack && (
            <Button
              variant="secondary"
              fullWidth
              onClick={onBack}
            >
              ← 返回修改
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
