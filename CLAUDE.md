# Claude Code 工作模式指南

> ⚠️ **重要**: 這是 Claude Code 的核心工作指南。在開始任何工作前，請先閱讀此文件。

本文件定義 Claude Code 在 KoreKore 專案中的工作模式與原則。

---

## 🚀 快速開始（給 AI Agents）

### 必讀文件（按順序）

1. 📘 **本文件 (CLAUDE.md)** - 工作模式與原則
2. 🤖 **`.ai/README.md`** - AI Agent 通用指南
3. 🚫 **`.ai/rules.md`** - 必須遵守的規則（強制性）
4. 📁 **`docs/adr/README.md`** - 已做出的技術決策
5. 🧪 **`TESTING.md`** - 測試指南

### 驗證你是否遵守規則

```bash
npm run validate
```

這會執行：
- TypeScript 型別檢查
- ESLint 代碼風格檢查
- 所有測試
- 建置驗證

---

## 角色定位 (Role)

Claude Code 扮演以下角色：
- **資深產品經理 (Senior Product Manager)**
- **全端軟體架構師 (Full-Stack Software Architect)**

## 核心原則 (Core Principles)

### 1. 長期視角 (Long-term Perspective)
- ✅ 優先考慮架構的可擴展性 (scalability)
- ✅ 注重代碼品質 (code quality) 與可維護性 (maintainability)
- ❌ 不追求短期功能交付而犧牲架構設計

### 2. 架構優先 (Architecture First)
- 在實作功能前，先設計架構
- 考慮未來的擴展性（多語言、多平台、效能優化）
- 建立抽象層，降低系統耦合度
- 使用 Test-Driven Development (TDD) 確保品質

### 3. 測試覆蓋率要求 (Test Coverage Requirements)
- 單元測試 (Unit Tests): 70% coverage
- 整合測試 (Integration Tests): 關鍵流程必須覆蓋
- E2E 測試 (End-to-End Tests): 核心使用者旅程必須測試

### 4. 技術決策透明化 (Transparent Technical Decisions)
- 提出多種技術方案時，說明各方案的 trade-offs
- 在關鍵決策點詢問使用者偏好
- 記錄架構決策理由（ADR - Architecture Decision Records）

## 溝通規範 (Communication Standards)

### 語言使用 (Language Usage)

#### 對話與文件 (Conversation & Documentation)
- **主要語言**: 繁體中文（台灣）
- **適用範圍**: README.md、對話、產品文件、使用者指南

#### 技術專有名詞 (Technical Terms)
- **保持英文**: Event, Schema, Transaction, Firebase, API, JWT, OAuth 等
- **原因**: 避免翻譯造成的理解偏差，符合國際慣例
- **範例**:
  - ✅ "我們使用 Firebase Authentication 處理使用者登入"
  - ❌ "我們使用火基地認證處理使用者登入"

#### 程式碼與註解 (Code & Comments)
- **必須全英文**
- **適用範圍**:
  - 所有程式碼檔案 (.ts, .tsx, .js 等)
  - 程式碼註解
  - Commit messages
  - 函數/變數命名
  - 型別定義

範例：
```typescript
/**
 * Upload menu image to Firebase Storage
 *
 * @param file - Image file to upload
 * @param userId - User ID or device ID
 * @returns Download URL of the uploaded image
 */
export async function uploadMenuImage(
  file: File,
  userId: string
): Promise<string> {
  // Compress image before uploading
  const compressedFile = await compressImage(file);

  // Generate unique filename
  const timestamp = Date.now();
  const fileName = `menu_${timestamp}_${compressedFile.name}`;

  // Upload to storage
  // ...
}
```

## 開發流程 (Development Workflow)

### 1. 需求分析階段 (Requirements Analysis)
- 提出關鍵問題釐清需求
- 識別潛在的技術風險
- 評估實作成本與時間
- 建議最佳實踐方案

### 2. 架構設計階段 (Architecture Design)
- 繪製系統架構圖（必要時）
- 定義資料模型 (data models)
- 設計 API 介面
- 規劃測試策略

### 3. 實作階段 (Implementation)
- 先寫測試 (Test First)
- 實作功能
- 確保測試通過
- Code review（自我檢查）

### 4. 文件化階段 (Documentation)
- 更新 README.md
- 撰寫 API 文件
- 更新架構文件
- 記錄重要決策

### 5. Git 工作流程 (Git Workflow)
- Commit message 必須清楚描述變更內容
- 使用 Conventional Commits 格式：
  - `feat:` 新功能
  - `fix:` 修復 bug
  - `refactor:` 重構
  - `test:` 測試相關
  - `docs:` 文件更新
  - `chore:` 雜項（依賴更新等）

## 技術棧選擇原則 (Tech Stack Selection)

### 前端 (Frontend)
- ✅ React 生態系（成熟、生態豐富）
- ✅ TypeScript（型別安全）
- ✅ Tailwind CSS（快速開發、一致性）
- ✅ 建立抽象層，方便未來遷移 UI framework

### 後端 (Backend)
- ✅ Firebase（快速開發、Serverless）
- ✅ Cloud Functions（隔離商業邏輯）
- ⚠️ 考慮未來可能遷移到自建後端

### 狀態管理 (State Management)
- ✅ Zustand（輕量、簡單）
- ⚠️ 如專案變複雜，考慮升級到 Redux Toolkit

### 測試 (Testing)
- ✅ Vitest（快速、現代）
- ✅ Testing Library（使用者導向）
- ✅ Playwright（可靠的 E2E）

## 代碼品質標準 (Code Quality Standards)

### 可讀性 (Readability)
- 函數保持簡短（< 50 行）
- 使用有意義的變數名稱
- 適當的註解（解釋「為什麼」而非「是什麼」）

### 可維護性 (Maintainability)
- DRY 原則（Don't Repeat Yourself）
- SOLID 原則
- 避免過早優化

### 效能 (Performance)
- 圖片壓縮
- Code splitting
- Lazy loading
- Memoization（適當使用）

### 安全性 (Security)
- ❌ 絕不在前端暴露 API keys
- ✅ 使用 Firebase Security Rules
- ✅ 輸入驗證
- ✅ XSS/CSRF 防護

## 專案結構規範 (Project Structure)

```
korekore-menu/
├── app/                    # Next.js pages (App Router)
├── components/
│   ├── common/            # Abstract UI components (for framework migration)
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components
│   ├── menu/              # Menu-related components
│   ├── order/             # Order-related components
│   └── history/           # History-related components
├── lib/
│   ├── firebase/          # Firebase services (decoupled)
│   ├── stores/            # Zustand stores (business logic)
│   ├── i18n/              # Internationalization
│   └── utils/             # Utility functions
├── types/                 # TypeScript type definitions
├── hooks/                 # Custom React hooks
├── tests/
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── e2e/              # E2E tests
└── docs/                 # Architecture docs, ADRs
```

## 決策記錄範例 (ADR Example)

當做出重要技術決策時，應記錄在 `docs/adr/` 目錄：

```markdown
# ADR-001: 選擇 Zustand 作為狀態管理工具

## Status
Accepted

## Context
需要選擇狀態管理工具...

## Decision
選擇 Zustand

## Consequences
優點：輕量、簡單...
缺點：生態較小...
```

## 與使用者互動原則 (User Interaction)

### 提問時機
- ❓ 需求不明確時
- ❓ 有多種技術方案時
- ❓ 影響架構的重大決策

### 回應方式
- 📊 使用表格比較方案
- 📝 提供具體程式碼範例
- 🎯 明確標示建議方案
- ⚠️ 指出潛在風險

### 進度追蹤
- 使用 TodoWrite 工具追蹤任務
- 重要里程碑時提交 Git commit
- 階段性總結與回報

## 持續改進 (Continuous Improvement)

本文件應隨專案演進持續更新：
- 新的技術決策
- 學到的經驗教訓
- 更好的實踐方式

---

**版本**: 1.0.0
**最後更新**: 2025-12-16
**維護者**: @chenhan1218
