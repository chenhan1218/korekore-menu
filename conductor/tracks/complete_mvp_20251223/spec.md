# MVP 完成規格書

**Track ID:** `complete_mvp_20251223`

**優先級:** 🔴 高

**目標:** 完成 KoreKore 應用的端到端用戶流程 MVP（使用 Mock 菜單數據），確保用戶可以完整體驗「拍照 → 存圖 → 點餐 → 生成點餐卡」的核心流程。

---

## 📋 功能概述

### MVP 端到端流程（4 大功能）

1. **菜單圖片掃描與上傳**
   - 用戶拍照或選擇本地菜單圖片
   - 上傳圖片至 Firebase Cloud Storage
   - 顯示圖片預覽

2. **菜單解析（Mock 數據）** ✨ 重點：暫不呼叫真實 Gemini API
   - 返回預設的 Mock 菜單數據
   - 模擬 AI 解析的效果（用戶可完整體驗流程）
   - 便於後續接入真實 Gemini API

3. **點餐介面**
   - 展示 Mock 菜單項目（含翻譯、價格）
   - 用戶勾選菜項
   - 實時預覽已選項目

4. **點餐卡生成與分享**
   - 根據選擇生成日文敬語點餐文本
   - 支援複製到剪貼板
   - 支援 Web Share API 分享

---

## 🎯 功能需求詳細說明

### 1. 菜單圖片掃描與上傳

**用戶流程:**
```
主頁 → 點擊「掃描菜單」→
  選擇/拍照菜單圖片 →
  應用上傳至 Firebase →
  顯示上傳進度 →
  進入點餐介面
```

**功能性需求:**

- ❌ UI 層缺失:
  - `HomePage` - 應用首頁
  - `MenuScanPage` - 掃描頁面
  - `FileUploadInput` - 文件上傳/相機組件
  - `ProgressIndicator` - 上傳進度指示器
  - `ImagePreview` - 圖片預覽組件

- ❌ Infrastructure 層缺失:
  - `FirebaseStorageAdapter` 實現:
    - `uploadMenuImage(file)` - 上傳圖片至 Cloud Storage
    - `getImageUrl(storagePath)` - 獲取圖片 URL

**技術細節:**

```typescript
// 上傳流程
1. 用戶選擇圖片 (JPG/PNG)
2. 前端驗證: 文件大小 < 10MB, 圖片格式正確
3. 上傳至 Firebase: /menus/{timestamp}_{random}.jpg
4. 返回圖片 URL 供後續使用
```

**驗收條件:**
- [ ] 用戶可從本地選擇圖片或使用相機
- [ ] 支援 JPG/PNG 格式，文件大小限制 10MB
- [ ] 上傳時顯示進度條
- [ ] 上傳成功後顯示圖片預覽
- [ ] 上傳失敗顯示友善的錯誤消息
- [ ] 圖片 URL 正確保存供後續使用

---

### 2. 菜單解析（使用 Mock 數據）

**重要說明：** 🎯 本階段 **不調用真實 Gemini API**，使用 Mock 數據模擬 AI 解析結果。

**用戶流程:**
```
圖片上傳成功 →
  應用模擬 AI 解析（返回 Mock 數據） →
  顯示菜單項目列表 →
  進入點餐介面
```

**Mock 數據結構:**

```typescript
// 返回的菜單數據結構（固定 Mock 數據）
const mockMenuData: MenuData = {
  id: "menu_" + Date.now(),
  imageUrl: "...", // Firebase 上傳的圖片 URL
  restaurantInfo: {
    name: "示例日式餐廳",
    location: "東京都"
  },
  items: [
    {
      id: "item_1",
      japaneseName: "カツ丼",
      chineseName: "豬排蓋飯",
      description: "炸豬排配上洋蔥，淋上特製醬汁",
      price: "¥1,200",
      category: "丼飯"
    },
    {
      id: "item_2",
      japaneseName: "天丼",
      chineseName: "天婦羅蓋飯",
      description: "酥脆天婦羅配蛋液",
      price: "¥1,100",
      category: "丼飯"
    },
    // ... 更多菜項
  ]
}
```

**功能性需求:**

- ✅ Domain 層: `ParseMenuImage` UseCase 已實現
- ❌ Infrastructure 層缺失:
  - `MockMenuAdapter` 實現:
    - `parseMenuImage(imageUrl)` - 返回 Mock 菜單數據
    - 模擬 2-3 秒的延遲（模擬 API 調用）

- ❌ UI 層缺失:
  - `LoadingProgressBar` - 解析進度條
  - 解析狀態管理（Zustand）

**驗收條件:**
- [ ] 圖片上傳後自動觸發菜單解析
- [ ] 顯示加載進度（2-3 秒）
- [ ] 返回完整的 Mock 菜單數據
- [ ] 成功後自動進入點餐介面
- [ ] 錯誤時顯示重試選項

**後續接入真實 API：**
```
未來只需替換 MockMenuAdapter → GeminiAdapter
無需修改業務邏輯或 UI 層
```

---

### 3. 點餐介面

**用戶流程:**
```
菜單解析完成 →
  進入點餐頁面 →
  瀏覽菜單項目（含翻譯、價格、說明）→
  勾選欲點菜項 →
  右側預覽已選項目 →
  點擊「生成點餐卡」
```

**功能性需求:**

- ❌ Domain 層缺失:
  - `OrderSelectionUseCase` - 管理點餐選擇邏輯
  - 驗證選擇邏輯

- ❌ UI 層缺失:
  - `MenuDetailPage` - 菜單詳情頁面
  - `MenuItemCard` - 菜項卡片組件
  - `OrderSummary` - 點餐摘要面板
  - Zustand Store: `orderStore` - 管理點餐狀態

**功能特性:**

- **菜項卡片顯示:**
  - 日文名稱（大標題）
  - 中文翻譯（副標題）
  - 價格（醒目顯示）
  - 簡短說明（描述）
  - 勾選框

- **互動功能:**
  - 點擊勾選/取消
  - 數量調整（+/- 按鈕）
  - 實時計算選擇總價
  - 搜索菜項（可選）

- **右側摘要面板:**
  - 已選菜項列表
  - 小計與選項總數
  - 「生成點餐卡」按鈕

**頁面佈局:**
```
┌─────────────────────────────────────┐
│  KoreKore | 返回 | 菜單名稱          │
├──────────────────┬──────────────────┤
│                  │                  │
│  菜項卡片列表    │   點餐摘要面板   │
│  (左側)          │   (右側)          │
│  - 菜項 1 [ ]    │   已選項目:       │
│  - 菜項 2 [ ]    │   □ 菜項1 x2     │
│  - 菜項 3 [ ]    │   □ 菜項3 x1     │
│                  │                  │
│                  │   小計: ¥3,500   │
│                  │                  │
│                  │  [生成點餐卡]     │
└──────────────────┴──────────────────┘
```

**驗收條件:**
- [ ] 菜單正確顯示所有項目（日文、中文翻譯、價格）
- [ ] 用戶可勾選/取消菜項
- [ ] 數量調整功能正常
- [ ] 摘要面板實時更新小計
- [ ] 勾選狀態在頁面刷新後保留（LocalStorage）
- [ ] 響應式設計：mobile 上單欄佈局，desktop 上雙欄佈局

---

### 4. 點餐卡生成與分享

**用戶流程:**
```
選擇完菜項 →
  點擊「生成點餐卡」→
  應用組裝日文敬語文本 →
  展示點餐卡 →
  用戶可複製或分享
```

**功能性需求:**

- ❌ Domain 層缺失:
  - `GenerateOrderCardUseCase` - 點餐卡生成邏輯
  - 敬語格式化規則
  - 文本格式化

- ❌ Infrastructure 層缺失:
  - `OrderCardFormatter` 實現:
    - `formatAsText(selectedItems)` - 生成文字版

- ❌ UI 層缺失:
  - `OrderCardModal` 或 `OrderCardPage` - 點餐卡展示
  - `CopyButton` - 複製到剪貼板
  - `ShareButton` - 分享按鈕（使用 Web Share API）
  - 樣式美化（卡片設計）

**點餐卡內容示例:**

```
═══════════════════════════════════
          當前菜單點餐卡
═══════════════════════════════════

【選餐項目】
① カツ丼（豬排蓋飯）×2
② 天丼（天婦羅蓋飯）×1

─────────────────────────────────

【敬語注文】

カツ丼を二つください。
(請給我 2 份豬排蓋飯)

天丼を一つください。
(請給我 1 份天婦羅蓋飯)

─────────────────────────────────

合計金額: ¥3,500

生成時間: 2025-12-23 14:30
═══════════════════════════════════
```

**分享功能:**

支援 Web Share API（於 mobile 和部分 desktop 浏览器）：
- 用戶點擊「分享」按鈕
- 應用彈出分享選單（iMessage, WhatsApp, 郵件等）
- 分享內容為點餐卡文本

**驗收條件:**
- [ ] 根據選擇的菜項生成點餐卡
- [ ] 日文敬語格式正確
- [ ] 點餐卡清晰易讀（含標題、項目、合計）
- [ ] 用戶可一鍵複製全文
- [ ] 複製成功有視覺反饋（toast 提示）
- [ ] 支援 Web Share API 分享（mobile 優先）
- [ ] 點餐卡可返回編輯選擇

---

## 📊 質量要求

### 代碼品質標準

- **TypeScript:** 嚴格模式，零類型錯誤
- **測試覆蓋:**
  - Domain 層: ≥ 80%
  - Infrastructure 層 (Adapters): ≥ 70%
  - React Hooks: ≥ 60%
  - 組件測試: ≥ 40%（關鍵組件）
- **Linting:** ESLint 無警告，Prettier 自動格式化
- **文檔:** 所有公開 API 有 JSDoc 註釋

### 性能指標

- **首頁加載:** ≤ 2 秒
- **菜單解析（Mock）:** ≤ 3 秒
- **點餐卡生成:** ≤ 1 秒
- **Lighthouse 分數:** ≥ 80（Performance, Accessibility, Best Practices）

### 可訪問性

- 支援屏幕閱讀器（ARIA Labels）
- 鍵盤導航支援（Tab, Enter, Space）
- 顏色對比達 WCAG AA 標準
- 響應式設計適配 mobile (320px) 至 desktop (1920px)

---

## 🔧 技術棧確認

| 層級 | 技術 | 狀態 |
|------|------|------|
| **Domain** | TypeScript | ✅ 完成 |
| **Infrastructure** | Firebase Storage, Mock Adapter | ❌ 實現缺失 |
| **UI** | React, React Router, Zustand, TailwindCSS | ❌ 實現缺失 |
| **Testing** | Vitest, React Testing Library | ❌ 零覆蓋 |
| **CI/CD** | GitHub Actions | ❌ 缺失 |
| **Hosting** | Vercel | ❌ 未配置 |

---

## 📦 出版物

**功能完成後應交付：**

1. ✅ 完整可運行的 Web 應用
   - 支援 Chrome, Safari, Firefox 最新版
   - 響應式設計（mobile 320px, tablet 768px, desktop 1920px）
   - 部署至 Vercel
   - 打開即可體驗完整流程（無需認證）

2. ✅ 測試覆蓋與品質檢查
   - Domain 層單元測試（≥ 80%）
   - Infrastructure Adapters 測試（≥ 70%）
   - React Hooks 單元測試（≥ 60%）
   - 關鍵組件測試（≥ 40%）
   - Lighthouse 得分 ≥ 80

3. ✅ 自動化 CI/CD
   - GitHub Actions 工作流：
     - TypeScript 類型檢查
     - ESLint + Prettier 檢查
     - 自動化測試運行
     - 構建驗證
   - 構建成功後自動部署至 Vercel

4. ✅ 文檔更新
   - ARCHITECTURE.md - 更新實現細節
   - FEATURE-CHECKLIST.md - 標記完成的功能
   - DECISIONS.md - 記錄設計決策（Mock vs Real API）
   - README.md - 更新使用說明

5. ✅ 代碼品質報告
   - 測試覆蓋率報告
   - Lighthouse 報告
   - 代碼複雜度分析

---

## 🚫 超出範圍

以下功能 **不** 包含在本 Track 內：

- **真實 Gemini API 呼叫** - 使用 Mock 數據替代
- **用戶認證** - 留待下一個 Track（Firebase Auth）
- **Firebase Firestore 同步** - 依賴認證，暫不實現
- **菜單歷史跨設備同步** - 僅支援本設備 LocalStorage
- 多語系支援（i18n）
- 社群功能（分享、評論）
- 離線模式（Service Worker）
- 下載點餐卡為文件

---

## ✅ 定義完成（DoD）

Track 完成的標準：

- [ ] 用戶可完整走通「拍照 → 存圖 → 點餐 → 生成點餐卡」流程
- [ ] 所有 4 大功能完全實現
- [ ] Domain 層單元測試通過（≥ 80% 覆蓋）
- [ ] Infrastructure 層測試通過（≥ 70% 覆蓋）
- [ ] React Hooks 測試通過（≥ 60% 覆蓋）
- [ ] 關鍵組件測試通過（≥ 40% 覆蓋）
- [ ] ESLint 無警告，TypeScript 無錯誤
- [ ] Prettier 自動格式化完成
- [ ] Lighthouse 分數 ≥ 80
- [ ] GitHub Actions CI/CD 流程正常運行
- [ ] 應用成功部署至 Vercel
- [ ] 手動驗收：完整流程可正常運作
- [ ] 相關文檔已更新（ARCHITECTURE, DECISIONS 等）

