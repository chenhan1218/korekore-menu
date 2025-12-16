/**
 * 使用者資料
 */
export interface UserProfile {
  uid: string;
  isAnonymous: boolean;
  email?: string;
  displayName?: string;
  photoURL?: string;
  preferredLanguage: "zh-TW" | "en"; // 介面語言偏好
}

/**
 * 使用者偏好設定
 */
export interface UserPreferences {
  language: "zh-TW" | "en";
  theme: "light" | "dark" | "system";
}
