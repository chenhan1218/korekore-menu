/**
 * Menu Card List Component
 * Displays menu items as a grid of selectable cards
 */

import { MenuItem } from '@/domain/entities'
import { MenuCard } from './MenuCard'

export interface MenuCardListProps {
  items: MenuItem[]
  selectedIds: Map<string, number>
  onToggleItem: (itemId: string) => void
  onSelectAll?: () => void
  onDeselectAll?: () => void
}

export const MenuCardList = ({
  items,
  selectedIds,
  onToggleItem,
  onSelectAll,
  onDeselectAll,
}: MenuCardListProps) => {
  const selectedCount = selectedIds.size

  return (
    <div className="space-y-4">
      {/* Control bar */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          已選 <span className="font-semibold text-gray-900">{selectedCount}</span> 項 / 共{' '}
          <span className="font-semibold text-gray-900">{items.length}</span> 項
        </div>
        <div className="flex gap-2">
          {onSelectAll && (
            <button
              onClick={onSelectAll}
              className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
            >
              全選
            </button>
          )}
          {onDeselectAll && (
            <button
              onClick={onDeselectAll}
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded transition-colors"
            >
              取消選擇
            </button>
          )}
        </div>
      </div>

      {/* Menu cards grid */}
      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>沒有找到菜單項目</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <MenuCard
              key={item.id}
              item={item}
              selected={selectedIds.has(item.id)}
              onToggle={onToggleItem}
            />
          ))}
        </div>
      )}
    </div>
  )
}
