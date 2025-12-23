import { describe, it, expect } from 'vitest'
// This import will fail if types don't exist
import type { MenuItemType, VariantType } from '@/types/menu'

describe('Menu Types - MenuItemType and VariantType', () => {
  describe('VariantType structure', () => {
    it('should have required spec, price, and tax_type fields', () => {
      const variant: VariantType = {
        spec: '單點',
        price: 500,
        tax_type: '稅込',
      }

      expect(variant).toEqual({
        spec: '單點',
        price: 500,
        tax_type: '稅込',
      })
    })

    it('should accept both 稅込 and 稅拔 as tax_type', () => {
      const variant1: VariantType = {
        spec: '定食',
        price: 800,
        tax_type: '稅込',
      }

      const variant2: VariantType = {
        spec: '大杯',
        price: 680,
        tax_type: '稅拔',
      }

      expect(variant1.tax_type).toBe('稅込')
      expect(variant2.tax_type).toBe('稅拔')
    })

    it('should require price to be a number', () => {
      const variant: VariantType = {
        spec: '小盛',
        price: 450,
        tax_type: '稅込',
      }

      expect(typeof variant.price).toBe('number')
      expect(variant.price).toBeGreaterThanOrEqual(0)
    })
  })

  describe('MenuItemType structure', () => {
    it('should have all required fields: id, name_jp, name_zh, and variants', () => {
      const menuItem: MenuItemType = {
        id: 'item_1',
        name_jp: '唐揚げ',
        name_zh: '唐揚雞',
        variants: [
          { spec: '單點', price: 500, tax_type: '稅込' },
          { spec: '定食', price: 800, tax_type: '稅込' },
        ],
      }

      expect(menuItem.id).toBe('item_1')
      expect(menuItem.name_jp).toBe('唐揚げ')
      expect(menuItem.name_zh).toBe('唐揚雞')
      expect(menuItem.variants).toHaveLength(2)
    })

    it('should have variants as a non-empty array', () => {
      const menuItem: MenuItemType = {
        id: 'item_2',
        name_jp: '生ビール',
        name_zh: '生啤酒',
        variants: [{ spec: '大杯', price: 680, tax_type: '稅拔' }],
      }

      expect(Array.isArray(menuItem.variants)).toBe(true)
      expect(menuItem.variants.length).toBeGreaterThan(0)
    })

    it('should support multiple variants with different specs and prices', () => {
      const menuItem: MenuItemType = {
        id: 'item_3',
        name_jp: 'ラーメン',
        name_zh: '拉麵',
        variants: [
          { spec: '小盛', price: 750, tax_type: '稅込' },
          { spec: '並盛', price: 850, tax_type: '稅込' },
          { spec: '大盛', price: 950, tax_type: '稅込' },
        ],
      }

      expect(menuItem.variants).toHaveLength(3)
      expect(menuItem.variants[0].price).toBe(750)
      expect(menuItem.variants[1].price).toBe(850)
      expect(menuItem.variants[2].price).toBe(950)
    })

    it('should maintain data integrity with all fields present', () => {
      const variant: VariantType = {
        spec: '單點',
        price: 500,
        tax_type: '稅込',
      }

      const menuItem: MenuItemType = {
        id: 'item_4',
        name_jp: 'テンプラ',
        name_zh: '天婦羅',
        variants: [variant],
      }

      const menuItemData = JSON.stringify(menuItem)
      const parsed: MenuItemType = JSON.parse(menuItemData)

      expect(parsed.id).toBe(menuItem.id)
      expect(parsed.name_jp).toBe(menuItem.name_jp)
      expect(parsed.name_zh).toBe(menuItem.name_zh)
      expect(parsed.variants[0].spec).toBe(variant.spec)
      expect(parsed.variants[0].price).toBe(variant.price)
      expect(parsed.variants[0].tax_type).toBe(variant.tax_type)
    })
  })

  describe('TaxType validation', () => {
    it('should accept valid tax types', () => {
      const variant1: VariantType = {
        spec: 'Option 1',
        price: 100,
        tax_type: '稅込',
      }

      const variant2: VariantType = {
        spec: 'Option 2',
        price: 200,
        tax_type: '稅拔',
      }

      expect(['稅込', '稅拔']).toContain(variant1.tax_type)
      expect(['稅込', '稅拔']).toContain(variant2.tax_type)
    })
  })
})
