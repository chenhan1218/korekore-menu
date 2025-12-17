/**
 * MenuItem Entity
 *
 * Represents a single menu item extracted from a menu image.
 * This is a core business entity.
 */

export interface MenuItem {
  readonly id: string // Unique identifier (UUID or similar)
  readonly name: string // Original menu item name (e.g., 天婦羅)
  readonly name_zh_TW: string // Traditional Chinese translation + brief taste description
  readonly price: string // Price in original format (e.g., ¥1500)
  readonly description?: string // Optional additional description
  readonly image?: string // Optional image URL for the dish
}

/**
 * Create a new MenuItem
 *
 * @param id - Unique identifier
 * @param name - Original name
 * @param name_zh_TW - Chinese translation
 * @param price - Price
 * @param description - Optional description
 * @param image - Optional image URL
 * @returns MenuItem object
 */
export const createMenuItem = (
  id: string,
  name: string,
  name_zh_TW: string,
  price: string,
  description?: string,
  image?: string
): MenuItem => {
  if (!id || !name || !name_zh_TW || !price) {
    throw new Error('MenuItem requires id, name, name_zh_TW, and price')
  }

  return {
    id,
    name,
    name_zh_TW,
    price,
    ...(description && { description }),
    ...(image && { image }),
  }
}
