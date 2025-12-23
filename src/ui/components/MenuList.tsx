import { MenuItemCard } from './MenuItemCard';
import type { MenuItemType, VariantType } from '@/types/menu';

interface MenuListProps {
  items: MenuItemType[];
  selectedItems: string[];
  onSelectItem: (itemId: string, selected: boolean) => void;
  onVariantSelect: (itemId: string, variant: VariantType) => void;
  selectedVariants?: Record<string, VariantType>;
}

export function MenuList({
  items,
  selectedItems,
  onSelectItem,
  onVariantSelect,
  selectedVariants,
}: MenuListProps) {
  if (items.length === 0) {
    return (
      <div
        data-testid="menu-list-empty"
        className="flex flex-col items-center justify-center py-12 px-4 text-center"
      >
        <div className="text-lg font-semibold text-gray-700 mb-2">沒有菜單項目</div>
        <p className="text-sm text-gray-500">無法找到菜單數據，請重新上傳</p>
      </div>
    );
  }

  return (
    <div
      data-testid="menu-list"
      className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 space-y-4"
    >
      {items.map((item) => (
        <MenuItemCard
          key={item.id}
          item={item}
          isSelected={selectedItems.includes(item.id)}
          onSelect={onSelectItem}
          onVariantSelect={onVariantSelect}
          selectedVariant={selectedVariants?.[item.id]}
        />
      ))}
    </div>
  );
}
