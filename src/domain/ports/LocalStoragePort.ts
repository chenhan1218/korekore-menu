/**
 * LocalStorage Port (Abstract Interface)
 *
 * Defines the contract for local client-side storage.
 * Used for offline support and local caching.
 */

export interface LocalStoragePort {
  /**
   * Save data to local storage
   *
   * @param key - Storage key
   * @param value - Data to store (will be JSON serialized)
   */
  set(key: string, value: unknown): Promise<void>;

  /**
   * Retrieve data from local storage
   *
   * @param key - Storage key
   * @returns Stored data or null if not found
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Remove data from local storage
   *
   * @param key - Storage key
   */
  remove(key: string): Promise<void>;

  /**
   * Clear all local storage
   */
  clear(): Promise<void>;

  /**
   * Get all keys in local storage
   *
   * @returns Array of storage keys
   */
  keys(): Promise<string[]>;

  /**
   * Get size of local storage usage (in bytes)
   *
   * @returns Used bytes
   */
  getSize(): Promise<number>;
}
