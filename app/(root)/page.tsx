"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MenuUpload } from "@/components/menu";
import { Card, CardContent } from "@/components/ui/card";
import type { MenuDocument } from "@/types/menu";

export default function HomePage() {
  const t = useTranslations();
  const [uploadedMenu, setUploadedMenu] = useState<
    Omit<MenuDocument, "id" | "menuItems"> | null
  >(null);

  /**
   * 處理上傳成功
   * 接收臨時菜單物件，後續將呼叫 Gemini API 進行解析
   */
  const handleUploadSuccess = (
    tempMenu: Omit<MenuDocument, "id" | "menuItems">
  ) => {
    setUploadedMenu(tempMenu);
    // TODO: 呼叫 Gemini API 解析菜單
    console.log("上傳成功，準備進行 AI 解析:", tempMenu);
  };

  return (
    <main className="container mx-auto px-4 py-8 safe-area-top safe-area-bottom">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            KoreKore
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Don&apos;t speak Japanese? Just point.
          </p>
        </div>

        {/* Upload Component */}
        <MenuUpload onUploadSuccess={handleUploadSuccess} />

        {/* Uploaded Menu Status */}
        {uploadedMenu && (
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-green-900">
                ✅ 菜單已上傳，正在進行 AI 解析...
              </p>
              <p className="text-xs text-green-700 mt-2">
                圖片 URL: {uploadedMenu.imageUrl.substring(0, 50)}...
              </p>
            </CardContent>
          </Card>
        )}

        {/* Recent Menus */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">{t("home.recentMenus")}</h2>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
            {/* Placeholder cards */}
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-square bg-muted" />
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    {t("history.empty")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
