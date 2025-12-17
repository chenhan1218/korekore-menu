# 架構決策記錄 (ADR)

本文檔記錄所有重要的架構決策、替代方案與決策原因。

---

## ADR-001: 選擇 React + TypeScript 作為前端框架

**狀態：** ✅ 已決策

**日期：** 2025-12-17

### 背景
需要選擇適合快速迭代、類型安全、社區廣泛的前端框架。

### 替代方案

| 方案 | 優點 | 缺點 |
|------|------|------|
| **React + TypeScript** | 生態豐富、類型安全、學習資源多、易於維護 | 初期配置較複雜 |
| Vue + TypeScript | 學習曲線低、模板語法簡潔 | 社區較小、生態較少 |
| Svelte | 編譯體積小、性能好 | 社區小、生態不足 |
| Angular | 完整框架、企業級 | 過度複雜，開發體驗差 |

### 決策
✅ **選擇 React + TypeScript**

### 理由
1. **類型安全：** TypeScript 提升代碼質量，減少運行時錯誤
2. **生態豐富：** 有適合每個場景的庫和工具
3. **社區活躍：** 遇到問題易於查找解決方案
4. **易於擴展：** 為未來添加功能（如 PWA、離線支援）預留空間
5. **人才儲備：** 相較其他框架，React 開發者更容易找到

### 結果
- 使用 React 18 + TypeScript 5.x
- 配合 Vite 作為構建工具（快速開發體驗）
- 使用 React Router 進行頁面路由

---

## ADR-002: 選擇 Zustand 而非 Redux 進行狀態管理

**狀態：** ✅ 已決策

**日期：** 2025-12-17

### 背景
KoreKore 的狀態管理需求相對簡單，需要在 boilerplate 少、易學、性能好之間取得平衡。

### 替代方案

| 方案 | Bundle Size | Boilerplate | 學習曲線 | 適用場景 |
|------|-------------|-----------|--------|---------|
| **Zustand** | ~1KB | 最少 | 低 | 中小型應用 ✅ |
| Redux | ~10KB | 最多 | 高 | 大型複雜應用 |
| Recoil | ~4KB | 中等 | 中 | React 專屬原子狀態 |
| Context API | 0KB | 中等 | 低 | 簡單應用 |
| MobX | ~8KB | 少 | 中 | 反應式編程 |

### 決策
✅ **選擇 Zustand**

### 理由
1. **易學易用：** 直觀的 API，新手易快速上手
2. **最小化 Boilerplate：** 減少不必要的代碼，提升開發效率
3. **性能優秀：** 自動訂閱優化，無需手動優化
4. **輕量級：** Bundle 體積小，適合移動應用
5. **DevTools 支援：** 有 Redux DevTools 集成選項

### 結果
- 使用 Zustand 4.x 進行全局狀態管理
- Store 分離：`appStore.ts` (全局) + 各功能的 Hook (局部)

### 參考實現
```typescript
// src/store/appStore.ts
import { create } from 'zustand'

export const useAppStore = create((set, get) => ({
  menus: [],
  selectedItems: [],

  actions: {
    addMenu: (menu) => set(state => ({
      menus: [...state.menus, menu]
    }))
  }
}))
```

---

## ADR-003: 使用 Gemini 1.5 Flash 作為 AI 菜單解析引擎

**狀態：** ✅ 已決策

**日期：** 2025-12-17

### 背景
需要選擇適合菜單圖片解析的 AI 模型。需要考慮成本、速度、準確度。

### 替代方案

| 模型 | 供應商 | 成本 (1M tokens) | 速度 | 準確度 | 特點 |
|------|--------|-----------------|------|--------|------|
| **Gemini 1.5 Flash** | Google | ~$0.08 | 快 | 高 | **最優選擇** ✅ |
| GPT-4o | OpenAI | ~$5 | 中等 | 最高 | 過度，不划算 |
| Claude 3.5 Sonnet | Anthropic | ~$3 | 中等 | 高 | 貴且不必要 |
| PaddleOCR | 開源 | 0 | 快 | 中等 | 需自行部署、準確度不理想 |

### 決策
✅ **選擇 Gemini 1.5 Flash**

### 理由
1. **成本低：** 每百萬 tokens 約 $0.08，適合高頻調用
2. **速度快：** Flash 模型優化為快速推理，用戶體驗佳
3. **準確度足夠：** 對菜單文字識別能力強，準確度 95%+ 足以
4. **多模態：** 同時支援文字和圖片，易於進一步擴展
5. **Google 生態：** 與 Firebase 同屬 Google，集成簡便

### 結果
- 使用 Google Generative AI SDK（`@google/generative-ai`）
- Model: `gemini-1.5-flash`
- 實現參考：`src/services/geminiService.ts`

### 成本預估
- 預期月均 100 萬 tokens 使用
- 月成本約 $8，在可接受範圍內

---

## ADR-004: Firebase 作為後端即服務 (BaaS) 平台

**狀態：** ✅ 已決策

**日期：** 2025-12-17

### 背景
需要快速上線無需自行維護伺服器的應用。需要支援無登入使用 + 可選登入同步。

### 替代方案

| 方案 | 優點 | 缺點 | 適配度 |
|------|------|------|--------|
| **Firebase** | 完整 BaaS、易於無登入支援、即時同步、自動擴展 | 價格難預測、廠商鎖定 | ⭐⭐⭐⭐⭐ |
| Supabase | 開源、PostgreSQL、更便宜 | 功能不如 Firebase 完整 | ⭐⭐⭐ |
| AWS Amplify | 功能豐富、彈性 | 配置複雜、學習曲線陡 | ⭐⭐⭐ |
| 自行部署 (Node.js) | 完全控制、成本可控 | 需維護伺服器、開發時間長 | ⭐⭐ |

### 決策
✅ **選擇 Firebase**

### 理由
1. **無需認證仍可使用：** Firebase Anonymous Auth 完美支援
2. **易於登入同步：** 用戶登入後自動同步歷史
3. **Firestore 即時性：** 多裝置間數據同步快速
4. **Cloud Storage：** 圖片存儲簡便，內建 CDN
5. **免費方案充足：** Spark 方案適合初期開發
6. **易於集成：** Firebase SDK 集成 Google Auth、Gemini API

### 結果
- **Firestore：** 存儲菜單元數據
- **Cloud Storage：** 存儲菜單圖片
- **Authentication：** 匿名 + Email 登入
- **Hosting：** 部署應用

### 成本預估
- 初期免費方案 (Spark)
- 升級到 Blaze (按量付費) 時，預期月成本 $10-50

---

## ADR-005: 使用 TailwindCSS 作為樣式方案

**狀態：** ✅ 已決策

**日期：** 2025-12-17

### 背景
需要高效開發 UI，同時保持代碼可維護性和樣式一致性。

### 替代方案

| 方案 | 優點 | 缺點 |
|------|------|------|
| **TailwindCSS** | 高效、DRY、響應式優先、生態豐富 | HTML 中 Class 名較多 |
| CSS Modules | 局部作用域、無衝突 | 需手動命名、開發效率低 |
| Styled Components | CSS-in-JS、類型安全 | Runtime 開銷、Bundle 體積大 |
| BEM + SCSS | 規範清晰、性能好 | 開發效率相對低 |

### 決策
✅ **選擇 TailwindCSS**

### 理由
1. **開發速度快：** 無需切換工具即可完成樣式
2. **響應式優先：** 內建響應式工具類，易於適配各設備
3. **一致的設計系統：** 預設配色、間距、排版，保證視覺一致
4. **低重複代碼：** @apply 指令減少 CSS 重複定義
5. **優秀的 DevX：** IDE 支援自動完成，開發體驗好

### 結果
- 配置 `tailwind.config.js`
- 使用工具類快速開發 UI
- 複雜樣式可用 CSS Modules 補充

---

## ADR-006: 使用 Vite 作為構建工具

**狀態：** ✅ 已決策

**日期：** 2025-12-17

### 背景
需要快速的開發迭代循環與高效的生產構建。

### 替代方案

| 工具 | 冷啟時間 | HMR 更新 | 構建速度 | 穩定度 |
|------|---------|---------|--------|--------|
| **Vite** | ~100ms | 50ms | 快 | ⭐⭐⭐⭐⭐ |
| Create React App | ~5s | 3s | 中等 | ⭐⭐⭐⭐⭐ |
| Webpack | ~5s | 1s | 慢 | ⭐⭐⭐⭐ |
| Turbopack | ~500ms | 100ms | 快 | ⭐⭐⭐ (新興) |

### 決策
✅ **選擇 Vite**

### 理由
1. **開發體驗優秀：** 超快的冷啟動和 HMR，提升開發效率
2. **按需編譯：** 只編譯正在編輯的文件，快速反饋
3. **官方支援：** React 官方推薦，生態健全
4. **生產構建快：** 使用 esbuild，比 Webpack 快 10+ 倍
5. **零配置上手：** 開箱即用，無需複雜配置

### 結果
- 配置 `vite.config.ts`
- 開發命令：`npm run dev`
- 構建命令：`npm run build`

---

## ADR-007: 按功能 (Feature-based) 而非按層級 (Layer-based) 組織代碼

**狀態：** ✅ 已決策

**日期：** 2025-12-17

### 背景
項目初期，需要決定代碼組織方式來平衡模塊化與易查找。

### 替代方案

```
按層級組織 (Layer-based):
src/
├── components/     # 所有組件
├── services/       # 所有服務
├── hooks/          # 所有 Hooks
├── types/          # 所有類型
└── utils/          # 所有工具

按功能組織 (Feature-based):
src/
├── features/
│   ├── menu-scan/
│   ├── ai-processing/
│   ├── ordering/
│   └── order-card/
├── shared/        # 共用代碼
│   ├── components/
│   ├── services/
│   ├── hooks/
│   └── types/
```

### 決策
✅ **採用混合方式：功能優先 + 共用服務分離**

### 理由
1. **功能內聚：** 修改某功能時，相關代碼集中，易於理解與維護
2. **易於擴展：** 添加新功能時，新建功能目錄即可，不影響其他模塊
3. **易於複用：** 跨功能的服務 (Gemini, Firebase) 單獨放在 `src/services`
4. **克服層級組織的問題：** 避免在 `src/components` 中查找菜單掃描組件很困難的情況

### 結果
```
src/
├── features/              # 功能模塊
│   ├── menu-scan/
│   ├── ai-processing/
│   ├── ordering/
│   └── order-card/
├── shared/                # 共用代碼
│   ├── components/
│   ├── services/
│   ├── hooks/
│   └── types/
```

---

## ADR-008: 嚴格的 TypeScript 配置以確保類型安全

**狀態：** ✅ 已決策

**日期：** 2025-12-17

### 背景
TypeScript 的價值在於編譯期間捕捉類型錯誤。寬鬆的配置會削弱這個優勢。

### 決策
✅ **啟用嚴格模式 + 禁用 `any`**

### 配置 (tsconfig.json)
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true
  }
}
```

### 理由
1. **捕捉錯誤早期：** 編譯期而非運行時
2. **提升代碼質量：** 強制明確類型定義
3. **提升可維護性：** 他人讀代碼時一目了然
4. **減少 Bug：** null/undefined 相關錯誤大幅減少

---

## ADR-009: 使用 Vitest + React Testing Library 進行測試

**狀態：** ✅ 已決策

**日期：** 2025-12-17

### 背景
需要快速、可靠的測試框架，特別是對 React 組件的測試。

### 替代方案

| 工具 | 適用範圍 | 特點 | 學習曲線 |
|------|---------|------|---------|
| **Vitest + React Testing Library** | 單元 + 集成 | 快速、鼓勵最佳實踐 | 中 |
| Jest + Enzyme | 單元 + 集成 | 傳統、實現細節測試 | 低 |
| Cypress | E2E | 易用、強大 | 中 |
| Playwright | E2E | 跨瀏覽器 | 中 |

### 決策
✅ **Vitest (單元測試) + React Testing Library (組件測試) + Cypress (E2E 測試)**

### 理由
1. **Vitest 快速：** 基於 Vite，啟動快、執行快
2. **React Testing Library 最佳實踐：** 鼓勵從用戶角度測試，避免測試實現細節
3. **生態健全：** 結合 Cypress 進行 E2E 測試
4. **易於維護：** 測試代碼更接近實際使用方式

### 結果
- 測試文件位置：`tests/`
- 測試命令：`npm run test`
- 覆蓋率報告：`npm run test:coverage`

---

## ADR-010: 無需登入也能使用，但支援可選登入同步

**狀態：** ✅ 已決策

**日期：** 2025-12-17

### 背景
降低使用門檻，同時為想跨裝置同步的用戶提供選項。

### 架構決策

```
┌─────────────────────────────────────┐
│ 本地存儲 (LocalStorage)              │
├─────────────────────────────────────┤
│ - 第一次使用無需登入              │
│ - 菜單歷史存在本地                 │
└──────────────┬──────────────────────┘
               │
               ├─ 用戶選擇登入 ──────────┐
               │                        │
               ▼                        ▼
        [Firestore] ◄──────► [Firebase Auth]
        - 跨裝置同步
        - 用戶關聯數據
```

### 實現策略
1. **初始化：** App 啟動時用 Anonymous Auth 取得 Device ID
2. **本地操作：** 所有操作先保存到 LocalStorage
3. **Firestore 同步（可選）：**
   - 用戶登入時，將 LocalStorage 菜單遷移至 Firestore
   - 之後新操作實時同步到 Firestore
4. **多裝置存取：** 已登入用戶可在任何裝置訪問歷史

### 結果
- 無需登入即可完整使用應用
- 登入後自動同步歷史
- 提升應用易用性

---

## 決策變更流程

若需要變更上述決策，請遵循以下流程：

1. **記錄背景：** 說明為何要考慮變更
2. **列出替代方案：** 至少列出 2-3 個替代方案
3. **評估成本：** 包括時間成本、技術風險、遷移成本
4. **團隊討論：** 獲得共識
5. **更新此文件：** 記錄新的決策與理由
6. **更新相關文檔：** ARCHITECTURE.md 等
7. **提交 Commit：** 使用 `docs(adr): ...` 前綴

---

**最後更新：2025-12-17**
