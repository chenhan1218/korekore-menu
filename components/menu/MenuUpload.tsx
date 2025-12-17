"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useFileUpload } from "@/hooks/useFileUpload";
import { MenuCard } from "@/components/common";
import { PrimaryButton } from "@/components/common";
import { Upload, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import type { MenuDocument } from "@/types/menu";

interface MenuUploadProps {
  /**
   * 上傳成功時的回調函數
   * 返回臨時菜單物件（含 imageUrl）供父元件使用
   */
  onUploadSuccess?: (tempMenu: Omit<MenuDocument, "id" | "menuItems">) => void;
}

/**
 * 菜單上傳組件
 * 支援拖拽上傳和點擊選擇檔案
 */
export function MenuUpload({ onUploadSuccess }: MenuUploadProps) {
  const t = useTranslations("home");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const { isLoading, error, progress, uploadFile } = useFileUpload();

  /**
   * 處理拖拽進入
   */
  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(true);
    },
    []
  );

  /**
   * 處理拖拽離開
   */
  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
    },
    []
  );

  /**
   * 處理拖拽放下
   */
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  /**
   * 處理拖拽放下時的檔案
   */
  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        await handleFileSelect(files[0]);
      }
    },
    []
  );

  /**
   * 處理檔案選擇
   */
  const handleFileSelect = useCallback(
    async (file: File) => {
      const result = await uploadFile(file);
      if (result) {
        onUploadSuccess?.(result);
      }
    },
    [uploadFile, onUploadSuccess]
  );

  /**
   * 處理檔案輸入變更
   */
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.currentTarget.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  /**
   * 觸發檔案選擇對話框
   */
  const handleClickUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <MenuCard
      title={t("upload_title")}
      description={t("upload_description")}
      className="border-2 border-dashed"
    >
      <div className="space-y-4">
        {/* 拖拽區域 */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`
            flex flex-col items-center justify-center py-12 space-y-4
            rounded-lg border-2 border-dashed transition-colors
            ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }
            ${isLoading ? "pointer-events-none opacity-75" : ""}
          `}
        >
          {/* 進度條 */}
          {isLoading && progress > 0 && (
            <div className="w-full px-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">上傳中...</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* 上傳成功 */}
          {!isLoading && progress === 100 && (
            <>
              <CheckCircle2 className="w-16 h-16 text-green-500" />
              <p className="text-sm font-medium text-green-600">
                上傳成功！正在進行 AI 解析...
              </p>
            </>
          )}

          {/* 預設狀態（可拖拽或點擊） */}
          {!isLoading && progress !== 100 && (
            <>
              <Upload
                className={`w-16 h-16 transition-colors ${
                  isDragActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  {t("upload_hint")}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  支援 JPEG、PNG、WebP 格式，最大 10MB
                </p>
              </div>
            </>
          )}
        </div>

        {/* 錯誤提示 */}
        {error && (
          <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">上傳失敗</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* 上傳按鈕 */}
        {!isLoading && progress !== 100 && (
          <PrimaryButton
            onClick={handleClickUpload}
            disabled={isLoading}
            fullWidth
            size="lg"
            icon={<Upload className="h-5 w-5" />}
          >
            {isLoading ? "上傳中..." : "上傳菜單照片"}
          </PrimaryButton>
        )}

        {/* 隱藏的檔案輸入 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isLoading}
        />
      </div>
    </MenuCard>
  );
}
