import { Timestamp } from "firebase/firestore";

/**
 * 菜單項目
 */
export interface MenuItem {
  id: string;
  name: string; // 原文菜名
  name_zh_TW: string; // 繁體中文翻譯 + 描述
  price: string; // 價格
}

/**
 * 菜單文件（Firestore）
 */
export interface MenuDocument {
  id: string; // Firestore 文件 ID
  userId: string; // 使用者 ID（匿名或已登入）
  imageUrl: string; // 菜單圖片 URL
  menuItems: MenuItem[]; // 解析後的菜單項目
  selectedItems?: string[]; // 使用者選中的項目 ID
  language: string; // 原文語言（ja, ko, th 等）
  createdAt: Timestamp; // 建立時間
  updatedAt: Timestamp; // 更新時間
}

/**
 * Gemini API 回應格式
 */
export interface GeminiMenuResponse {
  menuItems: Omit<MenuItem, "id">[];
}

/**
 * 點餐卡資料
 */
export interface OrderCard {
  menuId: string;
  selectedItems: MenuItem[];
  orderText: string; // 原文點餐文字
  createdAt: Date;
}
