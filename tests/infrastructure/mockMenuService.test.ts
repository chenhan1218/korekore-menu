import { describe, it, expect } from 'vitest'
import { createMockMenuItems } from '@/infrastructure/mockMenuService'
import type { MenuItemType, VariantType } from '@/types/menu'

describe('Mock Menu Service', () => {
  describe('createMockMenuItems', () => {
    it('should return exactly 20 menu items', () => {
      const menuItems = createMockMenuItems()
      expect(menuItems).toHaveLength(20)
    })

    it('should return array of MenuItemType objects', () => {
      const menuItems = createMockMenuItems()
      expect(Array.isArray(menuItems)).toBe(true)
      expect(menuItems.length).toBeGreaterThan(0)
    })

    it('should have all items with required fields', () => {
      const menuItems = createMockMenuItems()

      menuItems.forEach((item: MenuItemType) => {
        expect(item).toHaveProperty('id')
        expect(item).toHaveProperty('name_jp')
        expect(item).toHaveProperty('name_zh')
        expect(item).toHaveProperty('variants')

        expect(typeof item.id).toBe('string')
        expect(typeof item.name_jp).toBe('string')
        expect(typeof item.name_zh).toBe('string')
        expect(Array.isArray(item.variants)).toBe(true)
      })
    })

    it('should have all IDs as unique strings', () => {
      const menuItems = createMockMenuItems()
      const ids = menuItems.map(item => item.id)
      const uniqueIds = new Set(ids)

      // All IDs should be unique
      expect(uniqueIds.size).toBe(ids.length)

      // All IDs should be strings
      ids.forEach(id => {
        expect(typeof id).toBe('string')
        expect(id.length).toBeGreaterThan(0)
      })
    })

    it('should have all variants arrays with at least one variant', () => {
      const menuItems = createMockMenuItems()

      menuItems.forEach((item: MenuItemType) => {
        expect(item.variants.length).toBeGreaterThanOrEqual(1)
      })
    })

    it('should have all variants with spec, price, and tax_type', () => {
      const menuItems = createMockMenuItems()

      menuItems.forEach((item: MenuItemType) => {
        item.variants.forEach((variant: VariantType) => {
          expect(variant).toHaveProperty('spec')
          expect(variant).toHaveProperty('price')
          expect(variant).toHaveProperty('tax_type')

          expect(typeof variant.spec).toBe('string')
          expect(typeof variant.price).toBe('number')
          expect(typeof variant.tax_type).toBe('string')
        })
      })
    })

    it('should have valid tax_type values (稅込 or 稅拔)', () => {
      const menuItems = createMockMenuItems()
      const validTaxTypes = ['稅込', '稅拔']

      menuItems.forEach((item: MenuItemType) => {
        item.variants.forEach((variant: VariantType) => {
          expect(validTaxTypes).toContain(variant.tax_type)
        })
      })
    })

    it('should have positive prices for all variants', () => {
      const menuItems = createMockMenuItems()

      menuItems.forEach((item: MenuItemType) => {
        item.variants.forEach((variant: VariantType) => {
          expect(variant.price).toBeGreaterThan(0)
          expect(Number.isInteger(variant.price)).toBe(true)
        })
      })
    })

    it('should have non-empty name_jp and name_zh for all items', () => {
      const menuItems = createMockMenuItems()

      menuItems.forEach((item: MenuItemType) => {
        expect(item.name_jp.length).toBeGreaterThan(0)
        expect(item.name_zh.length).toBeGreaterThan(0)
      })
    })

    it('should have consistent data structure when called multiple times', () => {
      const firstCall = createMockMenuItems()
      const secondCall = createMockMenuItems()

      expect(firstCall.length).toBe(secondCall.length)

      // IDs should be the same
      firstCall.forEach((item, index) => {
        expect(item.id).toBe(secondCall[index].id)
        expect(item.name_jp).toBe(secondCall[index].name_jp)
        expect(item.variants.length).toBe(secondCall[index].variants.length)
      })
    })

    it('should have some items with multiple variant options', () => {
      const menuItems = createMockMenuItems()
      const multiVariantItems = menuItems.filter(item => item.variants.length > 1)

      // At least some items should have multiple variants
      expect(multiVariantItems.length).toBeGreaterThan(0)
    })

    it('should match expected Mock data structure from spec', () => {
      const menuItems = createMockMenuItems()

      // Find items that might have names matching the spec examples
      // This is a smoke test to ensure data makes sense
      menuItems.forEach((item: MenuItemType) => {
        // Verify structure matches spec examples
        expect(item.id).toMatch(/^item_\d+$/)
        expect(item.name_jp.length).toBeGreaterThan(0)
        expect(item.name_zh.length).toBeGreaterThan(0)

        item.variants.forEach((variant: VariantType) => {
          expect(variant.spec.length).toBeGreaterThan(0)
          expect(variant.price).toBeGreaterThan(0)
        })
      })
    })
  })
})
