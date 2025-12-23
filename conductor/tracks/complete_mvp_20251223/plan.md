# MVP 完成實施計劃

**Track ID:** `complete_mvp_20251223`

**計劃日期:** 2025-12-23

**預期分階段完成，每個 Phase 提交一個 PR**

---

## 📋 實施概覽

本計劃分為 **5 個 Phase**，按以下順序執行：

| Phase | 焦點 | 預期工作量 |
|-------|------|----------|
| **Phase 1** | UI 架構、路由、布局 | 2-3 天 |
| **Phase 2** | 菜單掃描、圖片上傳、進度顯示 | 2-3 天 |
| **Phase 3** | Mock 菜單解析、點餐介面、Zustand Store | 2-3 天 |
| **Phase 4** | 點餐卡生成、複製、分享、UI 完善 | 1-2 天 |
| **Phase 5** | 測試覆蓋、CI/CD 設置、部署 | 2-3 天 |

---

## 🚀 Phase 1: 基礎 UI 架構與路由設置

**目標：** 建立應用的基礎 UI 框架、路由結構與頁面佈局

### Phase 1 任務列表

#### Task 1.1: 建立路由結構與頁面框架
```
TDD 工作流：
1. 編寫單元測試
   - 測試路由是否正確配置
   - 測試頁面組件是否正確渲染

2. 實現代碼
   - 創建 `src/ui/react/pages/` 目錄
   - 實現 HomePage, MenuScanPage, MenuDetailPage, OrderCardPage
   - 配置 React Router 路由表
   - 創建 AppLayout 布局組件

3. 驗證代碼品質
   - 運行測試確保所有 assertion pass
   - 運行 eslint 和 prettier 檢查
```

**產出：**
- [ ] AppRouter 配置文件
- [ ] 4 個頁面組件（基礎框架，無內容）
- [ ] AppLayout 布局組件
- [ ] 路由測試

**關鍵文件：**
- `src/ui/react/index.tsx` - App 入口
- `src/ui/react/router.tsx` - 路由配置
- `src/ui/react/pages/HomePage.tsx`
- `src/ui/react/pages/MenuScanPage.tsx`
- `src/ui/react/pages/MenuDetailPage.tsx`
- `src/ui/react/pages/OrderCardPage.tsx`
- `src/ui/react/components/layout/AppLayout.tsx`

---

#### Task 1.2: 實現 Zustand 全局狀態管理
```
TDD 工作流：
1. 編寫單元測試
   - 測試 Store 初始狀態
   - 測試 State 修改邏輯
   - 測試 Selector 函數

2. 實現代碼
   - 創建 `src/ui/react/stores/` 目錄
   - 實現 MenuStore (菜單掃描狀態)
   - 實現 OrderStore (點餐選擇狀態)
   - 實現 UIStore (UI 狀態，如 loading, error)

3. 驗證代碼品質
```

**產出：**
- [ ] MenuStore (存儲菜單數據、圖片、解析狀態)
- [ ] OrderStore (存儲已選菜項、數量、選擇狀態)
- [ ] UIStore (存儲全局 UI 狀態)
- [ ] Store 單元測試（≥ 80%）

**關鍵文件：**
- `src/ui/react/stores/menuStore.ts`
- `src/ui/react/stores/orderStore.ts`
- `src/ui/react/stores/uiStore.ts`
- `src/ui/react/stores/__tests__/menuStore.test.ts`
- `src/ui/react/stores/__tests__/orderStore.test.ts`
- `src/ui/react/stores/__tests__/uiStore.test.ts`

---

#### Task 1.3: 實現基礎 UI 組件庫
```
TDD 工作流：
1. 編寫單元測試
   - Button, Input, Card, Modal, Toast 等基礎組件
   - 測試組件的渲染、事件處理、accessibility

2. 實現代碼
   - 創建 `src/ui/react/components/common/` 目錄
   - 實現可復用的 UI 組件（基於 TailwindCSS）
   - 確保 ARIA Labels 和鍵盤導航支援

3. 驗證代碼品質
```

**產出：**
- [ ] Button 組件
- [ ] Input 組件
- [ ] Card 組件
- [ ] Modal 組件
- [ ] Toast 組件
- [ ] ProgressBar 組件
- [ ] 組件測試（≥ 60%）

**關鍵文件：**
- `src/ui/react/components/common/Button.tsx`
- `src/ui/react/components/common/Input.tsx`
- `src/ui/react/components/common/Card.tsx`
- `src/ui/react/components/common/Modal.tsx`
- `src/ui/react/components/common/Toast.tsx`
- `src/ui/react/components/common/ProgressBar.tsx`

---

#### Task 1.4: Conductor Phase Verification
- [ ] 所有路由正確工作
- [ ] 所有頁面能正常渲染
- [ ] Store 初始化正常
- [ ] UI 組件可正常使用
- [ ] TypeScript 無類型錯誤
- [ ] ESLint 無警告

**提交 PR：**
```
feat(ui): initialize app routing, store management, and basic components

- Set up React Router with 4 main pages (Home, Scan, Menu, Order Card)
- Implement Zustand stores for menu, order, and UI state management
- Create reusable UI components (Button, Input, Card, Modal, Toast, ProgressBar)
- Add comprehensive tests for stores and components
- All tests pass with 60%+ coverage

Closes #<issue_number>
```

---

## 🖼️ Phase 2: 菜單掃描與圖片上傳

**目標：** 實現菜單圖片上傳與 Firebase Storage 集成

### Phase 2 任務列表

#### Task 2.1: 實現 Firebase Storage Adapter
```
TDD 工作流：
1. 編寫單元測試
   - Mock Firebase SDK
   - 測試圖片上傳邏輯
   - 測試錯誤處理

2. 實現代碼
   - 創建 `FirebaseStorageAdapter` 實現 Port
   - 實現 `uploadMenuImage(file)` 方法
   - 實現 `getImageUrl(path)` 方法
   - 包含重試邏輯和錯誤處理

3. 驗證代碼品質
```

**產出：**
- [x] FirebaseStorageAdapter 實現 (1e9a914)
- [x] 單元測試（19 個測試，100% 通過）
- [x] 錯誤處理邏輯

**關鍵文件：**
- `src/infrastructure/adapters/FirebaseStorageAdapter.ts`
- `src/infrastructure/adapters/__tests__/FirebaseStorageAdapter.test.ts`
- `src/infrastructure/config/firebase.ts`

---

#### Task 2.2: 實現 MenuScanPage 與文件上傳 UI
```
TDD 工作流：
1. 編寫單元測試
   - 測試文件選擇
   - 測試上傳進度顯示
   - 測試錯誤提示
   - 測試圖片預覽

2. 實現代碼
   - 實現 `MenuScanPage` 頁面
   - 實現 `FileUploadInput` 組件（支持 camera 和 file input）
   - 實現上傳進度顯示
   - 實現圖片預覽組件
   - 與 MenuStore 和 UIStore 整合

3. 驗證代碼品質
```

**頁面設計:**
```
┌─────────────────────────────────┐
│   KoreKore 菜單掃描              │
├─────────────────────────────────┤
│                                 │
│  [   拍照或選擇菜單圖片   ]     │
│                                 │
│  ────────────────────────       │
│  或                             │
│  [瀏覽檔案]                      │
│                                 │
│                                 │
│  (圖片預覽區域)                  │
│  ┌─────────────────────────┐    │
│  │                         │    │
│  │  (圖片預覽)              │    │
│  │                         │    │
│  └─────────────────────────┘    │
│                                 │
│  ████████░░░░░░░░░░ 45%       │
│  上傳中...                       │
│                                 │
└─────────────────────────────────┘
```

**產出：**
- [ ] MenuScanPage 完整實現
- [ ] FileUploadInput 組件
- [ ] ImagePreview 組件
- [ ] 上傳進度與錯誤處理
- [ ] 組件測試（≥ 60%）

**關鍵文件：**
- `src/ui/react/pages/MenuScanPage.tsx`
- `src/ui/react/components/features/FileUploadInput.tsx`
- `src/ui/react/components/features/ImagePreview.tsx`
- `src/ui/react/adapters/useMenuUpload.ts` (Custom Hook)

---

#### Task 2.3: 實現上傳 Hook 和 Domain UseCase
```
TDD 工作流：
1. 編寫單元測試（Domain 層）
   - 測試圖片驗證邏輯
   - 測試 MenuData 初始化

2. 編寫單元測試（React Hook）
   - 測試 Hook 狀態管理
   - 測試上傳過程與錯誤處理

3. 實現代碼
   - 完善 Domain 層的文件驗證邏輯
   - 實現 `useMenuUpload` Hook
   - 連接 Adapter → Hook → UI

4. 驗證代碼品質
```

**產出：**
- [ ] useMenuUpload Hook
- [ ] 文件驗證邏輯
- [ ] Hook 單元測試（≥ 80%）

**關鍵文件：**
- `src/ui/react/adapters/useMenuUpload.ts`
- `src/ui/react/adapters/__tests__/useMenuUpload.test.ts`

---

#### Task 2.4: Conductor Phase Verification
- [ ] 用戶可選擇或拍照菜單圖片
- [ ] 圖片上傳至 Firebase 成功
- [ ] 上傳進度正確顯示
- [ ] 圖片預覽正確顯示
- [ ] 錯誤時顯示友善消息
- [ ] 上傳成功後頁面導向正確
- [ ] TypeScript 無類型錯誤
- [ ] 測試覆蓋 ≥ 70%

**提交 PR：**
```
feat(upload): implement menu image scanning and Firebase upload

- Implement FirebaseStorageAdapter for Cloud Storage integration
- Create MenuScanPage with file upload and camera support
- Add ImagePreview component
- Implement useMenuUpload custom hook for state management
- Add image validation and error handling
- Add comprehensive tests with 70%+ coverage

Closes #<issue_number>
```

---

## 🍱 Phase 3: Mock 菜單解析與點餐介面

**目標：** 實現 Mock 菜單數據返回與點餐 UI

### Phase 3 任務列表

#### Task 3.1: 實現 MockMenuAdapter
```
TDD 工作流：
1. 編寫單元測試
   - 測試 Mock 數據返回
   - 測試延遲模擬（2-3 秒）
   - 測試數據結構完整性

2. 實現代碼
   - 創建 `MockMenuAdapter` 實現 GeminiPort
   - 返回預設 Mock 菜單數據
   - 模擬 2-3 秒延遲
   - 實現錯誤模擬（可選，用於測試）

3. 驗證代碼品質
```

**Mock 菜單數據：**
```typescript
const MOCK_MENU: MenuData = {
  id: "mock_menu_1",
  imageUrl: "...",
  restaurantInfo: {
    name: "示例日式餐廳",
    location: "東京都澀谷區"
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
    // ... 更多菜項（10-15 個）
  ]
}
```

**產出：**
- [ ] MockMenuAdapter 實現
- [ ] Mock 數據集合
- [ ] 單元測試（≥ 80%）

**關鍵文件：**
- `src/infrastructure/adapters/MockMenuAdapter.ts`
- `src/infrastructure/adapters/__tests__/MockMenuAdapter.test.ts`

---

#### Task 3.2: 實現菜單解析流程與 useParseMenu Hook
```
TDD 工作流：
1. 編寫單元測試
   - 測試 Hook 狀態管理
   - 測試解析邏輯
   - 測試錯誤處理

2. 實現代碼
   - 完善現有 `useParseMenu` Hook
   - 連接 MockMenuAdapter
   - 實現加載、成功、錯誤狀態
   - 自動跳轉到點餐頁面

3. 驗證代碼品質
```

**產出：**
- [ ] 完善的 useParseMenu Hook
- [ ] Hook 單元測試（≥ 80%）

**關鍵文件：**
- `src/ui/react/adapters/useParseMenu.ts`（更新）
- `src/ui/react/adapters/__tests__/useParseMenu.test.ts`（更新）

---

#### Task 3.3: 實現 MenuDetailPage 與菜項卡片
```
TDD 工作流：
1. 編寫單元測試
   - 測試菜項卡片渲染
   - 測試勾選邏輯
   - 測試數量調整
   - 測試摘要面板更新

2. 實現代碼
   - 實現 `MenuDetailPage`
   - 實現 `MenuItemCard` 組件
   - 實現 `OrderSummary` 組件
   - 與 OrderStore 整合
   - LocalStorage 持久化

3. 驗證代碼品質
```

**頁面設計:**
```
┌──────────────────┬──────────────────┐
│  菜單名稱        │ 已選項目摘要      │
├──────────────────┼──────────────────┤
│                  │                  │
│  [菜項卡片]      │  已選:            │
│  ┌─────────────┐ │  ☑ 菜項1 x 2    │
│  │ カツ丼      │ │  ☑ 菜項3 x 1    │
│  │ 豬排蓋飯    │ │                  │
│  │ ¥1,200      │ │  小計: ¥3,500   │
│  │ 說明...      │ │                  │
│  │ ☐ x 1 -+   │ │  [生成點餐卡]   │
│  └─────────────┘ │                  │
│                  │                  │
│  [菜項卡片]      │                  │
│  ┌─────────────┐ │                  │
│  │ 天丼        │ │                  │
│  │ 天婦羅蓋飯  │ │                  │
│  │ ¥1,100      │ │                  │
│  │ 說明...      │ │                  │
│  │ ☐ x 1 -+   │ │                  │
│  └─────────────┘ │                  │
│                  │                  │
└──────────────────┴──────────────────┘
```

**產出：**
- [ ] MenuDetailPage 完整實現
- [ ] MenuItemCard 組件
- [ ] OrderSummary 組件
- [ ] 數量調整邏輯
- [ ] LocalStorage 持久化
- [ ] 組件測試（≥ 60%）

**關鍵文件：**
- `src/ui/react/pages/MenuDetailPage.tsx`
- `src/ui/react/components/features/MenuItemCard.tsx`
- `src/ui/react/components/features/OrderSummary.tsx`

---

#### Task 3.4: 實現 OrderSelectionUseCase（Domain 層）
```
TDD 工作流：
1. 編寫單元測試
   - 測試選擇邏輯
   - 測試數量調整
   - 測試價格計算
   - 測試驗證邏輯

2. 實現代碼
   - 實現 `OrderSelectionUseCase`
   - 實現選擇狀態管理
   - 實現價格計算邏輯
   - 實現驗證邏輯

3. 驗證代碼品質
```

**產出：**
- [ ] OrderSelectionUseCase 實現
- [ ] UseCase 單元測試（≥ 80%）

**關鍵文件：**
- `src/domain/usecases/OrderSelectionUseCase.ts`
- `src/domain/usecases/__tests__/OrderSelectionUseCase.test.ts`

---

#### Task 3.5: Conductor Phase Verification
- [ ] 圖片上傳後自動觸發菜單解析
- [ ] Mock 菜單數據正確返回
- [ ] MenuDetailPage 正確顯示菜項
- [ ] 用戶可勾選/取消菜項
- [ ] 數量調整功能正常
- [ ] OrderSummary 實時更新
- [ ] 勾選狀態在刷新後保留
- [ ] TypeScript 無類型錯誤
- [ ] 測試覆蓋 ≥ 70%

**提交 PR：**
```
feat(menu): implement mock menu parsing and ordering interface

- Create MockMenuAdapter to provide mock menu data
- Implement MenuDetailPage with item cards and order summary
- Add MenuItemCard component with quantity adjustment
- Implement OrderSummary panel with real-time updates
- Add OrderSelectionUseCase for order logic
- Implement LocalStorage persistence for selections
- Add comprehensive tests with 70%+ coverage

Closes #<issue_number>
```

---

## 🎟️ Phase 4: 點餐卡生成與分享

**目標：** 實現點餐卡生成、複製、分享功能

### Phase 4 任務列表

#### Task 4.1: 實現 GenerateOrderCardUseCase（Domain 層）
```
TDD 工作流：
1. 編寫單元測試
   - 測試敬語格式化
   - 測試點餐卡生成
   - 測試邊界情況

2. 實現代碼
   - 實現 `GenerateOrderCardUseCase`
   - 實現敬語轉換邏輯（カツ丼 × 2 → カツ丼を二つください）
   - 實現點餐卡文本格式化

3. 驗證代碼品質
```

**敬語規則（示例）：**
```typescript
// 數量轉換
1 → 一つ (ひとつ)
2 → 二つ (ふたつ)
3 → 三つ (みつつ)
...
10+ → 數字 + つ (e.g., 10つ)

// 格式
{itemName}を{quantity}ください。
例: カツ丼を二つください。
```

**產出：**
- [ ] GenerateOrderCardUseCase 實現
- [ ] 敬語轉換邏輯
- [ ] 單元測試（≥ 80%）

**關鍵文件：**
- `src/domain/usecases/GenerateOrderCardUseCase.ts`
- `src/domain/usecases/__tests__/GenerateOrderCardUseCase.test.ts`

---

#### Task 4.2: 實現 OrderCardFormatter（Infrastructure）
```
TDD 工作流：
1. 編寫單元測試
   - 測試文本格式化
   - 測試內容完整性

2. 實現代碼
   - 實現 `OrderCardFormatter`
   - 實現文本格式化邏輯

3. 驗證代碼品質
```

**產出：**
- [ ] OrderCardFormatter 實現
- [ ] 單元測試（≥ 80%）

**關鍵文件：**
- `src/infrastructure/services/OrderCardFormatter.ts`
- `src/infrastructure/services/__tests__/OrderCardFormatter.test.ts`

---

#### Task 4.3: 實現 OrderCardPage 與複製/分享功能
```
TDD 工作流：
1. 編寫單元測試
   - 測試點餐卡渲染
   - 測試複製功能
   - 測試分享功能

2. 實現代碼
   - 實現 `OrderCardPage`
   - 實現 `OrderCard` 組件（展示點餐卡）
   - 實現複製到剪貼板邏輯（navigator.clipboard API）
   - 實現 Web Share API 分享
   - 實現 Toast 反饋

3. 驗證代碼品質
```

**頁面設計:**
```
┌────────────────────────────┐
│  返回 │ 點餐卡             │
├────────────────────────────┤
│                            │
│  ════════════════════════  │
│      當前菜單點餐卡        │
│  ════════════════════════  │
│                            │
│  【選餐項目】              │
│  ① カツ丼 × 2             │
│  ② 天丼 × 1               │
│                            │
│  ────────────────────────  │
│                            │
│  【敬語注文】              │
│  カツ丼を二つください。    │
│  天丼を一つください。      │
│                            │
│  ────────────────────────  │
│                            │
│  合計金額: ¥3,500          │
│  生成時間: 2025-12-23      │
│                            │
│  ════════════════════════  │
│                            │
│  [複製點餐卡] [分享]       │
│                            │
└────────────────────────────┘
```

**產出：**
- [ ] OrderCardPage 完整實現
- [ ] OrderCard 組件
- [ ] 複製功能（Clipboard API）
- [ ] 分享功能（Web Share API）
- [ ] Toast 提示組件
- [ ] 組件測試（≥ 60%）

**關鍵文件：**
- `src/ui/react/pages/OrderCardPage.tsx`
- `src/ui/react/components/features/OrderCard.tsx`
- `src/ui/react/hooks/useCopy.ts` (Custom Hook for clipboard)
- `src/ui/react/hooks/useShare.ts` (Custom Hook for share)

---

#### Task 4.4: 連接流程與 UI 完善
```
工作流：
1. 連接所有頁面導航
   - MenuScanPage → MenuDetailPage（掃描完成）
   - MenuDetailPage → OrderCardPage（生成點餐卡）
   - OrderCardPage → MenuDetailPage（返回編輯）

2. 優化 UI/UX
   - 添加頁面過度動畫
   - 優化響應式設計
   - 添加 loading/error 狀態
   - 優化 accessibility

3. 測試
   - 完整流程測試
   - 各頁面 navigation 測試
   - 響應式設計測試
```

**產出：**
- [ ] 完整的流程導航
- [ ] 動畫過度
- [ ] 響應式設計優化
- [ ] E2E 測試

---

#### Task 4.5: Conductor Phase Verification
- [ ] 點餐卡正確生成
- [ ] 敬語格式正確
- [ ] 複製功能正常（Clipboard API）
- [ ] 分享功能正常（Web Share API）
- [ ] 複製/分享有視覺反饋
- [ ] 可返回編輯選擇
- [ ] 響應式設計正常
- [ ] TypeScript 無類型錯誤
- [ ] 測試覆蓋 ≥ 70%

**提交 PR：**
```
feat(order-card): implement order card generation, copy, and share

- Create GenerateOrderCardUseCase with honorific formatting
- Implement OrderCardFormatter for text formatting
- Create OrderCardPage with order card display
- Add copy-to-clipboard functionality (Clipboard API)
- Add Web Share API integration for sharing
- Implement navigation flow between all pages
- Add animations and responsive design
- Add comprehensive tests with 70%+ coverage

Closes #<issue_number>
```

---

## 🧪 Phase 5: 測試覆蓋與 CI/CD 設置

**目標：** 建立完整的自動化測試與 CI/CD 管道

### Phase 5 任務列表

#### Task 5.1: 補充 Domain 層測試覆蓋（目標 ≥ 80%）
```
檢查清單：
1. 檢查現有 Domain 層測試覆蓋率
   - ParseMenuImage UseCase
   - OrderSelectionUseCase
   - GenerateOrderCardUseCase

2. 補充缺失的測試
   - 邊界情況測試
   - 錯誤場景測試
   - 業務規則驗證

3. 運行 vitest 驗證覆蓋率
   npm run test:coverage
```

**產出：**
- [ ] Domain 層測試覆蓋 ≥ 80%
- [ ] 測試覆蓋率報告

---

#### Task 5.2: 補充 Infrastructure 層測試覆蓋（目標 ≥ 70%）
```
檢查清單：
1. Adapters 測試
   - FirebaseStorageAdapter
   - MockMenuAdapter
   - OrderCardFormatter

2. Services 測試
   - 關鍵 Service 的集成測試

3. 運行 vitest 驗證覆蓋率
```

**產出：**
- [ ] Infrastructure 層測試覆蓋 ≥ 70%
- [ ] Integration 測試完善

---

#### Task 5.3: 補充 UI 層測試覆蓋（目標 ≥ 60% Hooks, ≥ 40% Components）
```
檢查清單：
1. Hooks 測試（≥ 60%）
   - useMenuUpload
   - useParseMenu
   - useCopy
   - useShare

2. 組件測試（≥ 40%，關鍵組件優先）
   - MenuScanPage
   - MenuDetailPage
   - MenuItemCard
   - OrderSummary
   - OrderCard

3. 運行 vitest 驗證覆蓋率
```

**產出：**
- [ ] Hooks 測試覆蓋 ≥ 60%
- [ ] 關鍵組件測試覆蓋 ≥ 40%
- [ ] React Testing Library 測試

---

#### Task 5.4: 配置 GitHub Actions CI/CD
```
工作流：
1. 創建 .github/workflows/ 目錄

2. 配置以下工作流：

   a) type-check.yml
      - 運行 TypeScript 類型檢查
      - 檢查類型錯誤

   b) lint.yml
      - 運行 ESLint 檢查
      - 運行 Prettier 檢查
      - 自動修復格式化（可選）

   c) test.yml
      - 運行 vitest
      - 生成覆蓋率報告
      - 檢查覆蓋率是否達標

   d) build.yml
      - 運行 npm run build
      - 驗證構建成功

3. 配置 main.yml（組合工作流）
   - 在 PR 上運行所有檢查
   - 在 main 分支推送時運行
   - 如果所有檢查通過，自動部署至 Vercel

4. 配置部署工作流
   - 構建成功後自動部署至 Vercel
```

**GitHub Actions 配置示例：**

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run type-check

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:coverage -- --check-coverage

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build

  deploy:
    needs: [type-check, lint, test, build]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

**產出：**
- [ ] .github/workflows/type-check.yml
- [ ] .github/workflows/lint.yml
- [ ] .github/workflows/test.yml
- [ ] .github/workflows/build.yml
- [ ] .github/workflows/deploy.yml
- [ ] Vercel 部署配置

**關鍵文件：**
- `.github/workflows/ci.yml` 或個別工作流文件

---

#### Task 5.5: Lighthouse 性能優化與驗證
```
工作流：
1. 運行 npm run build（生產構建）

2. 在本地或 Vercel 上測試
   npm run preview

3. 使用 Lighthouse 檢測
   - Performance: ≥ 80
   - Accessibility: ≥ 90
   - Best Practices: ≥ 90

4. 如有問題，進行優化
   - 代碼分割 (Code Splitting)
   - 圖片優化
   - 動畫優化
   - Bundle 大小分析

5. 生成 Lighthouse 報告
```

**產出：**
- [ ] Lighthouse 分數 ≥ 80（Performance）
- [ ] 性能報告
- [ ] 優化建議實施

---

#### Task 5.6: 文檔更新
```
更新以下文檔：

1. ARCHITECTURE.md
   - 添加實現細節
   - 添加文件結構說明
   - 更新架構圖

2. FEATURE-CHECKLIST.md
   - 標記完成的功能
   - 更新進度

3. DECISIONS.md
   - 記錄 Mock vs Real API 決策
   - 記錄技術選型決策
   - 記錄 Vercel vs Firebase Hosting 決策

4. README.md
   - 更新快速開始指南
   - 更新部署說明
   - 添加構建和測試命令

5. 添加 TESTING.md
   - 說明測試運行方式
   - 說明覆蓋率要求
   - 說明如何編寫測試
```

**產出：**
- [ ] ARCHITECTURE.md 更新
- [ ] FEATURE-CHECKLIST.md 更新
- [ ] DECISIONS.md 更新
- [ ] README.md 更新
- [ ] TESTING.md 新建

---

#### Task 5.7: Conductor Phase Verification
- [ ] Domain 層測試覆蓋 ≥ 80%
- [ ] Infrastructure 層測試覆蓋 ≥ 70%
- [ ] UI 層 Hooks 測試覆蓋 ≥ 60%
- [ ] 關鍵組件測試覆蓋 ≥ 40%
- [ ] ESLint 無警告
- [ ] TypeScript 無錯誤
- [ ] 所有測試通過
- [ ] 構建成功
- [ ] GitHub Actions 所有工作流通過
- [ ] Lighthouse 分數 ≥ 80
- [ ] 應用成功部署至 Vercel
- [ ] 文檔完整更新

**提交 PR：**
```
test(ci-cd): add comprehensive test coverage and GitHub Actions CI/CD

- Add Domain layer unit tests (80%+ coverage)
- Add Infrastructure layer tests (70%+ coverage)
- Add React Hooks tests (60%+ coverage)
- Add component tests for key components (40%+ coverage)
- Configure GitHub Actions workflows:
  - type-check.yml
  - lint.yml
  - test.yml
  - build.yml
  - deploy.yml (auto-deploy to Vercel)
- Verify Lighthouse performance ≥ 80
- Update documentation (ARCHITECTURE, DECISIONS, README)
- All tests pass, build succeeds, CI/CD workflows green

Closes #<issue_number>
```

---

## 🎯 關鍵里程碑

| 階段 | 里程碑 | 驗收標準 |
|------|--------|---------|
| **Phase 1** | 基礎架構完成 | 路由、Store、組件庫可用 |
| **Phase 2** | 圖片上傳完成 | 用戶可上傳圖片至 Firebase |
| **Phase 3** | 點餐介面完成 | 用戶可勾選菜項並預覽 |
| **Phase 4** | 完整流程完成 | 用戶可生成並分享點餐卡 |
| **Phase 5** | 質量與自動化完成 | 70%+ 測試覆蓋，CI/CD 正常運行 |

---

## 📝 提交 Commit 規範

遵循 Conventional Commits：

```
<type>(<scope>): <subject>

<body>

Closes #<issue_number>
```

**Type:**
- `feat` - 新功能
- `fix` - 修復 bug
- `test` - 測試相關
- `refactor` - 代碼重構
- `docs` - 文檔變更

**Scope:** Domain, Infrastructure, UI, CI/CD

---

## 🚀 各 Phase 預期完成時間

- **Phase 1:** 2-3 天（UI 架構搭建）
- **Phase 2:** 2-3 天（圖片上傳功能）
- **Phase 3:** 2-3 天（點餐介面開發）
- **Phase 4:** 1-2 天（點餐卡生成與分享）
- **Phase 5:** 2-3 天（測試與 CI/CD）

**總預期:** 9-14 天（全職開發）

---

## ✅ 最終驗收清單

在宣佈 Track 完成前，驗證以下所有項目：

- [ ] 用戶完整流程可正常運作（拍照 → 存圖 → 點餐 → 生成卡）
- [ ] 所有 4 大功能完全實現
- [ ] 測試覆蓋達到目標（Domain 80%, Infra 70%, UI 60%)
- [ ] ESLint 無警告，TypeScript 無錯誤
- [ ] Prettier 格式檢查通過
- [ ] 所有自動化測試通過
- [ ] 構建成功
- [ ] Lighthouse 分數 ≥ 80
- [ ] GitHub Actions CI/CD 所有工作流通過
- [ ] 應用成功部署至 Vercel
- [ ] 文檔完整更新
- [ ] 手動驗收：功能符合 Spec

