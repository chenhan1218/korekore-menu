/**
 * 重構後的首頁範例
 * 使用抽象的 UI 元件，而非直接依賴 shadcn/ui
 */

import { PrimaryButton, MenuCard } from "@/components/common";
import { Upload } from "lucide-react";

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">KoreKore</h1>
          <p className="text-xl text-muted-foreground">
            Don&apos;t speak Japanese? Just point.
          </p>
        </div>

        {/* 使用抽象的 MenuCard，而非直接使用 shadcn/ui Card */}
        <MenuCard
          title="掃描菜單"
          description="上傳菜單照片，AI 會自動翻譯並生成點餐卡"
        >
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Upload className="w-16 h-16 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              拖曳圖片到這裡，或點擊上傳
            </p>
          </div>

          {/* 使用抽象的 PrimaryButton，而非直接使用 shadcn/ui Button */}
          <PrimaryButton size="lg" fullWidth icon={<Upload />}>
            上傳菜單照片
          </PrimaryButton>
        </MenuCard>

        {/* Recent Menus */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">最近掃描的菜單</h2>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <MenuCard key={i}>
                <div className="aspect-square bg-muted" />
                <p className="text-sm text-muted-foreground mt-4">
                  尚無掃描記錄
                </p>
              </MenuCard>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

/**
 * 優點：
 * 1. 當需要換成 Material-UI 時，只需修改 PrimaryButton 和 MenuCard 的實作
 * 2. 這個頁面的代碼完全不需要改動
 * 3. 統一的 API 讓團隊協作更容易
 */
