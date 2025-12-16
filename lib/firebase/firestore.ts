import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import type { MenuItem, MenuDocument } from "@/types/menu";

/**
 * 儲存菜單資料到 Firestore
 * @param userId - 使用者 ID
 * @param imageUrl - 菜單圖片 URL
 * @param menuItems - 解析後的菜單項目
 * @param language - 原文語言（預設為日文）
 * @returns 文件 ID
 */
export async function saveMenuDocument(
  userId: string,
  imageUrl: string,
  menuItems: MenuItem[],
  language: string = "ja"
): Promise<string> {
  try {
    const menuDoc: Omit<MenuDocument, "id"> = {
      userId,
      imageUrl,
      menuItems,
      language,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "menus"), menuDoc);
    return docRef.id;
  } catch (error) {
    console.error("儲存菜單失敗:", error);
    throw new Error("儲存菜單失敗");
  }
}

/**
 * 取得使用者的所有菜單
 * @param userId - 使用者 ID
 * @returns 菜單文件陣列
 */
export async function getUserMenus(userId: string): Promise<MenuDocument[]> {
  try {
    const q = query(
      collection(db, "menus"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const menus: MenuDocument[] = [];

    querySnapshot.forEach((doc) => {
      menus.push({
        id: doc.id,
        ...doc.data(),
      } as MenuDocument);
    });

    return menus;
  } catch (error) {
    console.error("取得菜單列表失敗:", error);
    throw new Error("取得菜單列表失敗");
  }
}

/**
 * 取得單一菜單文件
 * @param menuId - 菜單文件 ID
 * @returns 菜單文件
 */
export async function getMenuDocument(
  menuId: string
): Promise<MenuDocument | null> {
  try {
    const docRef = doc(db, "menus", menuId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as MenuDocument;
    }

    return null;
  } catch (error) {
    console.error("取得菜單失敗:", error);
    throw new Error("取得菜單失敗");
  }
}

/**
 * 刪除菜單文件
 * @param menuId - 菜單文件 ID
 */
export async function deleteMenuDocument(menuId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "menus", menuId));
  } catch (error) {
    console.error("刪除菜單失敗:", error);
    throw new Error("刪除菜單失敗");
  }
}

/**
 * 更新菜單的選中項目
 * @param menuId - 菜單文件 ID
 * @param selectedItems - 選中的項目 ID 陣列
 */
export async function updateMenuSelection(
  menuId: string,
  selectedItems: string[]
): Promise<void> {
  try {
    const docRef = doc(db, "menus", menuId);
    await updateDoc(docRef, {
      selectedItems,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("更新選中項目失敗:", error);
    throw new Error("更新選中項目失敗");
  }
}
