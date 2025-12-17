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

## 系統架構

### 高層架構圖

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser                             │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                  React Frontend (SPA)                    ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐││
│  │  │ Menu Scan    │  │  AI Parser   │  │ Order Card    │││
│  │  │  Components  │  │  Components  │  │ Components    │││
│  │  └──────────────┘  └──────────────┘  └────────────────┘││
│  │         │                 │                   │         │
│  │         └─────────────────┴───────────────────┘         │
│  │                   Zustand Store                          │
│  └─────────────────────────────────────────────────────────┘
│              │                          │
└──────────────┼──────────────────────────┼──────────────────┘
               │                          │
        ┌──────▼─────────┐        ┌──────▼─────────┐
        │  Gemini API    │        │  Firebase      │
        │  (Menu Parse)  │        │  - Firestore   │
        │                │        │  - Storage     │
        │                │        │  - Auth        │
        └────────────────┘        └────────────────┘
```

### 三層架構分解

```
Presentation Layer (src/components/, src/pages/)
        ↓
Service Layer (src/services/)
        ↓
Data Layer (Firebase SDK, Local Storage)
```

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

## 分層設計

### 1. Presentation Layer (UI 層)

**責任：**
- 渲染 UI 組件
- 收集用戶輸入
- 展示加載狀態、錯誤提示

**文件位置：**
- `src/components/` - 可複用元件
- `src/pages/` - 頁面級元件
- `src/hooks/` - 自訂 React Hooks

**例：**
```typescript
// src/components/MenuScanForm.tsx
- 圖片上傳輸入框
- 進度條
- 錯誤提示
```

### 2. Service Layer (業務邏輯層)

**責任：**
- 調用外部 API (Gemini, Firebase)
- 數據驗證與轉換
- 錯誤處理
- 重試邏輯

**文件位置：**
- `src/services/geminiService.ts` - Gemini API 調用
- `src/services/firebaseService.ts` - Firebase 操作
- `src/services/storageService.ts` - 本地存儲

**例：**
```typescript
// src/services/geminiService.ts
export const parseMenuImage = async (imageBase64: string): Promise<MenuItem[]>
  - 呼叫 Gemini API
  - 驗證響應格式
  - 返回結構化數據或拋出自訂 Error

// src/services/firebaseService.ts
export const saveMenu = async (userId: string, menu: MenuData): Promise<string>
  - 儲存菜單至 Firestore
  - 上傳圖片至 Cloud Storage
  - 返回 menuId
```

### 3. State Management Layer (狀態層)

**責任：**
- 管理全局狀態（用戶設置、菜單歷史、選中項目）
- 提供 State 選擇器與更新方法

**使用工具：** Zustand

**例：**
```typescript
// src/store/menuStore.ts
{
  menus: MenuData[];
  selectedItems: MenuItem[];
  currentLanguage: 'zh_TW' | 'en';

  actions: {
    addMenu,
    removeMenu,
    selectItem,
    setLanguage
  }
}
```

### 4. Type Layer (型別層)

**責任：**
- 定義所有 TypeScript 類型
- 確保類型安全
- 減少 `any` 的使用

**文件位置：**
- `src/types/menu.ts` - 菜單相關
- `src/types/api.ts` - API 請求/回應
- `src/types/index.ts` - 統一導出

---

## 核心模塊

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
