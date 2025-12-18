/**
 * Order Card Page
 * Displays selected items with quantity controls
 *
 * Flow:
 * 1. Display selected items with quantity controls
 * 2. Allow user to modify quantities
 * 3. Show total price
 * 4. Return to menu for modifications
 */

import { useNavigate } from 'react-router-dom'
import { useMenuStore } from '@/store/menuStore'
import { OrderCardItem, OrderCardSummary } from '../components/features'
import { Button } from '../components/common'

export const OrderCardPage = () => {
  const navigate = useNavigate()
  const {
    currentMenu,
    incrementItemQuantity,
    decrementItemQuantity,
    removeItem,
    getSelectedItems,
    getTotalPrice,
  } = useMenuStore()

  const selectedItems = getSelectedItems()
  const totalPrice = getTotalPrice()

  // If no menu or no selected items, redirect to menu
  if (!currentMenu || selectedItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 px-4 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900">沒有已選項目</h1>
        <p className="text-gray-600">請返回菜單選擇菜品</p>
        <Button
          variant="primary"
          onClick={() => navigate('/')}
        >
          返回菜單
        </Button>
      </div>
    )
  }

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 shadow-sm z-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">點餐卡</h1>
          <p className="text-sm text-gray-600 mt-1">已選 {selectedItems.length} 項菜品</p>
        </div>
      </div>

      {/* Order items */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {selectedItems.map(item => (
            <OrderCardItem
              key={item.id}
              item={item}
              onIncrement={() => incrementItemQuantity(item.id)}
              onDecrement={() => decrementItemQuantity(item.id)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </div>
      </div>

      {/* Summary bar */}
      <OrderCardSummary
        itemCount={selectedItems.length}
        totalQuantity={selectedItems.reduce((sum, item) => sum + item.quantity, 0)}
        totalPrice={totalPrice}
        onBack={() => navigate('/')}
      />
    </div>
  )
}
