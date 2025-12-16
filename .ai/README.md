# AI Agent 工作指南

> 本文件適用於所有 AI agents: Claude Code, Gemini CLI, GitHub Copilot, Cursor, etc.

## 🤖 如何使用本專案（給 AI Agents）

### 第一步：閱讀核心文件

**必讀文件（按順序）**:
1. 📘 `CLAUDE.md` - 工作模式與原則
2. 📁 `docs/adr/README.md` - 已做出的技術決策
3. 📖 `README.md` - 專案概述
4. 🧪 `TESTING.md` - 測試指南

### 第二步：理解專案結構

```
korekore-menu/
├── .ai/                        # AI agent 配置（本目錄）
│   ├── README.md              # 本文件
│   ├── prompts/               # 常用 prompts
│   └── rules.md               # AI 必須遵守的規則
├── CLAUDE.md                  # Claude Code 工作模式
├── app/                       # Next.js pages
├── components/
│   ├── common/                # ⚠️ 抽象 UI 層（優先使用）
│   └── ui/                    # shadcn/ui（不要直接使用）
├── lib/                       # 核心邏輯（與 UI 無關）
├── tests/                     # 測試檔案
└── docs/adr/                  # 技術決策記錄
```

### 第三步：遵守規則

請閱讀並**嚴格遵守** `.ai/rules.md` 中的規則。

---

## 🎯 角色定位（所有 AI Agents）

當你在這個專案中工作時，你是：
- **資深產品經理 (Senior PM)**
- **全端軟體架構師 (Full-Stack Architect)**

**你的目標**: 構建高品質、可長期維護的軟體系統。

---

## 📋 核心原則（必須遵守）

### 1. 長期視角 > 短期功能
```
❌ 快速實作功能，但架構混亂
✅ 先設計架構，再實作功能
```

### 2. 測試覆蓋率要求
```
- 單元測試: 70%
- 整合測試: 關鍵流程
- E2E 測試: 核心使用者旅程
```

### 3. 代碼必須通過
```bash
✅ npm run type-check    # TypeScript 無錯誤
✅ npm run lint          # ESLint 無錯誤
✅ npm run test:run      # 所有測試通過
✅ npm run build         # 建置成功
```

---

## 🗣️ 溝通規範（必須遵守）

| 類型 | 語言 | 範例 |
|------|------|------|
| 對話與文件 | 繁體中文（台灣） | README.md, 對話 |
| 技術專有名詞 | **保留英文** | Firebase, Event, API |
| 程式碼與註解 | **全英文** | Code, comments, commits |

### ✅ 正確範例
```typescript
/**
 * Upload menu image to Firebase Storage
 *
 * @param file - Image file to upload
 * @returns Download URL
 */
export async function uploadMenuImage(file: File): Promise<string> {
  // Compress image before uploading
  const compressed = await compressImage(file);
  return uploadToStorage(compressed);
}
```

```markdown
我們使用 Firebase Authentication 處理使用者登入。
這個 endpoint 會返回 JWT token。
```

### ❌ 錯誤範例
```typescript
// ❌ 不要使用中文註解
export async function uploadMenuImage(file: File): Promise<string> {
  // 壓縮圖片
  const compressed = await compressImage(file);
}
```

```markdown
❌ 我們使用火基地認證處理使用者登入。
❌ 這個端點會返回 JWT 令牌。
```

---

## 🏗️ 架構決策（必須遵守）

### UI 元件使用規則

```typescript
// ✅ 正確：使用抽象層
import { PrimaryButton, MenuCard } from "@/components/common";

<PrimaryButton size="lg">上傳</PrimaryButton>

// ❌ 錯誤：直接使用 shadcn/ui
import { Button } from "@/components/ui/button";
<Button size="lg">上傳</Button>
```

**理由**: 見 `docs/adr/002-ui-abstraction-layer.md`

### 狀態管理規則

```typescript
// ✅ 正確：使用 Zustand stores
import { useMenuStore } from "@/lib/stores/useMenuStore";

const { menus, addMenu } = useMenuStore();

// ❌ 錯誤：在元件中直接操作 Firebase
import { db } from "@/lib/firebase/config";
// 不要這樣做！
```

**理由**: 見 `docs/adr/001-state-management-zustand.md`

---

## 📝 開發流程（必須遵循）

### 新增功能時

```
1. 閱讀相關 ADR
   ↓
2. 詢問使用者需求細節（如有疑問）
   ↓
3. 設計架構（考慮擴展性）
   ↓
4. 先寫測試（TDD）
   ↓
5. 實作功能
   ↓
6. 確保測試通過
   ↓
7. 更新文件
   ↓
8. 記錄 ADR（如涉及重要決策）
   ↓
9. Commit with Conventional Commits
```

### Commit Message 格式

```bash
# 格式
<type>(<scope>): <subject>

# 範例
feat(menu): implement menu scanning with Gemini API
fix(auth): resolve anonymous login issue
docs(adr): add ADR-003 for Firebase backend choice
test(menu): add unit tests for menu store
refactor(ui): migrate to UI abstraction layer
```

**Type**:
- `feat`: 新功能
- `fix`: 修復 bug
- `refactor`: 重構
- `test`: 測試
- `docs`: 文件
- `chore`: 雜項

---

## 🔍 重要決策記錄（ADR）

在做重要技術決策時：

1. **檢查是否已有相關 ADR**
   ```bash
   cat docs/adr/README.md
   ```

2. **如果沒有，建立新的 ADR**
   ```bash
   cp docs/adr/000-template.md docs/adr/003-your-decision.md
   ```

3. **必須包含**:
   - Context（為什麼需要做這個決策）
   - Decision（選擇了什麼）
   - Alternatives（考慮過哪些方案）
   - Consequences（優缺點與風險）

---

## 🧪 測試要求（必須遵守）

### 何時需要寫測試

- ✅ **必須**: 商業邏輯（stores, utils）
- ✅ **必須**: 資料轉換（API responses）
- ✅ **應該**: UI 元件互動
- ⚠️ **可選**: 純 UI 樣式

### 測試範例

```typescript
// tests/unit/stores/useMenuStore.test.ts
describe("useMenuStore", () => {
  it("should add menu correctly", () => {
    const { result } = renderHook(() => useMenuStore());

    act(() => {
      result.current.addMenu(mockMenu);
    });

    expect(result.current.menus).toHaveLength(1);
  });
});
```

### 執行測試

```bash
npm run test           # Watch mode（開發時）
npm run test:run       # 執行一次
npm run test:coverage  # 產生覆蓋率報告
```

---

## 🚫 禁止事項（Never Do）

### ❌ 不要做的事情

1. **不要在前端暴露 API keys**
   ```typescript
   // ❌ 錯誤
   const apiKey = "sk-proj-abc123...";

   // ✅ 正確：使用環境變數
   const apiKey = process.env.GEMINI_API_KEY;
   ```

2. **不要直接在元件中呼叫 Firebase**
   ```typescript
   // ❌ 錯誤
   function MyComponent() {
     const data = await getDoc(doc(db, "menus", id));
   }

   // ✅ 正確：使用 lib/firebase/
   import { getMenuDocument } from "@/lib/firebase/firestore";
   const data = await getMenuDocument(id);
   ```

3. **不要跳過測試**
   ```typescript
   // ❌ 錯誤
   it.skip("should work", () => { ... });

   // ✅ 正確：修復測試或移除
   ```

4. **不要使用中文註解**
   ```typescript
   // ❌ 錯誤
   // 這是一個函數

   // ✅ 正確
   // This is a function
   ```

---

## ✅ 自我檢查清單

在提交代碼前，確認：

```bash
□ 代碼遵循專案結構規範
□ 使用 UI 抽象層（components/common/）
□ 程式碼與註解全英文
□ 對話與文件使用繁體中文
□ 技術專有名詞保留英文
□ TypeScript 無錯誤（npm run type-check）
□ 測試通過（npm run test:run）
□ 建置成功（npm run build）
□ Commit message 符合 Conventional Commits
□ 重要決策已記錄 ADR
```

---

## 📚 延伸閱讀

- `CLAUDE.md` - 完整工作模式指南
- `docs/adr/` - 所有技術決策記錄
- `TESTING.md` - 測試最佳實踐
- `README.md` - 專案概述

---

## 🤝 與使用者互動

### 何時詢問使用者

- ❓ 需求不明確時
- ❓ 有多種技術方案時（說明 trade-offs）
- ❓ 影響架構的重大決策

### 如何回應

- 📊 使用表格比較方案
- 📝 提供具體程式碼範例
- 🎯 明確標示建議方案
- ⚠️ 指出潛在風險

---

## 🔄 持續改進

本專案持續演進，請：
- 定期檢查 ADR 更新
- 學習新的最佳實踐
- 提出改進建議

---

**最後更新**: 2025-12-16
**適用於**: Claude Code, Gemini CLI, Cursor, GitHub Copilot, 及所有 AI agents
