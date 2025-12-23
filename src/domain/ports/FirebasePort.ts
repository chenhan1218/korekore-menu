/**
 * Firebase Port (Abstract Interface)
 *
 * Defines the contract for Firebase operations including
 * Firestore data storage and Cloud Storage image uploads.
 */

import { MenuData } from '../entities/MenuData';

export interface FirebasePort {
  /**
   * Save menu data and image to Firebase
   *
   * @param userId - User ID (Anonymous or authenticated)
   * @param menu - Menu data to save
   * @returns Menu document ID
   * @throws AppError - When save operation fails
   */
  saveMenu(userId: string, menu: MenuData): Promise<string>;

  /**
   * Get user's menu history from Firebase
   *
   * @param userId - User ID
   * @returns Array of user's menus sorted by upload time
   * @throws AppError - When retrieval fails
   */
  getUserMenus(userId: string): Promise<MenuData[]>;

  /**
   * Delete a menu record from Firebase
   *
   * @param userId - User ID
   * @param menuId - Menu document ID
   * @throws AppError - When deletion fails
   */
  deleteMenu(userId: string, menuId: string): Promise<void>;

  /**
   * Save user preferences (language, settings, etc)
   *
   * @param userId - User ID
   * @param preferences - User preferences object
   * @throws AppError - When save operation fails
   */
  saveUserPreferences(userId: string, preferences: Record<string, unknown>): Promise<void>;

  /**
   * Get user preferences
   *
   * @param userId - User ID
   * @returns User preferences object
   * @throws AppError - When retrieval fails
   */
  getUserPreferences(userId: string): Promise<Record<string, unknown>>;
}
