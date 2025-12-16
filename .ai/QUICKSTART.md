# 🚀 Quick Start - AI Agents（極簡版）

> 📊 Token 優化版本：~500 tokens（原版 30,000 tokens）

## 1️⃣ 核心規則（Critical - 必讀）

### 語言使用
- 程式碼與註解：**全英文**
- 對話與文件：**繁體中文**
- 技術術語：**保留英文**（Firebase, API, Event 等）

### 架構規則
- UI 元件：**必須使用** `components/common/`（抽象層）
- 狀態管理：**必須使用** Zustand stores
- Firebase：**必須使用** `lib/firebase/` 封裝的函數

### 品質標準
```bash
✅ npm run type-check   # TypeScript 無錯誤
✅ npm run lint         # ESLint 無錯誤
✅ npm run test:run     # 測試通過
✅ npm run validate     # 一鍵驗證（推薦）
```

---

## 2️⃣ 開發流程（5 步驟）

```
1. 閱讀相關 ADR → 2. 設計架構 → 3. 寫測試 → 4. 實作 → 5. 驗證
```

---

## 3️⃣ Commit 格式

```bash
feat(scope): description      # 新功能
fix(scope): description       # 修復 bug
docs: description            # 文件更新
test: description            # 測試
refactor: description        # 重構
```

---

## 4️⃣ 禁止事項

- ❌ 中文註解
- ❌ 直接使用 `components/ui/`（使用 `components/common/`）
- ❌ 元件中直接呼叫 Firebase
- ❌ 前端暴露 API keys
- ❌ 跳過測試

---

## 5️⃣ 需要更多資訊時

```
語言規則詳情      → .ai/rules.md#語言使用規則
UI 抽象層說明    → docs/adr/002-ui-abstraction-layer.md
測試要求        → TESTING.md
完整工作模式    → CLAUDE.md
開發新功能流程   → .ai/prompts/new-feature.md
```

---

## ✅ 檢查清單（提交前）

```bash
□ 程式碼全英文
□ 使用 components/common/
□ 使用 Zustand stores
□ npm run validate 通過
□ Commit message 符合格式
```

---

**Token 使用**: ~500 tokens
**完整文件**: 詳見 CLAUDE.md（需要時再讀）
