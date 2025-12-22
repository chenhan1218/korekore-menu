# KoreKore Conductor 工作流程

## 📋 工作模式概述

本項目遵循 **Test-Driven Development (TDD) + Hexagonal Architecture** 的工作模式，結合 Conductor 的 Track 系統管理功能開發。

---

## 🎯 工作流程階段

### Phase 1: 需求梳理與規劃（Specification）

**目標：** 明確功能需求與接受條件

1. **建立 Track**
   - 描述功能或 bug 修正
   - 定義完成標準（Definition of Done）
   - 評估影響範圍

2. **需求分析**
   - 確認涉及的層級（Domain / Infrastructure / UI）
   - 識別相關的 Port 或 Service
   - 檢視可能的技術債

3. **架構決策**
   - 評估是否需要新的 Port 或 Adapter
   - 確認是否涉及 API 契約變更
   - 討論長期擴展性影響

**輸出：** 清晰的 Spec 與實施計劃

---

### Phase 2: 領域層設計與測試（Domain Layer）

**目標：** 設計並實現核心業務邏輯

#### 2.1 設計 Domain 模型

- 識別或修改 **Entity**（MenuItem、MenuData 等）
- 設計 **Value Objects**（如果需要）
- 更新或新增 **Ports（接口）**

#### 2.2 編寫 Domain 單元測試

```typescript
// Domain 層測試必須涵蓋：
describe('ParseMenuUseCase', () => {
  // 1. 正常場景
  test('should parse valid menu image')

  // 2. 邊界條件
  test('should handle empty menu')
  test('should validate image format')

  // 3. 錯誤場景
  test('should throw error for invalid input')

  // 4. 業務規則
  test('should apply translation correctly')
})
```

#### 2.3 實現 Domain UseCase

```typescript
// 實現應該只依賴 Ports（接口）
export class ParseMenuUseCase {
  constructor(
    private geminiPort: GeminiPort,
    private storagePort: StoragePort
  ) {}

  execute(imageData: Buffer) {
    // Domain 邏輯不涉及 React、Firebase SDK 等
  }
}
```

**重點：** Domain 層代碼完全獨立於框架，易於測試

---

### Phase 3: Infrastructure 層實現（Infrastructure Layer）

**目標：** 實現 Port 適配器與外部服務集成

#### 3.1 實現 Adapters

```typescript
// 實現 GeminiPort
export class GeminiAdapter implements GeminiPort {
  constructor(private geminiService: GeminiService) {}

  async parseMenuImage(image: Buffer) {
    // 調用 Gemini API
  }
}
```

#### 3.2 編寫 Integration 測試

```typescript
describe('GeminiAdapter Integration', () => {
  // 測試與實際 API 的交互
  test('should call Gemini API correctly')
  test('should handle API errors gracefully')
  test('should transform response format')
})
```

#### 3.3 Error Handling

遵循既定的錯誤處理策略：
- 使用統一的 Error 類型
- 記錄詳細的錯誤信息
- 向上層提供清晰的錯誤消息

---

### Phase 4: UI 層實現與集成（UI Layer）

**目標：** 實現 React 組件與用戶交互

#### 4.1 建立 React Hooks 適配器

```typescript
// Adapter 連接 Domain UseCase 與 React
export function useParseMenu() {
  const [state, setState] = useState(...)
  const [error, setError] = useState(...)

  const parse = useCallback(async (image: File) => {
    try {
      const usecase = new ParseMenuUseCase(
        geminiAdapter,
        storageAdapter
      )
      const result = await usecase.execute(image)
      setState(result)
    } catch (err) {
      setError(err)
    }
  }, [])

  return { state, error, parse }
}
```

#### 4.2 實現 React 組件

```typescript
// 組件使用 Hooks 並提供清晰的 UI
export function MenuScanForm() {
  const { state, error, parse } = useParseMenu()

  return (
    // JSX 實現...
  )
}
```

#### 4.3 編寫組件測試

```typescript
describe('MenuScanForm', () => {
  test('should display loading state while parsing')
  test('should show error message on failure')
  test('should display menu items on success')
  test('should call onSuccess callback')
})
```

#### 4.4 E2E 測試（如適用）

- 測試完整的用戶流程
- 驗證跨組件交互

---

### Phase 5: 審查與驗收（Review）

#### 5.1 代碼審查

檢查清單：
- ✅ 是否遵循 Domain / Infrastructure / UI 層的分離
- ✅ Domain 層是否完全獨立於框架
- ✅ 是否有適當的錯誤處理
- ✅ 代碼風格是否一致（ESLint + Prettier）
- ✅ TypeScript 類型是否完整
- ✅ 是否有充分的測試覆蓋

#### 5.2 功能驗證

- 手動測試核心用戶流程
- 驗證所有接受條件都已滿足
- 檢視性能指標（如適用）

#### 5.3 文檔更新

- 更新 ARCHITECTURE.md（如有架構變更）
- 更新 CODE-STANDARDS.md（如有新規範）
- 記錄決策至 DECISIONS.md

---

## 🧪 測試策略

### 測試金字塔

```
        △
       /│\        E2E 測試（少數關鍵流程）
      / │ \       5-10% 測試覆蓋
     /  │  \
    ┌───┴───┐
    │ Integration\     集成測試（Port 實現與 API）
    │ Tests      \    20-30% 測試覆蓋
    ├─────────────┐
    │   Unit Tests│   單元測試（Domain 邏輯與 Hooks）
    │             │   60-70% 測試覆蓋
    └─────────────┘
```

### 測試編寫指南

#### Domain 層單元測試

```typescript
// Mock 所有 Ports
const mockGeminiPort = {
  parseMenuImage: vi.fn()
}

describe('ParseMenuUseCase', () => {
  test('should return parsed menu', async () => {
    const useCase = new ParseMenuUseCase(mockGeminiPort)
    const result = await useCase.execute(imageBuffer)

    expect(result).toBeDefined()
    expect(result.items.length).toBeGreaterThan(0)
  })
})
```

#### Infrastructure 層集成測試

```typescript
// 測試真實的 API 或使用 mock server
describe('GeminiAdapter', () => {
  test('should handle rate limiting', async () => {
    // 模擬 429 Rate Limit 響應
    const adapter = new GeminiAdapter(mockService)
    // 驗證重試邏輯或錯誤處理
  })
})
```

#### UI 層組件測試

```typescript
import { render, screen, userEvent } from '@testing-library/react'

describe('MenuScanForm', () => {
  test('should call onSubmit with selected file', async () => {
    const onSubmit = vi.fn()
    render(<MenuScanForm onSubmit={onSubmit} />)

    const file = new File(['content'], 'menu.jpg')
    await userEvent.upload(screen.getByRole('input'), file)
    await userEvent.click(screen.getByRole('button', { name: /scan/i }))

    expect(onSubmit).toHaveBeenCalledWith(file)
  })
})
```

---

## 📝 Commit 與 PR 規範

### Commit 消息格式

遵循 Conventional Commits：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type：**
- `feat` - 新功能
- `fix` - 修復 bug
- `refactor` - 代碼重構
- `test` - 添加或修改測試
- `docs` - 文檔變更
- `chore` - 構建、依賴等無關代碼變更

**範例：**
```
feat(menu-scan): implement AI menu parsing with Gemini API

- Add ParseMenuUseCase in domain layer
- Implement GeminiAdapter for API integration
- Add comprehensive unit tests for domain logic
- Add MenuScanForm component with file upload

Closes #42
```

### Pull Request 檢查清單

- ✅ 代碼遵循編碼規範（ESLint / Prettier）
- ✅ TypeScript 無類型錯誤
- ✅ 所有新代碼都有測試
- ✅ 所有測試通過（`npm run test`）
- ✅ 構建成功（`npm run build`）
- ✅ 相關文檔已更新
- ✅ 提交消息遵循 Conventional Commits

---

## 🚀 部署流程

### 前提條件
```bash
# 所有以下命令必須成功執行
npm run type-check
npm run lint
npm run test
npm run build
```

### 部署步驟（Firebase Hosting）

```bash
# 1. 確保代碼已提交到主分支
git log -1 --oneline

# 2. 構建
npm run build

# 3. 部署
firebase deploy

# 4. 驗證線上應用
# 訪問部署的 URL 並執行冒煙測試
```

---

## 📊 工作優先級

按以下優先順序執行工作：

### 優先級 1（高）- 執行以完成
1. **架構設計的完整性** - 遵循六邊形架構
2. **代碼品質與測試** - 充分的測試覆蓋
3. **錯誤處理** - 統一的錯誤處理策略
4. **文檔維護** - 設計決策和架構文檔保持最新

### 優先級 2（中）- 重視但可迭代
1. 性能優化（如實測有問題）
2. UI/UX 改進
3. 新功能開發

### 優先級 3（低）- 暫緩考慮
1. 過早優化
2. 非關鍵功能
3. 假想的擴展點

---

## 🔗 相關文檔

- [產品願景](./product.md)
- [技術棧](./tech-stack.md)
- [系統架構](../docs/ARCHITECTURE.md)
- [編碼規範](../docs/CODE-STANDARDS.md)
- [功能清單](../docs/FEATURE-CHECKLIST.md)
- [架構決策](../docs/DECISIONS.md)
