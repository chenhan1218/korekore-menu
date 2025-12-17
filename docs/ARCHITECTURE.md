# 系統架構設計文檔

## 目錄
- [技術棧](#技術棧)
- [系統架構](#系統架構)
- [數據流程](#數據流程)
- [分層設計](#分層設計)
- [核心模塊](#核心模塊)
- [錯誤處理策略](#錯誤處理策略)
- [狀態管理](#狀態管理)
- [API 契約](#api-契約)

---

## 技術棧

### Frontend 層

| 技術 | 版本 | 用途 |
|------|------|------|
| **React** | 18+ | UI 框架與組件管理 |
| **TypeScript** | 5+ | 靜態類型檢查，提升代碼品質 |
| **Vite** | 5+ | 快速構建工具與開發伺服器 |
| **TailwindCSS** | 3+ | 工具優先的 CSS 框架，快速開發 UI |
| **React Router** | 6+ | 頁面路由管理 |
| **Zustand** | 4+ | 輕量級狀態管理（替代 Redux） |

### Backend & Services

| 技術 | 用途 |
|------|------|
| **Google Gemini 1.5 Flash** | AI 菜單解析 |
| **Firebase Firestore** | 菜單元數據存儲（用戶歷史、設置） |
| **Firebase Cloud Storage** | 菜單圖片存儲 |
| **Firebase Authentication** | 用戶認證（Anonymous + Email） |
| **Firebase Hosting** | 部署與託管 |

### 開發工具

| 工具 | 用途 |
|------|------|
| **ESLint** | 代碼品質檢查 |
| **Prettier** | 代碼格式化 |
| **Vitest** | 單元測試框架 |
| **React Testing Library** | React 組件測試 |

---

## 系統架構：六邊形架構 (Hexagonal Architecture)

### 核心原則
為了確保**長期可維護性**與**UI 框架可替換性**，KoreKore 採用六邊形架構（亦稱埠適配器架構）。

- **核心業務邏輯完全獨立於 UI 框架**
- **外部依賴（Gemini、Firebase）通過接口隔離**
- **可無痛切換 React → Vue → Svelte 等框架**

### 高層架構圖

```
┌──────────────────────────────────────────────────────────────────┐
│                          UI 層（可替換）                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  React.js (src/ui/react/)                                  │ │
│  │  ├─ Components (MenuScanForm, OrderCard, etc)              │ │
│  │  ├─ Adapters (useParseMenu, useMenuHistory, etc)          │ │
│  │  ├─ Stores (Zustand)                                       │ │
│  │  └─ Pages                                                   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  [ 未來可替換為 Vue.js / Svelte / Angular 而無需改動核心邏輯]    │
└──────────────────────────────────────────────────────────────────┘
                          ▲
                          │ (通過 Ports 依賴)
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│                    Domain 層（業務邏輯核心）                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  src/domain/                                               │ │
│  │  ├─ entities/          (MenuItem, MenuData, OrderCard)    │ │
│  │  ├─ usecases/          (ParseMenu, SaveMenu, GetHistory)  │ │
│  │  ├─ value-objects/     (SelectedItems, OrderPrice)        │ │
│  │  └─ ports/             (GeminiPort, FirebasePort)         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  特點：完全框架無關、易於測試、業務邏輯清晰                        │
└──────────────────────────────────────────────────────────────────┘
                          ▲
                          │ (通過 Ports 依賴)
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│                  Infrastructure 層（實現層）                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  src/infrastructure/                                       │ │
│  │  ├─ services/          (GeminiService, FirebaseService)   │ │
│  │  ├─ repositories/      (MenuRepository, ImageRepository)  │ │
│  │  └─ adapters/          (Ports 的具體實現)                 │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  特點：實現外部依賴、可 Mock 進行測試                              │
└──────────────────────────────────────────────────────────────────┘
                          ▼
         ┌────────────────┴────────────────┐
         │                                  │
    ┌────▼─────────┐             ┌────────▼──────┐
    │ Gemini API   │             │  Firebase     │
    │              │             │  (Firestore,  │
    │ (Remote)     │             │   Storage,    │
    │              │             │   Auth)       │
    └──────────────┘             └───────────────┘
```

### 分層詳解

**1. Domain 層（核心業務邏輯）**
- 純 TypeScript，完全獨立於任何框架
- 不依賴 React、Vue、外部庫
- 易於編寫單元測試（無需 Mock React）

**2. Infrastructure 層（外部依賴）**
- 實現 Domain 的 Ports 接口
- 調用 Gemini API、Firebase SDK
- 易於 Mock 進行測試

**3. UI 層（用戶界面）**
- React、Vue 等框架特定代碼
- 通過 Adapters 連接 Domain 邏輯
- 可完全替換而不影響核心邏輯

---

## 數據流程

### 用戶流程：菜單掃描 → 點餐 → 生成點餐卡

```
1️⃣ 菜單掃描
   ├─ User 上傳/拍攝菜單圖片
   ├─ Frontend 驗證圖片 (格式、大小)
   ├─ 圖片轉換為 Base64
   └─ 儲存至本地狀態

2️⃣ AI 解析
   ├─ Frontend 呼叫 Gemini API
   │  └─ 發送: Image + Prompt Template
   ├─ Gemini 返回: JSON (items[], metadata)
   ├─ Frontend 驗證 Response Schema
   └─ 儲存至 Firebase Firestore + Cloud Storage
      ├─ Collections: {userId}/menus/{menuId}
      ├─ 元數據: timestamp, language, imageUrl
      └─ 菜單數據: items[], parsedJson

3️⃣ 點餐介面
   ├─ Frontend 渲染菜單卡片清單
   ├─ User 勾選想要的品項
   └─ 狀態儲存至 Zustand Store (selectedItems)

4️⃣ 生成點餐卡
   ├─ Frontend 組合選中項目
   ├─ 使用 NLP 模板生成敬語日文文字
   ├─ 生成高對比度 UI (方便秀給店員看)
   └─ 提供下載/分享功能
      ├─ 下載為圖片 (PNG)
      └─ 複製文字到剪貼板
```

---

## 詳細分層設計

### 層級 1: Domain 層（業務邏輯核心）

**責任：**
- 定義業務實體（Entity）與值對象（Value Object）
- 實現業務用例（Use Case）邏輯
- 定義外部依賴的埠（Port）接口
- **完全獨立於 UI 框架、框架庫**

**目錄結構：**
```
src/domain/
├── entities/                    # 業務實體
│   ├── MenuItem.ts             # 菜單項目
│   ├── MenuData.ts             # 菜單數據集合
│   └── OrderCard.ts            # 點餐卡
│
├── usecases/                   # 業務用例
│   ├── parseMenuImage.ts       # 解析菜單圖片
│   ├── saveMenu.ts             # 保存菜單
│   ├── getMenuHistory.ts       # 獲取菜單歷史
│   ├── selectMenuItems.ts      # 選擇菜單項目
│   ├── generateOrderCard.ts    # 生成點餐卡
│   └── index.ts               # 統一導出
│
├── value-objects/              # 值對象
│   ├── SelectedItems.ts        # 選中項目集合
│   ├── OrderPrice.ts           # 價格計算
│   └── MenuLanguage.ts         # 菜單語言
│
├── ports/                       # 依賴接口（抽象層）
│   ├── GeminiPort.ts           # Gemini API 接口
│   ├── FirebasePort.ts         # Firebase 操作接口
│   ├── LocalStoragePort.ts     # 本地存儲接口
│   └── index.ts               # 統一導出
│
└── types/                       # Domain 層特有類型
    └── index.ts
```

**核心特徵：**
- ❌ 不引入 `react`, `vue`, 任何 UI 框架
- ❌ 不引入 `firebase`, `@google/generative-ai` 等外部服務
- ✅ 只依賴 TypeScript、Node.js 標準庫
- ✅ 純函數優先，易於測試

**例子：**
```typescript
// src/domain/usecases/parseMenuImage.ts
export interface ParseMenuImageUseCase {
  execute(imageBase64: string): Promise<MenuData>
}

// 純業務邏輯，框架無關
export const createParseMenuImageUseCase = (
  geminiPort: GeminiPort
): ParseMenuImageUseCase => {
  return {
    async execute(imageBase64: string) {
      // 業務邏輯
      const items = await geminiPort.parseImage(imageBase64)
      return { items, timestamp: new Date() }
    }
  }
}
```

### 層級 2: Infrastructure 層（外部依賴實現）

**責任：**
- 實現 Domain 層定義的埠（Port）接口
- 調用 Gemini API、Firebase SDK、LocalStorage
- 處理 IO 操作與外部通信
- 易於 Mock 和測試

**目錄結構：**
```
src/infrastructure/
├── services/                    # 外部服務封裝
│   ├── GeminiService.ts        # Gemini API 實現
│   ├── FirebaseService.ts      # Firebase 實現
│   ├── LocalStorageService.ts  # LocalStorage 實現
│   └── index.ts               # 統一導出 & 初始化
│
├── repositories/               # 數據訪問層
│   ├── MenuRepository.ts       # 菜單數據 CRUD
│   ├── ImageRepository.ts      # 圖片存儲 CRUD
│   ├── UserRepository.ts       # 用戶數據 CRUD
│   └── index.ts
│
├── adapters/                    # Ports 實現
│   ├── GeminiAdapter.ts        # 適配 Gemini API → GeminiPort
│   ├── FirebaseAdapter.ts      # 適配 Firebase → FirebasePort
│   └── index.ts
│
└── config/                      # 配置與初始化
    ├── firebaseConfig.ts       # Firebase 初始化
    ├── geminiConfig.ts         # Gemini 初始化
    └── index.ts
```

**核心特徵：**
- ✅ 實現 Domain 的 Port 接口
- ✅ 可被 Mock Service 替換（用於測試）
- ✅ 處理所有 IO 和外部通信
- ✅ 錯誤映射為 Domain 層的 AppError

**例子：**
```typescript
// src/infrastructure/adapters/GeminiAdapter.ts
import { GeminiPort } from '@domain/ports'

export class GeminiAdapter implements GeminiPort {
  async parseImage(imageBase64: string): Promise<MenuItem[]> {
    // 實現 Gemini API 調用
    const response = await geminiService.generateContent({...})
    return this.parseResponse(response)
  }
}
```

### 層級 3: UI 層（框架特定）

**責任：**
- 渲染用戶界面
- 收集用戶輸入
- 通過 Adapters 連接 Domain 邏輯
- 管理 UI 狀態（Zustand）
- **可完全替換（React → Vue → Svelte）**

**目錄結構（React 例子）：**
```
src/ui/react/
├── components/                  # UI 組件
│   ├── common/                 # 通用組件
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── LoadingSpinner.tsx
│   ├── features/               # 功能組件
│   │   ├── MenuScanForm.tsx
│   │   ├── MenuCardList.tsx
│   │   ├── OrderCardDisplay.tsx
│   │   └── MenuGallery.tsx
│   └── layout/                 # 佈局組件
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── MainLayout.tsx
│
├── adapters/                    # Domain → React 的適配層
│   ├── useParseMenu.ts         # Hook 包裹 parseMenuImageUseCase
│   ├── useSaveMenu.ts
│   ├── useMenuHistory.ts
│   └── useOrderCard.ts
│
├── stores/                      # Zustand stores
│   ├── appStore.ts             # 全局應用狀態
│   ├── menuStore.ts            # 菜單相關狀態
│   └── index.ts
│
├── pages/                       # 頁面組件
│   ├── HomePage.tsx
│   ├── MenuDetailPage.tsx
│   └── HistoryPage.tsx
│
├── App.tsx                      # React 應用入口
└── index.tsx                    # React DOM 渲染
```

**核心特徵：**
- ✅ 只處理 UI 相關邏輯
- ✅ 通過 Adapters 使用 Domain 邏輯
- ✅ 管理 UI 狀態（不是業務狀態）
- ✅ 完全可替換

**例子：**
```typescript
// src/ui/react/adapters/useParseMenu.ts
import { useState, useCallback } from 'react'
import { createParseMenuImageUseCase } from '@domain/usecases'
import { geminiAdapter } from '@infrastructure/adapters'

// React 適配層，包裹 Domain 用例
export const useParseMenu = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AppError | null>(null)

  const useCase = createParseMenuImageUseCase(geminiAdapter)

  const parse = useCallback(async (imageBase64: string) => {
    setLoading(true)
    try {
      return await useCase.execute(imageBase64)
    } catch (err) {
      setError(toAppError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  return { parse, loading, error }
}
```

### 層級 4: Shared 層（跨層共用）

**責任：**
- 定義所有類型定義
- 提供跨層通用工具
- 完全獨立於任何層

**目錄結構：**
```
src/shared/
├── types/                       # 全局類型
│   ├── menu.ts                 # 菜單相關
│   ├── api.ts                  # API 相關
│   ├── error.ts                # 錯誤相關
│   └── index.ts
│
└── utils/                       # 通用工具函數
    ├── imageProcessing.ts      # 圖片處理
    ├── errorHandler.ts         # 錯誤處理
    ├── i18n.ts                 # 多語系支援
    └── index.ts
```

---

## 依賴注入與初始化

為了實現分層架構，使用依賴注入（DI）模式：

```typescript
// src/infrastructure/config/bootstrap.ts
import { GeminiAdapter } from './adapters/GeminiAdapter'
import { FirebaseAdapter } from './adapters/FirebaseAdapter'
import { createParseMenuImageUseCase } from '@domain/usecases'

// 初始化 Infrastructure 層
export const adapters = {
  gemini: new GeminiAdapter(),
  firebase: new FirebaseAdapter(),
}

// 初始化 Domain 層 UseCase
export const useCases = {
  parseMenuImage: createParseMenuImageUseCase(adapters.gemini),
  saveMenu: createSaveMenuUseCase(adapters.firebase),
  // ...
}

// UI 層通過 adapters 使用 useCases
export const createAppContextvalue = () => ({
  useCases,
  adapters,
})
```

React Context 或 Props Drilling 提供給 UI 層：

```typescript
// src/ui/react/context/AppContext.tsx
import { createContext } from 'react'
import { createAppContextvalue } from '@infrastructure/config/bootstrap'

export const AppContext = createContext(createAppContextvalue())

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = createAppContextvalue()
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
```

---

## 核心功能模塊

### 模塊 1: Menu Scan (菜單掃描)

**功能：**
- 圖片上傳
- 檔案驗證 (格式、大小)
- 進度反饋

**檔案結構：**
```
src/features/menu-scan/
├── components/
│   ├── MenuScanForm.tsx
│   ├── ImagePreview.tsx
│   └── ProgressBar.tsx
├── hooks/
│   └── useImageUpload.ts
└── types/
    └── index.ts
```

### 模塊 2: AI Processing (Gemini 解析)

**功能：**
- 呼叫 Gemini API
- 將菜單圖片轉為結構化 JSON
- 錯誤重試機制

**檔案結構：**
```
src/features/ai-processing/
├── services/
│   └── geminiService.ts
├── hooks/
│   └── useGeminiParsing.ts
├── types/
│   └── geminiResponse.ts
└── prompts/
    └── menuParsingPrompt.ts
```

### 模塊 3: Ordering UI (點餐介面)

**功能：**
- 渲染菜單卡片
- 勾選選項
- 即時預覽

**檔案結構：**
```
src/features/ordering/
├── components/
│   ├── MenuCardList.tsx
│   ├── MenuCard.tsx
│   └── OrderSummary.tsx
├── hooks/
│   └── useOrderSelection.ts
└── styles/
    └── menuCard.module.css
```

### 模塊 4: Order Card Generation (點餐卡生成)

**功能：**
- 生成敬語日文文字
- 高對比度 UI
- 下載/分享功能

**檔案結構：**
```
src/features/order-card/
├── components/
│   ├── OrderCardDisplay.tsx
│   ├── OrderCardActions.tsx
│   └── OrderCardPreview.tsx
├── utils/
│   ├── japaneseTextGenerator.ts
│   └── imageExporter.ts
├── hooks/
│   └── useOrderCard.ts
└── types/
    └── orderCard.ts
```

### 模塊 5: Menu History (菜單歷史)

**功能：**
- 相簿式菜單展示
- 裝置本地歷史 (LocalStorage)
- 登入後跨裝置同步 (Firestore)

**檔案結構：**
```
src/features/menu-history/
├── components/
│   ├── MenuGallery.tsx
│   ├── MenuGalleryItem.tsx
│   └── MenuDetailView.tsx
├── services/
│   └── menuHistoryService.ts
└── hooks/
    └── useMenuHistory.ts
```

---

## 錯誤處理策略

### 統一的 Error 類型

```typescript
// src/types/error.ts
export enum ErrorCode {
  INVALID_IMAGE_FORMAT = 'INVALID_IMAGE_FORMAT',
  IMAGE_SIZE_EXCEEDED = 'IMAGE_SIZE_EXCEEDED',
  GEMINI_API_ERROR = 'GEMINI_API_ERROR',
  FIREBASE_ERROR = 'FIREBASE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PARSE_ERROR = 'PARSE_ERROR'
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public userMessage: string, // 顯示給用戶
    public retry: boolean = false
  ) {
    super(message)
  }
}
```

### 錯誤處理層次

```
Presentation Layer (顯示錯誤提示)
    ↑
Service Layer (捕捉 & 轉換錯誤)
    ↑
External APIs (原始錯誤)
```

**例：**
```typescript
// src/services/geminiService.ts
export const parseMenuImage = async (imageBase64: string) => {
  try {
    const response = await geminiApi.generateContent({...})
    return parseResponse(response)
  } catch (error) {
    if (error instanceof NetworkError) {
      throw new AppError(
        ErrorCode.NETWORK_ERROR,
        error.message,
        '網路連線失敗，請重試',
        true // 可重試
      )
    }
    throw new AppError(
      ErrorCode.GEMINI_API_ERROR,
      error.message,
      'AI 解析失敗，請重試',
      true
    )
  }
}
```

---

## 狀態管理

### Zustand Store 結構

```typescript
// src/store/index.ts
export const useAppStore = create((set, get) => ({
  // State
  menus: [],
  selectedItems: [],
  currentLanguage: 'zh_TW',
  isLoading: false,
  error: null,

  // Actions
  addMenu: (menu) => set(state => ({
    menus: [...state.menus, menu]
  })),

  selectItem: (itemId) => set(state => ({
    selectedItems: [...state.selectedItems, itemId]
  })),

  setError: (error) => set({ error }),

  // Selectors 也可在 Store 中定義
  getSelectedMenuItems: () => {
    const { menus, selectedItems } = get()
    return menus
      .flatMap(m => m.items)
      .filter(item => selectedItems.includes(item.id))
  }
}))
```

### 為何選擇 Zustand 而不是 Redux？

| 維度 | Zustand | Redux |
|------|---------|-------|
| **學習曲線** | 低 | 高 |
| **Boilerplate** | 少 | 多 |
| **Bundle Size** | ~1KB | ~10KB |
| **對小到中型項目** | 最佳 | 過度 |

---

## API 契約

### Gemini API Response Schema

```typescript
// src/types/api.ts
export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string // JSON string
      }>
    }
  }>
}

export interface ParsedMenuResponse {
  items: MenuItem[]
  metadata: {
    parsedAt: string
    confidence: number // 0-1
    language: string
  }
}

export interface MenuItem {
  id: string // UUID
  name: string // 原文菜名
  name_zh_TW: string // 繁體中文翻譯
  price: string // 價格（原始字符串）
  description?: string // 簡單口感描述
  image?: string // 菜品圖片 URL (若有)
}
```

### Firestore Collection 結構

```
users/
└── {userId}/
    ├── settings/
    │   ├── language: 'zh_TW' | 'en'
    │   └── createdAt: timestamp
    │
    └── menus/
        └── {menuId}/
            ├── imageUrl: string (Cloud Storage URL)
            ├── items: MenuItem[]
            ├── parsedJson: ParsedMenuResponse
            ├── uploadedAt: timestamp
            ├── originLanguage: string
            └── notes: string (用戶備註)
```

---

## 開發原則

1. **類型優先：** 使用 TypeScript 避免歧義
2. **分離關切：** 每個 Service 只做一件事
3. **測試驅動：** 重點功能必須有測試
4. **錯誤可見：** 所有錯誤都應被記錄與追蹤
5. **無同步 Call：** 避免回調地獄，使用 async/await
6. **明確命名：** 函數名應清楚表達意圖

---

## 未來擴展點

- **圖片 OCR 優化：** 未來可整合專門的 OCR 引擎提升準確度
- **多語言 AI：** 支援韓文、中文、東南亞菜單
- **離線模式：** 使用 Service Worker 緩存菜單
- **推薦引擎：** 基於用戶點餐歷史推薦菜品
- **社群分享：** 用戶可分享菜單與點餐卡

---

**最後更新：2025-12-17**
