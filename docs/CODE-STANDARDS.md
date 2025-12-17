# 編碼規範與慣例

## 目錄
- [通用原則](#通用原則)
- [檔案與目錄結構](#檔案與目錄結構)
- [命名慣例](#命名慣例)
- [TypeScript 規範](#typescript-規範)
- [React 組件規範](#react-組件規範)
- [錯誤處理](#錯誤處理)
- [註釋與文檔](#註釋與文檔)
- [Git Commit 規範](#git-commit-規範)

---

## 通用原則

### 1. 清晰優先於簡潔
✅ **好：** 名稱明確表達意圖
```typescript
const isMenuItemAvailable = true
const calculateTotalPrice = (items: MenuItem[]) => { ... }
```

❌ **不好：** 模糊的縮寫
```typescript
const avail = true
const calc = (i) => { ... }
```

### 2. 避免使用 `any`
✅ **好：** 定義明確的類型
```typescript
interface ApiResponse {
  items: MenuItem[]
  status: 'success' | 'error'
}
```

❌ **不好：** 使用 any
```typescript
const response: any = await fetch(...)
```

### 3. 模塊化與單一責任
- 每個文件應只做一件事
- Service 負責業務邏輯
- Component 負責 UI 展示
- Hook 負責狀態與副作用

### 4. 無同步回調 - 優先使用 async/await
✅ **好：**
```typescript
const handleUpload = async (file: File) => {
  try {
    const result = await uploadImage(file)
    setImageUrl(result.url)
  } catch (error) {
    handleError(error)
  }
}
```

❌ **不好：** 回調地獄
```typescript
uploadImage(file, (error, result) => {
  if (error) { ... }
  else { ... }
})
```

---

## 檔案與目錄結構

### 目錄組織原則

```
src/
├── features/              # 功能模塊（按業務場景）
│   └── menu-scan/
│       ├── components/    # 功能特定元件
│       ├── hooks/         # 功能特定 Hooks
│       ├── services/      # 功能特定服務（可選）
│       ├── types/         # 功能特定類型
│       └── index.ts       # 統一導出
│
├── services/              # 跨功能的服務層
│   ├── geminiService.ts
│   ├── firebaseService.ts
│   └── index.ts
│
├── components/            # 可複用 UI 元件
│   ├── common/            # 通用元件
│   ├── layout/
│   └── index.ts
│
├── types/                 # 全局 TypeScript 類型
│   ├── menu.ts
│   ├── api.ts
│   ├── error.ts
│   └── index.ts
│
├── utils/                 # 工具函數
│   ├── imageProcessing.ts
│   ├── i18n.ts
│   ├── errorHandler.ts
│   └── index.ts
│
├── hooks/                 # 全局自訂 Hooks
│   ├── useAsyncOperation.ts
│   └── index.ts
│
├── store/                 # 狀態管理
│   ├── appStore.ts
│   └── index.ts
│
├── pages/                 # 頁面層級元件
│   ├── HomePage.tsx
│   ├── MenuDetailPage.tsx
│   └── index.ts
│
├── config/                # 配置文件
│   ├── environment.ts
│   └── constants.ts
│
├── App.tsx
└── main.tsx
```

### 檔案命名規則

| 類型 | 命名 | 示例 |
|------|------|------|
| **React Component** | PascalCase `.tsx` | `MenuScanForm.tsx` |
| **Service** | camelCase `.ts` | `geminiService.ts` |
| **Utility Function** | camelCase `.ts` | `imageProcessing.ts` |
| **Type/Interface** | PascalCase `.ts` | `types/menu.ts` |
| **Hook** | camelCase `.ts` | `useMenuHistory.ts` |
| **Store** | camelCase `.ts` | `appStore.ts` |
| **Style Module** | camelCase `.module.css` | `menuCard.module.css` |

---

## 命名慣例

### 變數與常數

```typescript
// 常數 - SCREAMING_SNAKE_CASE
const API_TIMEOUT_MS = 30000
const DEFAULT_IMAGE_SIZE_MB = 5

// 布林值 - is / has / should 前綴
const isLoading = false
const hasError = true
const shouldRetry = true

// 集合 - 複數形
const menuItems: MenuItem[] = []
const selectedIds: Set<string> = new Set()

// 私有變數 - 可加 _ 前綴（Zustand store 中不需要）
class MenuManager {
  private _cache: Map<string, MenuItem> = new Map()
}
```

### 函數命名

```typescript
// 動詞 + 名詞
function fetchMenuItems() { ... }
function validateImageFormat(file: File) { ... }
function parseGeminiResponse(response: string) { ... }

// getter / setter
function getMenuById(id: string) { ... }
function setMenuLanguage(language: 'zh_TW' | 'en') { ... }

// 檢查函數 - is / has / can 前綴
function isValidImage(file: File): boolean { ... }
function hasMoreItems(page: number): boolean { ... }
function canDeleteMenu(menuId: string): boolean { ... }

// 事件處理 - handle 前綴
function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) { ... }
function handleMenuSelect(menuId: string) { ... }
```

### React Component Props

```typescript
// Props 接口
interface MenuCardProps {
  // 數據
  menu: MenuData
  items: MenuItem[]

  // 狀態
  isSelected?: boolean
  isLoading?: boolean

  // 回調
  onSelect: (menuId: string) => void
  onDelete: (menuId: string) => void
}

// Props 使用
const MenuCard: React.FC<MenuCardProps> = ({
  menu,
  items,
  isSelected = false,
  isLoading = false,
  onSelect,
  onDelete,
}) => {
  // ...
}
```

---

## TypeScript 規範

### 類型定義位置

```typescript
// ✅ 類型文件集中在 src/types/
// src/types/menu.ts
export interface MenuData {
  id: string
  imageUrl: string
  items: MenuItem[]
  uploadedAt: Date
}

export interface MenuItem {
  id: string
  name: string
  name_zh_TW: string
  price: string
}

// ✅ 功能特定類型可在功能目錄下
// src/features/order-card/types/index.ts
export interface OrderCardState {
  selectedItems: MenuItem[]
  totalPrice: number
}

// ❌ 不要在 component 文件中定義大量類型
// 除非是該組件專屬且不會被複用的小類型
```

### 型別嚴謹性

```typescript
// ✅ 使用字面量類型而非字符串
type Language = 'zh_TW' | 'en'
type Status = 'pending' | 'processing' | 'completed' | 'error'

// ✅ 使用 Readonly 標記不可變
interface MenuItem {
  readonly id: string
  readonly name: string
}

// ✅ 使用 Pick / Omit 減少類型重複
interface MenuItemDTO extends Pick<MenuItem, 'id' | 'name'> {
  priceCents: number
}

// ✅ 使用 Partial, Required, Record 等工具類型
type OptionalMenu = Partial<MenuData>
type AllMenusById = Record<string, MenuData>

// ❌ 避免使用 unknown 或 any
const handleUnknown = (data: unknown) => {
  // 必須先確認類型才能使用
  if (typeof data === 'object' && data !== null) {
    // ...
  }
}
```

---

## React 組件規範

### 函數式組件結構

```typescript
// src/components/MenuCard.tsx
import React, { useState, useCallback } from 'react'
import { MenuItem } from '../types/menu'
import './menuCard.module.css'

interface MenuCardProps {
  menu: MenuItem
  onSelect: (id: string) => void
}

/**
 * 菜單卡片組件
 *
 * @component
 * @param props - 組件 Props
 * @returns 渲染的菜單卡片
 *
 * @example
 * ```tsx
 * <MenuCard menu={item} onSelect={handleSelect} />
 * ```
 */
export const MenuCard: React.FC<MenuCardProps> = ({ menu, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = useCallback(() => {
    onSelect(menu.id)
  }, [menu.id, onSelect])

  return (
    <div
      className="menu-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <h3>{menu.name}</h3>
      <p>{menu.name_zh_TW}</p>
      <span className="price">{menu.price}</span>
    </div>
  )
}

export default MenuCard
```

### Hooks 規範

```typescript
// src/hooks/useAsyncOperation.ts
import { useState, useCallback } from 'react'
import { AppError } from '../types/error'

interface UseAsyncOperationResult<T> {
  data: T | null
  loading: boolean
  error: AppError | null
  execute: (fn: () => Promise<T>) => Promise<void>
}

/**
 * 處理非同步操作的 Hook
 *
 * @template T - 返回數據的類型
 * @returns 非同步操作狀態與執行函數
 *
 * @example
 * ```tsx
 * const { data, loading, error, execute } = useAsyncOperation()
 * const handleUpload = () => execute(() => uploadImage(file))
 * ```
 */
export const useAsyncOperation = <T>(): UseAsyncOperationResult<T> => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AppError | null>(null)

  const execute = useCallback(async (fn: () => Promise<T>) => {
    setLoading(true)
    setError(null)

    try {
      const result = await fn()
      setData(result)
    } catch (err) {
      const appError = err instanceof AppError ? err : new AppError(
        'UNKNOWN_ERROR',
        String(err),
        '發生未知錯誤'
      )
      setError(appError)
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, execute }
}
```

---

## 錯誤處理

### 統一的錯誤類型

```typescript
// src/types/error.ts
export enum ErrorCode {
  // 圖片相關
  INVALID_IMAGE_FORMAT = 'INVALID_IMAGE_FORMAT',
  IMAGE_SIZE_EXCEEDED = 'IMAGE_SIZE_EXCEEDED',

  // API 相關
  GEMINI_API_ERROR = 'GEMINI_API_ERROR',
  FIREBASE_ERROR = 'FIREBASE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',

  // 解析相關
  PARSE_ERROR = 'PARSE_ERROR',

  // 其他
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public userMessage: string, // 顯示給使用者
    public retry: boolean = false // 是否可重試
  ) {
    super(message)
    this.name = 'AppError'
  }
}
```

### 錯誤處理模式

```typescript
// ✅ 在 Service 層捕捉和轉換錯誤
export const parseMenuImage = async (imageBase64: string) => {
  try {
    const response = await geminiApi.generateContent({ ... })
    return parseResponse(response)
  } catch (error) {
    if (error instanceof NetworkError) {
      throw new AppError(
        ErrorCode.NETWORK_ERROR,
        error.message,
        '網路連線失敗，請重試',
        true
      )
    }
    throw new AppError(
      ErrorCode.GEMINI_API_ERROR,
      error.message,
      'AI 服務暫時不可用',
      true
    )
  }
}

// ✅ 在 Component 層展示用戶友善的錯誤信息
const MenuScanForm: React.FC = () => {
  const { parse, error, loading } = useGeminiParsing()

  if (error) {
    return (
      <div className="error-alert">
        <p>{error.userMessage}</p>
        {error.retry && (
          <button onClick={() => handleRetry()}>重試</button>
        )}
      </div>
    )
  }

  return <form>{/* ... */}</form>
}
```

---

## 註釋與文檔

### JSDoc 註釋規範

```typescript
/**
 * 解析菜單圖片並返回結構化數據
 *
 * 使用 Gemini API 分析菜單圖片，提取菜名、翻譯、價格等信息。
 * 支援日文、中文菜單。
 *
 * @async
 * @function parseMenuImage
 * @param {string} imageBase64 - 圖片的 Base64 編碼
 * @param {string} [language='zh_TW'] - 目標語言
 * @returns {Promise<ParsedMenuResponse>} 解析後的菜單數據
 * @throws {AppError} 當 API 調用失敗時
 *
 * @example
 * ```typescript
 * const menu = await parseMenuImage(base64Image, 'zh_TW')
 * console.log(menu.items)
 * ```
 */
export const parseMenuImage = async (
  imageBase64: string,
  language: 'zh_TW' | 'en' = 'zh_TW'
): Promise<ParsedMenuResponse> => {
  // ...
}
```

### 何時添加註釋

✅ **應該添加：**
- 複雜的業務邏輯
- 非直觀的解決方案為何這樣做
- 性能優化的原因
- 外部依賴或 API 的特殊要求

❌ **不應該添加：**
```typescript
// ❌ 太明顯，無需註釋
const count = items.length // 取得項目數量

// ✅ 解釋為何這樣做
// Gemini API 有速率限制，所以添加 500ms 延遲避免超過限制
await sleep(500)
```

---

## Git Commit 規範

### Commit Message 格式

遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 列表

| Type | 用途 |
|------|------|
| **feat** | 新功能 |
| **fix** | 修復 Bug |
| **docs** | 文檔變更 |
| **style** | 代碼格式變更（不影響功能） |
| **refactor** | 重構代碼 |
| **perf** | 性能優化 |
| **test** | 添加/修改測試 |
| **chore** | 構建、依賴、工具變更 |

### Commit 例子

```bash
# 新功能
git commit -m "feat(ai-processing): add Gemini API integration for menu parsing

- Implement image-to-JSON parsing
- Add proper error handling
- Validate response schema"

# 修復
git commit -m "fix(components): resolve image upload validation error

- Fix file size check logic
- Add proper error message for users"

# 文檔
git commit -m "docs: update API integration guide with Gemini setup"

# 重構
git commit -m "refactor(services): extract gemini API client

- Create separate geminiClient.ts for reusability
- Maintain backward compatibility"
```

### Commit 最佳實踐

1. **一次 commit 一個邏輯單位**
   - 不要混淆多個無關的變更

2. **描述「為什麼」而不只是「做了什麼」**
   ```
   ❌ 不好：fix: update code
   ✅ 好：fix: resolve memory leak in MenuGallery component
   ```

3. **使用英文 commit message**
   - 便於搜索和國際協作

4. **保持 commit 消息簡潔但完整**
   - Subject 控制在 50 字以內
   - Body 提供更多上下文

---

**最後更新：2025-12-17**
