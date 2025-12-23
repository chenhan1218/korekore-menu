/**
 * MenuData Entity
 *
 * Represents a complete menu with all its parsed items and metadata.
 */

import { MenuItem } from './MenuItem';

export interface MenuData {
  readonly id: string; // Firestore document ID
  readonly imageUrl: string; // URL to the menu image in Cloud Storage
  readonly items: MenuItem[]; // Array of menu items
  readonly originalLanguage: string; // Language of original menu
  readonly uploadedAt: Date; // Upload timestamp
  readonly notes?: string; // Optional user notes
  readonly confidence?: number; // AI parsing confidence (0-1)
}

/**
 * Create a new MenuData
 *
 * @param id - Document ID
 * @param imageUrl - Image URL
 * @param items - Menu items array
 * @param originalLanguage - Original language
 * @param uploadedAt - Upload timestamp
 * @param notes - Optional notes
 * @param confidence - Optional confidence score
 * @returns MenuData object
 */
export const createMenuData = (
  id: string,
  imageUrl: string,
  items: MenuItem[],
  originalLanguage: string,
  uploadedAt: Date = new Date(),
  notes?: string,
  confidence?: number
): MenuData => {
  if (!id || !imageUrl || !items || items.length === 0 || !originalLanguage) {
    throw new Error('MenuData requires id, imageUrl, non-empty items, and originalLanguage');
  }

  if (confidence !== undefined && (confidence < 0 || confidence > 1)) {
    throw new Error('Confidence must be between 0 and 1');
  }

  return {
    id,
    imageUrl,
    items,
    originalLanguage,
    uploadedAt,
    ...(notes && { notes }),
    ...(confidence !== undefined && { confidence }),
  };
};

/**
 * Calculate total number of items in menu
 */
export const getItemCount = (menu: MenuData): number => {
  return menu.items.length;
};

/**
 * Get menu creation date in ISO string format
 */
export const getUploadedAtISO = (menu: MenuData): string => {
  return menu.uploadedAt.toISOString();
};
