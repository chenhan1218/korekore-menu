import { describe, it, expect, vi } from 'vitest'
import { MenuScanDomain } from '@/domain/menuScan'
import { createMockMenuItems } from '@/infrastructure/mockMenuService'
import type { MenuItemType } from '@/types/menu'

describe('MenuScanDomain', () => {
  describe('scanning menu image', () => {
    it('should create an instance of MenuScanDomain', () => {
      const domain = new MenuScanDomain()
      expect(domain).toBeDefined()
      expect(domain).toBeInstanceOf(MenuScanDomain)
    })

    it('should scan a menu image and return mock menu items', async () => {
      const domain = new MenuScanDomain()
      const menuFile = new File(
        [new Uint8Array([1, 2, 3])],
        'test.jpg',
        { type: 'image/jpeg' }
      )

      const result = await domain.scanMenuImage(menuFile)

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should return correct menu item structure after scan', async () => {
      const domain = new MenuScanDomain()
      const menuFile = new File(
        [new Uint8Array([1, 2, 3])],
        'test.jpg',
        { type: 'image/jpeg' }
      )

      const result = await domain.scanMenuImage(menuFile)

      result.forEach((item: MenuItemType) => {
        expect(item).toHaveProperty('id')
        expect(item).toHaveProperty('name_jp')
        expect(item).toHaveProperty('name_zh')
        expect(item).toHaveProperty('variants')
        expect(Array.isArray(item.variants)).toBe(true)
      })
    })

    it('should handle multiple image formats', async () => {
      const domain = new MenuScanDomain()

      const jpgFile = new File([new Uint8Array([1, 2, 3])], 'test.jpg', {
        type: 'image/jpeg',
      })
      const pngFile = new File([new Uint8Array([1, 2, 3])], 'test.png', {
        type: 'image/png',
      })

      const jpgResult = await domain.scanMenuImage(jpgFile)
      const pngResult = await domain.scanMenuImage(pngFile)

      expect(jpgResult.length).toBe(pngResult.length)
      expect(jpgResult[0].id).toBe(pngResult[0].id)
    })

    it('should maintain data consistency across multiple scans', async () => {
      const domain = new MenuScanDomain()
      const menuFile = new File(
        [new Uint8Array([1, 2, 3])],
        'test.jpg',
        { type: 'image/jpeg' }
      )

      const firstScan = await domain.scanMenuImage(menuFile)
      const secondScan = await domain.scanMenuImage(menuFile)

      // Results should be consistent
      expect(firstScan.length).toBe(secondScan.length)

      firstScan.forEach((item, index) => {
        expect(item.id).toBe(secondScan[index].id)
        expect(item.name_jp).toBe(secondScan[index].name_jp)
        expect(item.variants.length).toBe(secondScan[index].variants.length)
      })
    })

    it('should return menu items matching spec structure', async () => {
      const domain = new MenuScanDomain()
      const menuFile = new File(
        [new Uint8Array([1, 2, 3])],
        'test.jpg',
        { type: 'image/jpeg' }
      )

      const result = await domain.scanMenuImage(menuFile)

      expect(result.length).toBe(20) // Spec requires 20 items

      result.forEach((item: MenuItemType) => {
        // Verify structure matches spec examples
        expect(item.id).toMatch(/^item_\d+$/)
        expect(item.name_jp.length).toBeGreaterThan(0)
        expect(item.name_zh.length).toBeGreaterThan(0)
        expect(item.variants.length).toBeGreaterThanOrEqual(1)

        item.variants.forEach(variant => {
          expect(variant.spec.length).toBeGreaterThan(0)
          expect(typeof variant.price).toBe('number')
          expect(variant.price).toBeGreaterThan(0)
          expect(['稅込', '稅拔']).toContain(variant.tax_type)
        })
      })
    })

    it('should convert image file to menu items correctly', async () => {
      const domain = new MenuScanDomain()
      const mockImage = new File(
        [new Uint8Array([137, 80, 78, 71])],
        'menu.png',
        { type: 'image/png' }
      )

      const items = await domain.scanMenuImage(mockImage)

      expect(items.length).toBeGreaterThan(0)
      expect(items.every(item => item.id && item.name_jp && item.name_zh)).toBe(
        true
      )
    })

    it('should handle empty file gracefully', async () => {
      const domain = new MenuScanDomain()
      const emptyFile = new File([], 'empty.jpg', { type: 'image/jpeg' })

      // Should still return mock data (not fail)
      const items = await domain.scanMenuImage(emptyFile)

      expect(Array.isArray(items)).toBe(true)
      expect(items.length).toBeGreaterThan(0)
    })

    it('should provide access to mock menu data service', () => {
      const domain = new MenuScanDomain()
      const mockItems = createMockMenuItems()

      expect(mockItems.length).toBe(20)
      expect(mockItems[0]).toHaveProperty('id')
      expect(mockItems[0]).toHaveProperty('variants')
    })
  })

  describe('menu item transformation', () => {
    it('should preserve all menu item fields during processing', async () => {
      const domain = new MenuScanDomain()
      const originalItems = createMockMenuItems()

      const processedItems = await domain.scanMenuImage(
        new File([], 'test.jpg', { type: 'image/jpeg' })
      )

      originalItems.forEach((original, index) => {
        const processed = processedItems[index]
        expect(processed.id).toBe(original.id)
        expect(processed.name_jp).toBe(original.name_jp)
        expect(processed.name_zh).toBe(original.name_zh)
        expect(processed.variants.length).toBe(original.variants.length)
      })
    })

    it('should validate variant data integrity', async () => {
      const domain = new MenuScanDomain()
      const items = await domain.scanMenuImage(
        new File([], 'test.jpg', { type: 'image/jpeg' })
      )

      items.forEach(item => {
        item.variants.forEach(variant => {
          // Ensure no corruption
          expect(Number.isNaN(variant.price)).toBe(false)
          expect(variant.price).toBeGreaterThan(0)
          expect(variant.tax_type === '稅込' || variant.tax_type === '稅拔').toBe(
            true
          )
        })
      })
    })
  })
})
