/**
 * Menu Scan Domain Logic
 * Handles the business logic for menu image scanning and processing
 * Implements Clean Architecture domain layer
 */

import { createMockMenuItems, mockMenuScanService } from '@/infrastructure/mockMenuService'
import type { MenuItemType } from '@/types/menu'

/**
 * MenuScanDomain
 * Encapsulates the core business logic for menu scanning
 * Coordinates between infrastructure services and domain entities
 */
export class MenuScanDomain {
  /**
   * Scans a menu image and returns parsed menu items
   * Currently uses mock data service (will integrate with Gemini API later)
   *
   * @param imageFile - The menu image file to scan
   * @returns Promise resolving to array of MenuItemType
   */
  async scanMenuImage(imageFile: File): Promise<MenuItemType[]> {
    // Validate input
    this.validateImageFile(imageFile)

    // Call mock service (will be replaced with Gemini API)
    const menuItems = await this.processMenuImage(imageFile)

    // Validate output
    this.validateMenuItems(menuItems)

    return menuItems
  }

  /**
   * Process menu image and extract menu items
   * Currently delegates to mock service
   *
   * @param _imageFile - The image file to process (not used in MVP, will be used with Gemini API)
   * @returns Promise resolving to array of menu items
   * @private
   */
  private async processMenuImage(_imageFile: File): Promise<MenuItemType[]> {
    // In MVP phase, use mock service
    // This will be replaced with Gemini API integration
    return await mockMenuScanService()
  }

  /**
   * Validates that the image file is in correct format and size
   *
   * @param imageFile - The file to validate
   * @throws Error if validation fails
   * @private
   */
  private validateImageFile(imageFile: File): void {
    // Validate file type (if provided)
    const validTypes = ['image/jpeg', 'image/png']
    if (imageFile.type && !validTypes.includes(imageFile.type)) {
      throw new Error(`Invalid image format: ${imageFile.type}. Supported formats: JPG, PNG`)
    }

    // Validate file size (15MB limit as per spec)
    const maxSize = 15 * 1024 * 1024 // 15MB
    if (imageFile.size > maxSize) {
      throw new Error(`Image file too large: ${imageFile.size} bytes. Maximum: ${maxSize} bytes`)
    }

    // Note: Empty files are allowed for MVP (mock data will be returned)
  }

  /**
   * Validates that menu items match the expected structure
   *
   * @param menuItems - The menu items to validate
   * @throws Error if validation fails
   * @private
   */
  private validateMenuItems(menuItems: MenuItemType[]): void {
    // Validate is array
    if (!Array.isArray(menuItems)) {
      throw new Error('Menu items must be an array')
    }

    // Validate has items
    if (menuItems.length === 0) {
      throw new Error('Menu items array is empty')
    }

    // Validate each item
    menuItems.forEach((item, index) => {
      this.validateMenuItem(item, index)
    })
  }

  /**
   * Validates a single menu item
   *
   * @param item - The menu item to validate
   * @param index - The index of the item in the array
   * @throws Error if validation fails
   * @private
   */
  private validateMenuItem(item: MenuItemType, index: number): void {
    // Check required fields
    if (!item.id || typeof item.id !== 'string') {
      throw new Error(`Item ${index}: Missing or invalid id field`)
    }

    if (!item.name_jp || typeof item.name_jp !== 'string') {
      throw new Error(`Item ${index}: Missing or invalid name_jp field`)
    }

    if (!item.name_zh || typeof item.name_zh !== 'string') {
      throw new Error(`Item ${index}: Missing or invalid name_zh field`)
    }

    if (!Array.isArray(item.variants) || item.variants.length === 0) {
      throw new Error(`Item ${index}: Missing or empty variants array`)
    }

    // Validate variants
    item.variants.forEach((variant, variantIndex) => {
      this.validateVariant(variant, index, variantIndex)
    })
  }

  /**
   * Validates a single variant within a menu item
   *
   * @param variant - The variant to validate
   * @param itemIndex - The index of the parent item
   * @param variantIndex - The index of the variant
   * @throws Error if validation fails
   * @private
   */
  private validateVariant(variant: Record<string, unknown>, itemIndex: number, variantIndex: number): void {
    const path = `Item ${itemIndex}, Variant ${variantIndex}`

    if (!variant.spec || typeof variant.spec !== 'string') {
      throw new Error(`${path}: Missing or invalid spec field`)
    }

    if (typeof variant.price !== 'number' || variant.price <= 0) {
      throw new Error(`${path}: Missing or invalid price field (must be positive number)`)
    }

    const validTaxTypes = ['稅込', '稅拔']
    if (!validTaxTypes.includes(variant.tax_type as string)) {
      throw new Error(`${path}: Invalid tax_type. Must be '稅込' or '稅拔'`)
    }
  }

  /**
   * Gets mock menu items directly (for testing/development)
   *
   * @returns Array of mock menu items
   */
  getMockMenuItems(): MenuItemType[] {
    return createMockMenuItems()
  }
}
