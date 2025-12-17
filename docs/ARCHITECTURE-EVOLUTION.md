# 架構演進與框架遷移指南

本文檔詳細說明如何無痛地從 React 遷移到其他 UI 框架（Vue、Svelte、Angular 等）。

---

## 核心原則

KoreKore 採用六邊形架構，確保**業務邏輯與 UI 框架完全解耦**。

### 遷移成本對比

| 方案 | 迴圈 | 代碼改動 | 完成時間 |
|------|------|--------|---------|
| **起初正確設計** | 0 | 依賴注入層 | 1-2 天 |
| **中途改造** | 1 | 40-60% 代碼 | 1-2 週 |
| **後期改造** | 2+ | 80%+ 代碼 | 2-4 週 |

**建議：** 現在採用正確架構，節省未來數週的重構時間。

---

## 遷移地圖

```
層級            React (現狀)              Vue/Svelte (未來)
───────────────────────────────────────────────────────────────
Domain          ✅ 完全相同               ✅ 完全相同
Infrastructure  ✅ 完全相同               ✅ 完全相同
UI Adapters     ❌ React Hooks            ✅ Vue Composables / Svelte Stores
UI Components   ❌ .tsx Components        ✅ .vue / .svelte Components
───────────────────────────────────────────────────────────────
需要改寫: ~15-20% 代碼 (僅 UI 層)
可複用: ~80-85% 代碼 (Domain + Infrastructure)
```

---

## 分層遷移指南

### 第 0 層：完全不需要改動（80%+ 代碼）

```
✅ src/domain/              # 業務邏輯 - 100% 可複用
   ├─ entities/
   ├─ usecases/
   ├─ value-objects/
   └─ ports/

✅ src/infrastructure/       # 外部依賴 - 100% 可複用
   ├─ services/
   ├─ repositories/
   ├─ adapters/
   └─ config/

✅ src/shared/              # 共用工具 - 100% 可複用
   ├─ types/
   └─ utils/
```

**結果：** 僅需複製這 3 個目錄到新項目，無需修改任何代碼。

### 第 1 層：改寫 Adapters（10-15% 代碼）

**從 React Hooks 改寫為 Vue Composables**

```typescript
// 舊：src/ui/react/adapters/useParseMenu.ts
import { useState, useCallback } from 'react'

export const useParseMenu = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const parse = useCallback(async (imageBase64) => {
    setLoading(true)
    // ...
  }, [])

  return { parse, loading, error }
}
```

```typescript
// 新：src/ui/vue/adapters/useParseMenu.ts
import { ref } from 'vue'

export const useParseMenu = () => {
  const loading = ref(false)
  const error = ref(null)

  const parse = async (imageBase64) => {
    loading.value = true
    // ...業務邏輯完全相同
  }

  return { parse, loading, error }
}
```

**核心觀察：** 業務邏輯 `parse()` 的實現完全相同！只是 React state 改成 Vue ref。

### 第 2 層：改寫 Components（5-10% 代碼）

**從 React 改寫為 Vue**

```tsx
// 舊：src/ui/react/components/MenuScanForm.tsx
import React from 'react'
import { useParseMenu } from '../adapters/useParseMenu'

export const MenuScanForm: React.FC = () => {
  const { parse, loading, error } = useParseMenu()

  return (
    <div>
      <button onClick={() => parse(imageBase64)}>
        {loading ? '解析中...' : '上傳菜單'}
      </button>
      {error && <p>{error.message}</p>}
    </div>
  )
}
```

```vue
<!-- 新：src/ui/vue/components/MenuScanForm.vue -->
<template>
  <div>
    <button @click="() => parse(imageBase64)">
      {{ loading ? '解析中...' : '上傳菜單' }}
    </button>
    <p v-if="error">{{ error.message }}</p>
  </div>
</template>

<script setup>
import { useParseMenu } from '../adapters/useParseMenu'

const { parse, loading, error } = useParseMenu()
</script>
```

**核心觀察：** 邏輯 Hook 完全相同，只是模板語法不同。

---

## 實際遷移流程

### Phase 1: 並行開發 (Week 1)

保留 React，同時開發 Vue 適配層：

```
src/
├── domain/                  # 共用
├── infrastructure/          # 共用
├── ui/
│   ├── react/              # 現有
│   │   ├── components/
│   │   ├── adapters/
│   │   └── App.tsx
│   └── vue/                # 新增
│       ├── components/     # 新組件
│       ├── adapters/       # 新 Composables
│       └── App.vue
├── shared/                  # 共用
└── index-react.html        # React 入口
└── index-vue.html          # Vue 入口 (新)
```

**好處：**
- 兩個框架同時工作
- 快速驗證架構是否真的可替換
- 逐步遷移，無需一次完成

### Phase 2: 完全遷移 (Week 2)

刪除 React，完全使用 Vue：

```bash
# 1. 刪除 React 層
rm -rf src/ui/react/
rm src/index-react.html

# 2. 重命名 Vue 層
mv src/ui/vue src/ui/default

# 3. 更新構建配置
# vite.config.ts: 指向 src/ui/default/App.vue

# 4. 驗證功能
npm run dev
npm run test
```

### Phase 3: 清理 (Day 1)

- 更新文檔指向新框架
- 刪除 React 依賴
- 移除 React 相關配置

---

## 遷移檢查清單

### 準備階段
- [ ] 確認 Domain 層完全框架無關
- [ ] 確認 Infrastructure 層完全框架無關
- [ ] 列出所有需要改寫的 Adapters 與 Components

### 開發階段
- [ ] 建立新的 `src/ui/[framework]/` 目錄
- [ ] 實現新 Framework 的 Adapters
- [ ] 實現新 Framework 的 Components
- [ ] 驗證功能与舊框架一致

### 測試階段
- [ ] 所有 Domain 層測試通過（無需改動）
- [ ] 新 Framework 的組件測試通過
- [ ] E2E 測試通過
- [ ] 視覺回歸測試通過

### 發佈階段
- [ ] 刪除舊 Framework 代碼
- [ ] 更新構建配置
- [ ] 更新文檔
- [ ] 驗證 Bundle 大小
- [ ] 部署到生產環境

---

## 成本估計

### Vue.js (相似度 ~90%)
```
Adapters:  3-4 小時  (useParseMenu, useSaveMenu, etc)
Components: 6-8 小時  (UI 組件改寫)
Tests:      2-3 小時  (新框架測試)
────────────────────
Total:      ~1-1.5 天
```

### Svelte (相似度 ~85%)
```
Adapters:  3-4 小時  (Stores 模式不同)
Components: 8-10 小時 (Svelte 語法差異較大)
Tests:      2-3 小時
────────────────────
Total:      ~1.5-2 天
```

### Angular (相似度 ~70%)
```
Adapters:  6-8 小時  (完全不同的註入模式)
Components: 12-16 小時 (Decorators 等)
Tests:      4-5 小時
────────────────────
Total:      ~2-3 天
```

---

## 驗證遷移成功的指標

### 代碼質量
- ✅ TypeScript strict mode 無錯誤
- ✅ ESLint 無警告
- ✅ 代碼覆蓋率 > 80%

### 功能完整性
- ✅ 所有 Domain 層 UseCase 測試通過
- ✅ 所有 UI Adapters 測試通過
- ✅ 完整用戶流程 E2E 測試通過

### 性能
- ✅ Bundle 大小 < 舊框架
- ✅ 初始加載時間 < 2s
- ✅ Lighthouse 評分 > 80

### 用戶體驗
- ✅ 無功能回歸
- ✅ 無視覺差異
- ✅ 交互响應速度無下降

---

## 常見陷阱與解決方案

### 陷阱 1: Domain 層依賴了 UI 框架

```typescript
// ❌ 錯誤：usecase 導入 React
import { useState } from 'react'

export const parseMenuUseCase = () => { ... }
```

**解決：** Domain 層只用 TypeScript，不導入任何框架庫。

### 陷阱 2: Infrastructure 層緊耦合實現細節

```typescript
// ❌ 錯誤：服務層依賴 React 狀態
export const GeminiService = () => {
  const [cache, setCache] = useState({})
}
```

**解決：** Infrastructure 只調用外部 API，不管理 React 狀態。

### 陷阱 3: Adapters 混雜業務邏輯

```typescript
// ❌ 錯誤：Hook 裡面有業務邏輯
export const useParseMenu = () => {
  const [items, setItems] = useState([])

  const parse = async (image) => {
    // 業務邏輯不應該在這裡
    const validated = validateImage(image)
    const processed = processImage(validated)
    // ...
  }
}
```

**解決：** Adapters 只包裝 UseCase，業務邏輯在 Domain 層。

---

## 未來支援多框架的策略

### 方案 A: Monorepo + 多應用

```
apps/
├── app-react/          # 現有 React 應用
├── app-vue/            # 新 Vue 應用
└── shared-libs/        # Domain + Infrastructure
    ├── domain/
    └── infrastructure/
```

**優點：** 清潔分離，各自獨立
**缺點：** 代碼重複，維護成本高

### 方案 B: 單應用 + 可切換框架

```
src/
├── domain/
├── infrastructure/
├── ui/
│   ├── react/          # 默認
│   ├── vue/            # 可選
│   └── config.ts       # 選擇框架
└── shared/
```

**優點：** 代碼複用，易於遷移
**缺點：** Bundle 體積大（包含多個框架）

### 建議

**現階段：** 方案 B（單應用），因為代碼複用最大化
**未來：** 逐步遷移到方案 A（Monorepo），當應用複雜度提升時

---

## 總結

| 階段 | 投入 | 回報 |
|------|------|------|
| **現在設計** | 2-3 天 | 節省 1-3 週的未來重構時間 |
| **框架遷移** | 1-3 天 | 完全無痛的框架切換 |
| **長期維護** | -30% | 代碼複用率提升 80%+ |

**結論：** 採用六邊形架構的投入在第一天獲得回報，在未來框架遷移時節省大量時間。

---

**最後更新：2025-12-17**
