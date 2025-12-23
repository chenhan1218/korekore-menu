import { useState } from 'react'
import type { MenuItemType, VariantType } from '@types/menu'

interface MenuItemCardProps {
  item: MenuItemType
  isSelected: boolean
  onSelect: (itemId: string, selected: boolean) => void
  onVariantSelect: (itemId: string, variant: VariantType) => void
  selectedVariant?: VariantType
}

export function MenuItemCard({
  item,
  isSelected,
  onSelect,
  onVariantSelect,
  selectedVariant,
}: MenuItemCardProps) {
  const [localSelectedVariant, setLocalSelectedVariant] = useState<VariantType | undefined>(
    selectedVariant
  )

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(item.id, e.target.checked)
  }

  const handleVariantClick = (variant: VariantType) => {
    // Update both local state and parent callback simultaneously
    setLocalSelectedVariant(variant)
    // Parent callback should update external state, local state is just for visual feedback
    onVariantSelect(item.id, variant)
  }

  return (
    <div
      data-testid="menu-item-card"
      className="border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow bg-white"
    >
      {/* Header with checkbox and item names */}
      <div className="flex items-start gap-4 mb-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          className="w-5 h-5 mt-1 cursor-pointer accent-blue-500"
          aria-label={`Select ${item.name_jp}`}
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name_jp}</h3>
          <p className="text-gray-600 text-sm">{item.name_zh}</p>
        </div>
      </div>

      {/* Variants section */}
      <div className="pl-9 sm:pl-9 space-y-3">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">規格與價格</div>
        <div className="space-y-2">
          {item.variants.map((variant, index) => (
            <button
              key={`${item.id}-variant-${index}`}
              onClick={() => handleVariantClick(variant)}
              className={`w-full text-left px-3 py-2 rounded-md border-2 transition-colors ${
                localSelectedVariant?.spec === variant.spec && localSelectedVariant?.price === variant.price
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">{variant.spec}</span>
                <div className="text-right">
                  <span className="text-gray-900 font-semibold">{variant.price}</span>
                  <span className="text-xs text-gray-500 ml-1 whitespace-nowrap">
                    {variant.tax_type}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}
