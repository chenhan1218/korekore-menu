/**
 * Menu Card Component
 * Displays a single menu item with selection checkbox
 */

import { MenuItem } from '@/domain/entities'
import { Card, Checkbox } from '../common'

export interface MenuCardProps {
  item: MenuItem
  selected: boolean
  onToggle: (itemId: string) => void
}

export const MenuCard = ({ item, selected, onToggle }: MenuCardProps) => {
  const handleCardClick = () => {
    onToggle(item.id)
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    onToggle(item.id)
  }

  return (
    <Card
      clickable
      selected={selected}
      onClick={handleCardClick}
      role="article"
      className="h-full flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h3>
          <p className="text-gray-700 text-sm mt-1 line-clamp-2">{item.name_zh_TW}</p>
          {item.description && (
            <p className="text-gray-500 text-xs mt-2">{item.description}</p>
          )}
        </div>
        <Checkbox
          checked={selected}
          onChange={handleCheckboxChange}
          aria-label={`Select ${item.name}`}
        />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        {item.price && <span className="font-semibold text-blue-600">{item.price}</span>}
        {selected && (
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">
            已選
          </span>
        )}
      </div>
    </Card>
  )
}
