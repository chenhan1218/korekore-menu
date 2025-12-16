# Gemini CLI 專用精簡指南

> 🎯 Optimized for Gemini's smaller context window (32k-128k tokens)
> 📊 Token usage: ~800 tokens (vs 30,000 tokens in full docs)

---

## 🚀 Essential Rules

### Code Language
```typescript
// ✅ CORRECT: English code & comments
export async function uploadMenuImage(file: File): Promise<string> {
  // Compress image before uploading
  return await uploadToStorage(file);
}

// ❌ WRONG: Chinese comments
// 壓縮圖片後上傳
```

### Documentation Language
```markdown
✅ CORRECT: 繁中 + keep tech terms in English
我們使用 Firebase Authentication 處理使用者登入。

❌ WRONG: Translate tech terms
我們使用火基地認證處理使用者登入。
```

---

## 🏗️ Architecture Rules

### 1. Use UI Abstraction Layer
```typescript
// ✅ CORRECT
import { PrimaryButton, MenuCard } from "@/components/common";

// ❌ WRONG
import { Button } from "@/components/ui/button";
```

### 2. Use Zustand Stores
```typescript
// ✅ CORRECT
import { useMenuStore } from "@/lib/stores/useMenuStore";

// ❌ WRONG: Direct Firebase in components
import { db } from "@/lib/firebase/config";
```

### 3. Use Firebase Services
```typescript
// ✅ CORRECT
import { uploadMenuImage } from "@/lib/firebase/storage";

// ❌ WRONG: Direct Firebase operations
import { ref, uploadBytes } from "firebase/storage";
```

---

## 📝 Commit Format

```bash
feat(menu): implement menu scanning      # New feature
fix(auth): resolve login issue          # Bug fix
docs: update README                     # Documentation
test: add unit tests                    # Tests
refactor: improve code structure        # Refactor
```

---

## ✅ Before Commit

```bash
npm run validate  # All checks must pass
```

This runs:
- TypeScript check
- ESLint
- Tests
- Build

---

## 🚫 Never Do

1. ❌ Chinese comments in code
2. ❌ Direct use of `components/ui/`
3. ❌ Firebase calls in components
4. ❌ Expose API keys in frontend
5. ❌ Skip tests

---

## 📂 Project Structure

```
app/              # Pages only
components/
  common/         # ✅ Use this (abstraction)
  ui/             # ❌ Don't use directly
lib/
  firebase/       # ✅ Use these services
  stores/         # ✅ Use these stores
tests/            # Must have 70% coverage
```

---

## 📖 Need More Info?

```bash
# Full guide (only when needed)
cat CLAUDE.md

# Detailed rules
cat .ai/rules.md

# ADR for decisions
cat docs/adr/README.md
```

---

## 💡 Quick Development Flow

```
1. Read relevant ADR (if exists)
2. Design architecture
3. Write tests first (TDD)
4. Implement feature
5. Run `npm run validate`
6. Commit with proper format
```

---

**Token Usage**: ~800 tokens
**For full documentation**: See CLAUDE.md (5,400 tokens)
**Optimization**: 96% token reduction
