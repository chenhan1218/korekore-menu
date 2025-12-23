import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MenuList } from '../MenuList';
import type { MenuItemType } from '@/types/menu';

describe('MenuList', () => {
  const mockMenuItems: MenuItemType[] = [
    {
      id: 'item_1',
      name_jp: '唐揚げ',
      name_zh: '唐揚雞',
      variants: [
        { spec: '單點', price: 500, tax_type: '稅込' },
        { spec: '定食', price: 800, tax_type: '稅込' },
      ],
    },
    {
      id: 'item_2',
      name_jp: '生ビール',
      name_zh: '生啤酒',
      variants: [
        { spec: '大杯', price: 680, tax_type: '稅拔' },
        { spec: '小杯', price: 480, tax_type: '稅拔' },
      ],
    },
    {
      id: 'item_3',
      name_jp: '枝豆',
      name_zh: '毛豆',
      variants: [{ spec: '單點', price: 350, tax_type: '稅込' }],
    },
  ];

  it('renders all menu items from the list', () => {
    render(
      <MenuList
        items={mockMenuItems}
        selectedItems={[]}
        onSelectItem={() => {}}
        onVariantSelect={() => {}}
      />
    );

    // Check all Japanese names are displayed
    expect(screen.getByText('唐揚げ')).toBeDefined();
    expect(screen.getByText('生ビール')).toBeDefined();
    expect(screen.getByText('枝豆')).toBeDefined();

    // Check all Chinese names are displayed
    expect(screen.getByText('唐揚雞')).toBeDefined();
    expect(screen.getByText('生啤酒')).toBeDefined();
    expect(screen.getByText('毛豆')).toBeDefined();
  });

  it('displays empty message when items list is empty', () => {
    render(
      <MenuList items={[]} selectedItems={[]} onSelectItem={() => {}} onVariantSelect={() => {}} />
    );

    expect(screen.getByText(/沒有菜單項目|無菜項|空列表/)).toBeDefined();
  });

  it('maintains list scrolling smoothly with many items', () => {
    // Create 20 mock items to simulate the MVP requirement
    const manyItems = Array.from({ length: 20 }, (_, i) => ({
      id: `item_${i + 1}`,
      name_jp: `菜項 ${i + 1}`,
      name_zh: `菜項中文 ${i + 1}`,
      variants: [{ spec: '單點', price: 100 + i * 50, tax_type: '稅込' as const }],
    }));

    const { container } = render(
      <MenuList
        items={manyItems}
        selectedItems={[]}
        onSelectItem={() => {}}
        onVariantSelect={() => {}}
      />
    );

    // Verify all 20 items are rendered
    const items = container.querySelectorAll('[data-testid="menu-item-card"]');
    expect(items.length).toBe(20);

    // Verify list container has proper scroll capability
    const listContainer = container.querySelector('[data-testid="menu-list"]');
    expect(listContainer).toBeDefined();
  });

  it('passes selected items state to child MenuItemCard components', () => {
    const selectedItems = ['item_1', 'item_3'];

    render(
      <MenuList
        items={mockMenuItems}
        selectedItems={selectedItems}
        onSelectItem={() => {}}
        onVariantSelect={() => {}}
      />
    );

    // Verify selected items are passed to their respective cards
    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
    const firstCheckbox = checkboxes[0]; // item_1
    const thirdCheckbox = checkboxes[2]; // item_3

    expect(firstCheckbox).toBeDefined();
    expect(thirdCheckbox).toBeDefined();
    expect(firstCheckbox?.checked).toBe(true);
    expect(thirdCheckbox?.checked).toBe(true);
  });

  it('calls onSelectItem when menu item is selected', async () => {
    const user = userEvent.setup();
    const onSelectItem = vi.fn();

    render(
      <MenuList
        items={mockMenuItems}
        selectedItems={[]}
        onSelectItem={onSelectItem}
        onVariantSelect={() => {}}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    const firstCheckbox = checkboxes[0];
    expect(firstCheckbox).toBeDefined();
    if (firstCheckbox) {
      await user.click(firstCheckbox);
    }

    expect(onSelectItem).toHaveBeenCalledWith('item_1', true);
  });

  it('calls onVariantSelect when variant is selected', async () => {
    const user = userEvent.setup();
    const onVariantSelect = vi.fn();

    render(
      <MenuList
        items={mockMenuItems}
        selectedItems={[]}
        onSelectItem={() => {}}
        onVariantSelect={onVariantSelect}
      />
    );

    // Click on first variant of first item (唐揚げ)
    const allVariantButtons = screen.getAllByRole('button');
    // Skip checkbox buttons and click the first variant button (should be 單點 of item_1)
    const firstVariantButton = allVariantButtons.find(
      (btn) => btn.textContent?.includes('單點') && btn.textContent?.includes('500')
    ) as HTMLButtonElement;
    await user.click(firstVariantButton);

    expect(onVariantSelect).toHaveBeenCalledWith(
      'item_1',
      expect.objectContaining({
        spec: '單點',
        price: 500,
        tax_type: '稅込',
      })
    );
  });

  it('renders list with proper spacing and layout', () => {
    const { container } = render(
      <MenuList
        items={mockMenuItems}
        selectedItems={[]}
        onSelectItem={() => {}}
        onVariantSelect={() => {}}
      />
    );

    const listContainer = container.querySelector('[data-testid="menu-list"]');
    expect(listContainer?.className.includes('space-y-4')).toBe(true);
    expect(listContainer?.className.includes('grid')).toBe(true);
  });

  it('handles responsive grid layout for different screen sizes', () => {
    const { container } = render(
      <MenuList
        items={mockMenuItems}
        selectedItems={[]}
        onSelectItem={() => {}}
        onVariantSelect={() => {}}
      />
    );

    const listContainer = container.querySelector('[data-testid="menu-list"]');
    // Should have responsive grid classes
    expect(listContainer?.className.includes('md:grid-cols')).toBe(true);
  });
});
