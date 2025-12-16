# KoreKore - 旅遊點餐助手

> "Don't speak Japanese? Just point."

協助台灣旅客在國外旅遊餐廳點餐的 Web App 工具。

## 📱 核心功能

- **菜單掃描**: 上傳/拍攝菜單圖片
- **AI 解析**: 使用 Gemini 1.5 Flash API 翻譯菜單
- **點餐介面**: 卡片式清單，輕鬆勾選餐點
- **生成點餐卡**: 自動生成原文點餐文字（含敬語）
- **歷史記錄**: 相簿式介面查看過往菜單
- **多語系支援**: 繁體中文 / English
- **跨裝置同步**: 登入後可在不同裝置查看歷史

## 🛠️ 技術棧

### 前端
- **框架**: Next.js 16 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS + shadcn/ui
- **狀態管理**: Zustand
- **國際化**: next-intl
- **PWA**: Progressive Web App 支援

### 後端
- **Backend as a Service**: Firebase
  - Authentication (匿名 + Google 登入)
  - Firestore (資料庫)
  - Storage (圖片儲存)
  - Cloud Functions (Gemini API 調用)

### AI
- **模型**: Gemini 1.5 Flash API
- **功能**: 菜單圖片識別與翻譯

## 📦 專案結構

```
korekore-menu/
├── app/                      # Next.js App Router
│   ├── (root)/              # 主要頁面
│   ├── api/                 # API Routes
│   └── globals.css          # 全域樣式
├── components/              # React 元件
│   ├── ui/                  # shadcn/ui 元件
│   ├── layout/              # Layout 元件
│   ├── menu/                # 菜單相關元件
│   ├── order/               # 點餐相關元件
│   └── history/             # 歷史記錄元件
├── lib/                     # 核心函式庫
│   ├── firebase/            # Firebase 服務
│   ├── stores/              # Zustand stores
│   ├── i18n/                # 多語系配置
│   └── utils/               # 工具函式
├── types/                   # TypeScript 類型定義
├── hooks/                   # 自訂 React Hooks
└── public/                  # 靜態資源
```

## 🚀 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

複製 `.env.local.example` 為 `.env.local` 並填入你的 Firebase 和 Gemini API 金鑰：

```bash
cp .env.local.example .env.local
```

### 3. 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

## 🔧 Firebase 設定

### 1. 建立 Firebase 專案

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 建立新專案
3. 啟用以下服務：
   - **Authentication**: 啟用匿名登入 + Google 登入
   - **Firestore**: 建立資料庫（測試模式或生產模式）
   - **Storage**: 啟用檔案儲存
   - **Functions**: 部署 Cloud Functions

### 2. Firestore 資料結構

```
menus/
  {menuId}/
    - userId: string
    - imageUrl: string
    - menuItems: MenuItem[]
    - selectedItems: string[]
    - language: string
    - createdAt: Timestamp
    - updatedAt: Timestamp
```

### 3. 部署 Cloud Functions

```bash
cd functions
npm install
firebase deploy --only functions
```

## 🌐 PWA 配置

本專案支援 PWA，可安裝到主畫面：

- **離線支援**: Service Worker 快取
- **主畫面圖示**: 可安裝到手機桌面
- **全螢幕體驗**: 類似原生 App

## 📝 開發指南

### 狀態管理

使用 Zustand 管理三種狀態：

1. **useMenuStore**: 菜單資料、選中項目
2. **useUserStore**: 使用者資料、偏好設定
3. **useUIStore**: UI 狀態（Modal、Toast 等）

### 多語系

使用 `next-intl` 實作多語系：

```tsx
import { useTranslations } from 'next-intl';

const t = useTranslations('home');
t('title'); // 輸出: "掃描菜單"
```

### 新增 UI 元件

本專案使用 shadcn/ui，可手動複製元件或使用 CLI：

```bash
npx shadcn@latest add button
```

## 🎨 設計原則

1. **行動優先**: 優化手機瀏覽體驗
2. **大字體**: 方便在餐廳使用
3. **高對比度**: 點餐卡易於閱讀
4. **無障礙**: 支援螢幕閱讀器

## 🔒 安全性

- ✅ API Key 不暴露於前端（透過 Cloud Functions）
- ✅ Firestore Security Rules 保護資料
- ✅ 圖片壓縮防止大檔案上傳
- ✅ 請求頻率限制

## 📄 授權

ISC License

## 🤝 貢獻

歡迎提交 Issues 和 Pull Requests！

---

Made with ❤️ for travelers
