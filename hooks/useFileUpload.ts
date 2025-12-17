"use client";

import { useState, useCallback } from "react";
import { uploadMenuImage } from "@/lib/firebase/storage";
import { getCurrentUserId, signInAnonymous } from "@/lib/firebase/auth";
import { useMenuStore } from "@/lib/stores/useMenuStore";
import type { MenuDocument } from "@/types/menu";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface FileUploadState {
  isLoading: boolean;
  error: string | null;
  progress: number;
}

/**
 * 檔案上傳 Hook
 * 處理菜單圖片上傳、Firestore 儲存等邏輯
 */
export function useFileUpload() {
  const [state, setState] = useState<FileUploadState>({
    isLoading: false,
    error: null,
    progress: 0,
  });

  const { addMenu, setError: setStoreError } = useMenuStore();

  /**
   * 確保使用者已登入（匿名或已驗證）
   */
  const ensureUserLoggedIn = useCallback(async (): Promise<string> => {
    let userId = getCurrentUserId();

    if (!userId) {
      try {
        const user = await signInAnonymous();
        userId = user.uid;
      } catch (error) {
        throw new Error("無法取得使用者身份");
      }
    }

    return userId;
  }, []);

  /**
   * 驗證檔案
   */
  const validateFile = useCallback((file: File): string | null => {
    // 檢查檔案類型
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return "僅支援 JPEG、PNG、WebP 格式";
    }

    // 檢查檔案大小（最大 10MB）
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return "檔案大小不能超過 10MB";
    }

    return null;
  }, []);

  /**
   * 上傳檔案
   */
  const uploadFile = useCallback(
    async (file: File) => {
      setState({ isLoading: true, error: null, progress: 0 });

      try {
        // 驗證檔案
        const validationError = validateFile(file);
        if (validationError) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: validationError,
          }));
          return null;
        }

        setState((prev) => ({ ...prev, progress: 20 }));

        // 確保使用者已登入
        const userId = await ensureUserLoggedIn();

        setState((prev) => ({ ...prev, progress: 40 }));

        // 上傳圖片到 Firebase Storage
        const imageUrl = await uploadMenuImage(file, userId);

        setState((prev) => ({ ...prev, progress: 70 }));

        // 建立菜單文件（暫時不上傳到 Firestore，等待 Gemini 解析後再儲存）
        // 這裡返回臨時菜單物件給 parent component 使用
        const tempMenu: Omit<MenuDocument, "id" | "menuItems"> = {
          userId,
          imageUrl,
          language: "ja", // 預設日文，後續由 Gemini 判斷
          createdAt: serverTimestamp() as any,
          updatedAt: serverTimestamp() as any,
        };

        setState({ isLoading: false, error: null, progress: 100 });

        return tempMenu;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "上傳失敗，請重試";
        setState({
          isLoading: false,
          error: errorMessage,
          progress: 0,
        });
        setStoreError(errorMessage);
        return null;
      }
    },
    [validateFile, ensureUserLoggedIn, setStoreError]
  );

  return {
    ...state,
    uploadFile,
  };
}
