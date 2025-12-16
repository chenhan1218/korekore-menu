import {
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "./config";

/**
 * 匿名登入
 * @returns 使用者物件
 */
export async function signInAnonymous(): Promise<User> {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error("匿名登入失敗:", error);
    throw new Error("匿名登入失敗");
  }
}

/**
 * Google 登入
 * @returns 使用者物件
 */
export async function signInWithGoogle(): Promise<User> {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Google 登入失敗:", error);
    throw new Error("Google 登入失敗");
  }
}

/**
 * 登出
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("登出失敗:", error);
    throw new Error("登出失敗");
  }
}

/**
 * 監聽認證狀態變化
 * @param callback - 回調函數
 * @returns 取消訂閱函數
 */
export function onAuthChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * 取得目前使用者 ID（匿名或已登入）
 * @returns 使用者 ID
 */
export function getCurrentUserId(): string | null {
  return auth.currentUser?.uid || null;
}

/**
 * 檢查是否為匿名使用者
 * @returns 是否為匿名使用者
 */
export function isAnonymous(): boolean {
  return auth.currentUser?.isAnonymous ?? true;
}
