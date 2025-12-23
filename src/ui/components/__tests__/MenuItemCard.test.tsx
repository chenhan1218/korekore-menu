import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MenuItemCard } from '../MenuItemCard';
import type { MenuItemType } from '@/types/menu';

describe('MenuItemCard', () => {
  const mockMenuItem: MenuItemType = {
    id: 'item_1',
    name_jp: '唐揚げ',
    name_zh: '唐揚雞',
    variants: [
      { spec: '單點', price: 500, tax_type: '稅込' },
      { spec: '定食', price: 800, tax_type: '稅込' },
    ],
  };

  const mockMenuItem2: MenuItemType = {
    id: 'item_2',
    name_jp: '生ビール',
    name_zh: '生啤酒',
    variants: [
      { spec: '大杯', price: 680, tax_type: '稅拔' },
      { spec: '小杯', price: 480, tax_type: '稅拔' },
    ],
  };

  it('renders menu item with Japanese and Chinese names', () => {
    render(
      <MenuItemCard
        item={mockMenuItem}
        isSelected={false}
        onSelect={() => {}}
        onVariantSelect={() => {}}
      />
    );

    expect(screen.getByText('唐揚げ')).toBeDefined();
    expect(screen.getByText('唐揚雞')).toBeDefined();
  });

  it('displays all variants with correct prices and tax types', () => {
    render(
      <MenuItemCard
        item={mockMenuItem}
        isSelected={false}
        onSelect={() => {}}
        onVariantSelect={() => {}}
      />
    );

    expect(screen.getByText('單點')).toBeDefined();
    expect(screen.getByText('500')).toBeDefined();
    expect(screen.getAllByText('稅込').length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText('定食')).toBeDefined();
    expect(screen.getByText('800')).toBeDefined();
  });

  it('displays tax information clearly for each variant', () => {
    render(
      <MenuItemCard
        item={mockMenuItem2}
        isSelected={false}
        onSelect={() => {}}
        onVariantSelect={() => {}}
      />
    );

    const taxLabels = screen.getAllByText('稅拔');
    expect(taxLabels.length).toBe(2);
  });

  it('calls onSelect when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <MenuItemCard
        item={mockMenuItem}
        isSelected={false}
        onSelect={onSelect}
        onVariantSelect={() => {}}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(onSelect).toHaveBeenCalledWith(mockMenuItem.id, true);
  });

  it('reflects selected state in the checkbox', () => {
    const { rerender } = render(
      <MenuItemCard
        item={mockMenuItem}
        isSelected={false}
        onSelect={() => {}}
        onVariantSelect={() => {}}
      />
    );

    let checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);

    rerender(
      <MenuItemCard
        item={mockMenuItem}
        isSelected={true}
        onSelect={() => {}}
        onVariantSelect={() => {}}
      />
    );

    checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('calls onVariantSelect when a variant is selected', async () => {
    const user = userEvent.setup();
    const onVariantSelect = vi.fn();

    render(
      <MenuItemCard
        item={mockMenuItem}
        isSelected={false}
        onSelect={() => {}}
        onVariantSelect={onVariantSelect}
      />
    );

    // Find and click the first variant button (containing "單點")
    const firstVariantButton = screen.getByText('單點').closest('button') as HTMLButtonElement;
    await user.click(firstVariantButton);

    expect(onVariantSelect).toHaveBeenCalledWith(
      mockMenuItem.id,
      expect.objectContaining({
        spec: '單點',
        price: 500,
        tax_type: '稅込',
      })
    );
  });

  it('highlights selected variant visually', async () => {
    render(
      <MenuItemCard
        item={mockMenuItem}
        isSelected={false}
        onSelect={() => {}}
        onVariantSelect={() => {}}
        selectedVariant={mockMenuItem.variants[0]}
      />
    );

    // The selected variant should have a visual indication (e.g., border or background color)
    const selectedVariantElement = screen.getByText('單點').closest('button');
    expect(selectedVariantElement?.className.includes('border-blue-500')).toBe(true);
    expect(selectedVariantElement?.className.includes('bg-blue-50')).toBe(true);
  });

  it('is readable on different screen sizes', () => {
    const { container } = render(
      <MenuItemCard
        item={mockMenuItem}
        isSelected={false}
        onSelect={() => {}}
        onVariantSelect={() => {}}
      />
    );

    const card = container.querySelector('[data-testid="menu-item-card"]');
    expect(card).toBeDefined();
    expect(card?.className.includes('p-4')).toBe(true);
    expect(card?.className.includes('md:p-6')).toBe(true);
  });

  it('renders correctly with single variant', () => {
    const singleVariantItem: MenuItemType = {
      id: 'item_single',
      name_jp: '白米',
      name_zh: '白飯',
      variants: [{ spec: '單點', price: 200, tax_type: '稅込' }],
    };

    render(
      <MenuItemCard
        item={singleVariantItem}
        isSelected={false}
        onSelect={() => {}}
        onVariantSelect={() => {}}
      />
    );

    expect(screen.getByText('白米')).toBeDefined();
    expect(screen.getByText('白飯')).toBeDefined();
    expect(screen.getByText('200')).toBeDefined();
  });
});
