import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

export default function HomePage() {
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

        {/* Upload Card */}
        <Card className="border-2 border-dashed">
          <CardHeader>
            <CardTitle className="text-2xl">掃描菜單</CardTitle>
            <CardDescription>
              上傳菜單照片，AI 會自動翻譯並生成點餐卡
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Upload className="w-16 h-16 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                拖曳圖片到這裡，或點擊上傳
              </p>
            </div>
            <Button size="lg" className="w-full">
              <Upload className="mr-2 h-5 w-5" />
              上傳菜單照片
            </Button>
          </CardContent>
        </Card>

        {/* Recent Menus */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">最近掃描的菜單</h2>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
            {/* Placeholder cards */}
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-square bg-muted" />
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    尚無掃描記錄
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
