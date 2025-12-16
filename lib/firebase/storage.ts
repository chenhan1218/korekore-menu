import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./config";
import imageCompression from "browser-image-compression";

/**
 * 壓縮圖片
 * @param file - 原始圖片檔案
 * @returns 壓縮後的圖片檔案
 */
export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1, // 最大 1MB
    maxWidthOrHeight: 1920, // 最大寬度或高度
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("圖片壓縮失敗:", error);
    return file; // 如果壓縮失敗，返回原始檔案
  }
}

/**
 * 上傳菜單圖片到 Firebase Storage
 * @param file - 圖片檔案
 * @param userId - 使用者 ID（匿名使用者使用裝置 ID）
 * @returns 圖片下載 URL
 */
export async function uploadMenuImage(
  file: File,
  userId: string
): Promise<string> {
  try {
    // 壓縮圖片
    const compressedFile = await compressImage(file);

    // 生成唯一檔名
    const timestamp = Date.now();
    const fileName = `menu_${timestamp}_${compressedFile.name}`;
    const filePath = `menus/${userId}/${fileName}`;

    // 建立 Storage 參考
    const storageRef = ref(storage, filePath);

    // 上傳檔案
    await uploadBytes(storageRef, compressedFile);

    // 取得下載 URL
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error("上傳圖片失敗:", error);
    throw new Error("上傳圖片失敗");
  }
}

/**
 * 刪除菜單圖片
 * @param imageUrl - 圖片 URL
 */
export async function deleteMenuImage(imageUrl: string): Promise<void> {
  try {
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("刪除圖片失敗:", error);
    throw new Error("刪除圖片失敗");
  }
}
