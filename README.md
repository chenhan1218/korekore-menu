# KoreKore - 日本餐廳菜單翻譯 AI 工具

**Don't speak Japanese? Just point.**

KoreKore 是一個協助台灣旅客在日本餐廳點餐的 Web App。使用者只需拍攝菜單圖片，AI 即可自動翻譯並生成「給店員看的原文點餐文字」。

## 🌟 核心功能

### 1. 菜單掃描 (Menu Scan)
- 用戶上傳或拍攝菜單圖片
- 支援 JPG、PNG 格式
- 實時處理反饋

### 2. AI 解析 (AI Processing)
- 呼叫 Gemini 1.5 Flash API 解析菜單
- 自動提取：菜名、台灣使用者習慣的繁體中文翻譯、簡單口感描述、價格
- 返回結構化 JSON 數據

### 3. 點餐介面 (Ordering UI)
- 將解析結果渲染成易讀的卡片清單
- 用戶可勾選想點的品項
- 實時預覽點餐內容

### 4. 生成點餐卡 (Order Card Generation)
- 根據勾選項目，生成包含敬語的原文點餐文字
  - 例如：「すみません、これとこれをください...」
- 高對比度 UI，方便直接展示給店員

### 5. 菜單歷史與同步
- 菜單圖片與解析結果儲存於 Firebase
- **未登入用戶**：可查看同裝置歷史
- **已登入用戶**：可在不同裝置間同步查看歷史

### 6. 多語系支援
- 繁體中文（台灣）
- 英文

---

## 🏗️ 技術棧

| 層級 | 技術 |
|------|------|
| **Frontend** | React + TypeScript + TailwindCSS |
| **AI API** | Google Gemini 1.5 Flash |
| **Backend/Storage** | Firebase (Firestore + Cloud Storage) |
| **Authentication** | Firebase Auth (Anonymous + Email) |
| **Package Manager** | npm |
| **Build Tool** | Vite |

---

## 🚀 快速開始

### 前提條件
- Node.js 18+
- npm 或 yarn
- Firebase 項目（含 Gemini API 啟用）
- Google Generative AI API Key

### 本地開發設置

```bash
# 1. Clone repository
git clone <repo-url>
cd korekore-menu

# 2. 安裝依賴
npm install

# 3. 複製環境變數模板
cp .env.example .env.local

# 4. 填入環境變數
# 在 .env.local 中設定：
# - VITE_FIREBASE_PROJECT_ID
# - VITE_FIREBASE_API_KEY
# - VITE_GEMINI_API_KEY

# 5. 啟動開發伺服器
npm run dev

# 6. 訪問 http://localhost:5173
```

### 環境變數 (.env.local)

```bash
# Firebase Configuration
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket

# Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_GEMINI_MODEL=gemini-1.5-flash
```

---

## 📁 項目結構

```
korekore-menu/
├── docs/                          # 設計與開發文檔
│   ├── ARCHITECTURE.md           # 系統架構與技術決策
│   ├── API-INTEGRATION.md        # Gemini & Firebase 整合指南
│   ├── FEATURE-CHECKLIST.md      # 功能完成清單
│   ├── CODE-STANDARDS.md         # 編碼規範與慣例
│   └── DECISIONS.md              # 架構決策記錄 (ADR)
│
├── src/
│   ├── features/                 # 功能模塊（按業務場景組織）
│   │   ├── menu-scan/           # 菜單掃描功能
│   │   ├── ai-processing/       # AI 解析功能
│   │   ├── ordering/            # 點餐介面
│   │   └── order-card/          # 點餐卡生成
│   │
│   ├── services/                 # 外部服務整合層
│   │   ├── geminiService.ts     # Gemini API 調用
│   │   ├── firebaseService.ts   # Firebase 操作
│   │   └── storageService.ts    # 本機存儲操作
│   │
│   ├── components/               # 可複用 UI 元件
│   │   ├── common/              # 通用元件 (Button, Modal, etc)
│   │   ├── layout/              # 佈局元件
│   │   └── features/            # 功能特定元件
│   │
│   ├── types/                    # TypeScript 類型定義
│   │   ├── menu.ts              # 菜單相關類型
│   │   ├── api.ts               # API 請求/回應類型
│   │   └── index.ts             # 統一導出
│   │
│   ├── utils/                    # 工具函數
│   │   ├── imageProcessing.ts   # 圖片處理
│   │   ├── i18n.ts              # 多語系管理
│   │   └── errorHandler.ts      # 統一錯誤處理
│   │
│   ├── pages/                    # 頁面層級元件
│   ├── hooks/                    # 自訂 React Hooks
│   ├── store/                    # 狀態管理
│   ├── App.tsx                  # 應用入口
│   └── main.tsx                 # 應用啟動文件
│
├── tests/                        # 測試文件
│   ├── unit/                    # 單元測試
│   ├── integration/             # 集成測試
│   └── e2e/                     # 端對端測試
│
├── public/                       # 靜態資源
├── CLAUDE.md                     # Claude Code 工作指引
├── package.json                  # 項目依賴與腳本
├── tsconfig.json                 # TypeScript 配置
├── vite.config.ts               # Vite 配置
└── .env.example                  # 環境變數示例
```

---

## 📚 重要文檔

| 文檔 | 用途 |
|------|------|
| [CLAUDE.md](./CLAUDE.md) | Claude Code 與 AI 協作指南 |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | 系統架構、技術決策、數據流程 |
| [docs/API-INTEGRATION.md](./docs/API-INTEGRATION.md) | Gemini API 與 Firebase 集成詳情 |
| [docs/CODE-STANDARDS.md](./docs/CODE-STANDARDS.md) | 編碼規範、命名慣例、模式 |
| [docs/DECISIONS.md](./docs/DECISIONS.md) | 重要架構決策記錄 |
| [docs/FEATURE-CHECKLIST.md](./docs/FEATURE-CHECKLIST.md) | 功能完成清單與驗收條件 |

---

## 🛠️ 開發命令

```bash
# 啟動開發伺服器（熱重載）
npm run dev

# 構建生產版本
npm run build

# 預覽生產構建
npm run preview

# 執行類型檢查
npm run type-check

# 執行 Linter
npm run lint

# 格式化代碼
npm run format

# 執行測試
npm run test

# 執行測試覆蓋率報告
npm run test:coverage
```

---

## 🔐 安全考量

- ✅ 環境變數使用 `.env.local`（已加入 .gitignore）
- ✅ Firebase 規則限制 Firestore 訪問
- ✅ API Key 不應提交到 Git
- ✅ 敏感信息加密存儲

---

## 🚢 部署

### Firebase Hosting

```bash
# 構建應用
npm run build

# 部署到 Firebase Hosting
firebase deploy
```

---

## 📞 支援與反饋

- 遇到問題？查閱 [ARCHITECTURE.md](./docs/ARCHITECTURE.md) 或相關功能文檔
- 有改進建議？歡迎提交 Issue 或 Pull Request

---

## 📄 License

[待定]

---

## 🤝 貢獻指南

本項目歡迎 AI agent（Claude Code、Gemini CLI）的協作。請參考：
- [CLAUDE.md](./CLAUDE.md) - AI 工作模式與角色職責
- [docs/CODE-STANDARDS.md](./docs/CODE-STANDARDS.md) - 編碼規範
- [docs/DECISIONS.md](./docs/DECISIONS.md) - 架構決策

---

**最後更新：2025-12-17**
