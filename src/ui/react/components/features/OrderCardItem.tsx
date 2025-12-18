/**
 * Order Card Item Component
 * Displays a single order item with quantity controls
 */

import { SelectedItem } from '@/store/menuStore'
import { Button } from '../common'

export interface OrderCardItemProps {
  item: SelectedItem
  onIncrement: () => void
  onDecrement: () => void
  onRemove: () => void
}

export const OrderCardItem = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: OrderCardItemProps) => {
  // Calculate subtotal
  const price = item.price ? parseFloat(item.price) : 0
  const subtotal = price * item.quantity
  const hasPrice = item.price && !isNaN(price)

  return (
    <div className="border-b border-gray-200 py-4 last:border-b-0">
      {/* Item info */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          {/* Original name (main) */}
          <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
          {/* Chinese translation (secondary) */}
          <p className="text-gray-600 text-sm mt-0.5">{item.name_zh_TW}</p>
          {item.description && (
            <p className="text-gray-500 text-xs mt-1">{item.description}</p>
          )}
        </div>
        {/* Remove button */}
        <button
          onClick={onRemove}
          className="px-2 py-1 text-xs bg-red-100 text-red-700 hover:bg-red-200 rounded transition-colors flex-shrink-0"
          title="Delete item"
        >
          刪除
        </button>
      </div>

      {/* Quantity and price controls */}
      <div className="flex items-center justify-between gap-4">
        {/* Quantity control */}
        <div className="flex items-center gap-2">
          <button
            onClick={onDecrement}
            className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center text-lg font-semibold"
            title="Decrease quantity"
          >
            −
          </button>
          <span className="w-12 text-center font-semibold text-gray-900">
            {item.quantity}
          </span>
          <button
            onClick={onIncrement}
            className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center text-lg font-semibold"
            title="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Price info */}
        <div className="text-right">
          <div className="text-sm text-gray-600">
            {hasPrice ? (
              <>
                <div>¥{price.toFixed(0)}</div>
                <div className="font-semibold text-gray-900">
                  小計: ¥{subtotal.toFixed(0)}
                </div>
              </>
            ) : (
              <div className="text-gray-500 text-sm">價格未提供</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
