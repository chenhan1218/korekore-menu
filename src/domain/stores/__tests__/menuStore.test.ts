import { describe, it, expect, beforeEach } from 'vitest';
import { useMenuStore } from '../menuStore';
import type { VariantType } from '@/types/menu';

describe('menuStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useMenuStore.getState().reset();
  });

  it('initializes with empty selections', () => {
    const store = useMenuStore.getState();
    expect(store.selectedItemIds).toEqual([]);
    expect(store.selectedVariants).toEqual({});
  });

  it('adds item to selection when toggleSelectItem is called with true', () => {
    useMenuStore.getState().toggleSelectItem('item_1', true);
    const store = useMenuStore.getState();

    expect(store.selectedItemIds).toContain('item_1');
  });

  it('removes item from selection when toggleSelectItem is called with false', () => {
    useMenuStore.getState().toggleSelectItem('item_1', true);
    let store = useMenuStore.getState();
    expect(store.selectedItemIds).toContain('item_1');

    useMenuStore.getState().toggleSelectItem('item_1', false);
    store = useMenuStore.getState();
    expect(store.selectedItemIds).not.toContain('item_1');
  });

  it('toggles item selection state when called multiple times', () => {
    useMenuStore.getState().toggleSelectItem('item_1', true);
    let store = useMenuStore.getState();
    expect(store.selectedItemIds.includes('item_1')).toBe(true);

    useMenuStore.getState().toggleSelectItem('item_1', false);
    store = useMenuStore.getState();
    expect(store.selectedItemIds.includes('item_1')).toBe(false);

    useMenuStore.getState().toggleSelectItem('item_1', true);
    store = useMenuStore.getState();
    expect(store.selectedItemIds.includes('item_1')).toBe(true);
  });

  it('stores selected variant for an item', () => {
    const variant: VariantType = {
      spec: '單點',
      price: 500,
      tax_type: '稅込',
    };

    useMenuStore.getState().selectVariant('item_1', variant);
    const store = useMenuStore.getState();

    expect(store.selectedVariants['item_1']).toEqual(variant);
  });

  it('updates variant selection when selectVariant is called multiple times', () => {
    const variant1: VariantType = {
      spec: '單點',
      price: 500,
      tax_type: '稅込',
    };
    const variant2: VariantType = {
      spec: '定食',
      price: 800,
      tax_type: '稅込',
    };

    useMenuStore.getState().selectVariant('item_1', variant1);
    let store = useMenuStore.getState();
    expect(store.selectedVariants['item_1']).toEqual(variant1);

    useMenuStore.getState().selectVariant('item_1', variant2);
    store = useMenuStore.getState();
    expect(store.selectedVariants['item_1']).toEqual(variant2);
  });

  it('maintains separate variant selections for different items', () => {
    const variant1: VariantType = {
      spec: '單點',
      price: 500,
      tax_type: '稅込',
    };
    const variant2: VariantType = {
      spec: '大杯',
      price: 680,
      tax_type: '稅拔',
    };

    useMenuStore.getState().selectVariant('item_1', variant1);
    useMenuStore.getState().selectVariant('item_2', variant2);
    const store = useMenuStore.getState();

    expect(store.selectedVariants['item_1']).toEqual(variant1);
    expect(store.selectedVariants['item_2']).toEqual(variant2);
  });

  it('allows clearing all selections with reset', () => {
    useMenuStore.getState().toggleSelectItem('item_1', true);
    useMenuStore.getState().toggleSelectItem('item_2', true);
    useMenuStore.getState().selectVariant('item_1', {
      spec: '單點',
      price: 500,
      tax_type: '稅込',
    });

    let store = useMenuStore.getState();
    expect(store.selectedItemIds.length).toBe(2);
    expect(Object.keys(store.selectedVariants).length).toBe(1);

    useMenuStore.getState().reset();
    store = useMenuStore.getState();

    expect(store.selectedItemIds).toEqual([]);
    expect(store.selectedVariants).toEqual({});
  });

  it('returns isItemSelected helper to check if item is selected', () => {
    useMenuStore.getState().toggleSelectItem('item_1', true);
    const store = useMenuStore.getState();

    expect(store.isItemSelected('item_1')).toBe(true);
    expect(store.isItemSelected('item_2')).toBe(false);
  });

  it('returns getSelectedVariant helper to get variant for an item', () => {
    const variant: VariantType = {
      spec: '單點',
      price: 500,
      tax_type: '稅込',
    };

    useMenuStore.getState().selectVariant('item_1', variant);
    const store = useMenuStore.getState();

    expect(store.getSelectedVariant('item_1')).toEqual(variant);
    expect(store.getSelectedVariant('item_2')).toBeUndefined();
  });

  it('provides getTotalSelectedCount to count selected items', () => {
    useMenuStore.getState().toggleSelectItem('item_1', true);
    useMenuStore.getState().toggleSelectItem('item_2', true);
    useMenuStore.getState().toggleSelectItem('item_3', true);
    let store = useMenuStore.getState();

    expect(store.getTotalSelectedCount()).toBe(3);

    useMenuStore.getState().toggleSelectItem('item_2', false);
    store = useMenuStore.getState();

    expect(store.getTotalSelectedCount()).toBe(2);
  });
});
