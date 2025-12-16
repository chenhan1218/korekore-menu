# AI Agent 必須遵守的規則

> 這些規則是**強制性**的，所有 AI agents 都必須遵守。

## 🚨 關鍵規則（Critical Rules）

### 1. 語言使用規則（Language Rules）

#### ✅ 必須遵守

```typescript
// ✅ CORRECT: English code and comments
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
  const storageRef = ref(storage, `menus/${userId}/${fileName}`);
  await uploadBytes(storageRef, compressedFile);

  return await getDownloadURL(storageRef);
}
```

```markdown
<!-- ✅ CORRECT: 繁體中文 for docs, keep technical terms in English -->

我們使用 Firebase Authentication 處理使用者登入。
當使用者上傳圖片時，會觸發 Cloud Function 呼叫 Gemini API。
這個 endpoint 會返回 JWT token 用於後續的 API 請求。
```

#### ❌ 禁止

```typescript
// ❌ WRONG: Chinese comments in code
export async function uploadMenuImage(file: File): Promise<string> {
  // 壓縮圖片
  const compressedFile = await compressImage(file);

  // 上傳到 Firebase Storage
  return await uploadToStorage(compressedFile);
}
```

```markdown
<!-- ❌ WRONG: 翻譯技術術語 -->
我們使用火基地認證處理使用者登入。
這個端點會返回 JWT 令牌。
```

---

### 2. UI 元件使用規則（UI Component Rules）

#### ✅ 必須使用抽象層

```typescript
// ✅ CORRECT: Use abstraction layer
import { PrimaryButton, MenuCard } from "@/components/common";

export function HomePage() {
  return (
    <MenuCard title="掃描菜單" description="上傳菜單照片">
      <PrimaryButton size="lg" onClick={handleUpload}>
        上傳菜單照片
      </PrimaryButton>
    </MenuCard>
  );
}
```

#### ❌ 禁止直接使用 shadcn/ui

```typescript
// ❌ WRONG: Direct use of shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export function HomePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>掃描菜單</CardTitle>
      </CardHeader>
      <Button size="lg" onClick={handleUpload}>
        上傳菜單照片
      </Button>
    </Card>
  );
}
```

**理由**: 見 `docs/adr/002-ui-abstraction-layer.md`

---

### 3. 狀態管理規則（State Management Rules）

#### ✅ 使用 Zustand stores

```typescript
// ✅ CORRECT: Use Zustand stores
import { useMenuStore } from "@/lib/stores/useMenuStore";

export function MenuList() {
  const { menus, addMenu, deleteMenu } = useMenuStore();

  const handleDelete = async (menuId: string) => {
    await deleteMenuDocument(menuId);
    deleteMenu(menuId);
  };

  return <div>{/* ... */}</div>;
}
```

#### ❌ 禁止在元件中直接操作 Firebase

```typescript
// ❌ WRONG: Direct Firebase operations in components
import { db } from "@/lib/firebase/config";
import { collection, getDocs } from "firebase/firestore";

export function MenuList() {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    // Don't do this!
    const fetchMenus = async () => {
      const snapshot = await getDocs(collection(db, "menus"));
      setMenus(snapshot.docs.map(doc => doc.data()));
    };
    fetchMenus();
  }, []);

  return <div>{/* ... */}</div>;
}
```

**理由**: 見 `docs/adr/001-state-management-zustand.md`

---

### 4. Firebase 服務使用規則（Firebase Service Rules）

#### ✅ 使用封裝的服務

```typescript
// ✅ CORRECT: Use Firebase service functions
import { uploadMenuImage } from "@/lib/firebase/storage";
import { saveMenuDocument } from "@/lib/firebase/firestore";

const imageUrl = await uploadMenuImage(file, userId);
const menuId = await saveMenuDocument(userId, imageUrl, menuItems);
```

#### ❌ 禁止直接操作 Firebase

```typescript
// ❌ WRONG: Direct Firebase operations
import { ref, uploadBytes } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

const storageRef = ref(storage, `menus/${userId}/${file.name}`);
await uploadBytes(storageRef, file);

await addDoc(collection(db, "menus"), {
  userId,
  imageUrl,
  // ...
});
```

---

### 5. 測試覆蓋率規則（Test Coverage Rules）

#### ✅ 必須達到的覆蓋率

- **單元測試**: 70% (lines, functions, statements)
- **分支覆蓋**: 60%
- **整合測試**: 關鍵流程必須覆蓋
- **E2E 測試**: 核心使用者旅程必須測試

#### ✅ 必須寫測試的情況

```typescript
// ✅ MUST TEST: Business logic
export function calculateOrderTotal(items: MenuItem[]): number {
  // Must have unit test
}

// ✅ MUST TEST: Data transformation
export function parseGeminiResponse(response: string): MenuItem[] {
  // Must have unit test
}

// ✅ MUST TEST: Store operations
export const useMenuStore = create<MenuState>((set) => ({
  // Must have unit test
}));

// ✅ SHOULD TEST: Component interactions
export function MenuList() {
  // Should have integration test
}
```

---

### 6. 代碼品質規則（Code Quality Rules）

#### ✅ 必須通過的檢查

```bash
# Before commit, all must pass:
npm run type-check    # TypeScript 無錯誤
npm run lint          # ESLint 無錯誤
npm run test:run      # 所有測試通過
npm run build         # 建置成功
```

#### ✅ 代碼風格

```typescript
// ✅ CORRECT: Clean, readable code
export async function uploadMenuImage(
  file: File,
  userId: string
): Promise<string> {
  const compressedFile = await compressImage(file);
  const fileName = generateFileName(file.name);
  const filePath = `menus/${userId}/${fileName}`;

  return await uploadToStorage(compressedFile, filePath);
}

// ❌ WRONG: Poor structure
export async function uploadMenuImage(file: File, userId: string): Promise<string> {
  return await uploadToStorage(await compressImage(file), `menus/${userId}/menu_${Date.now()}_${file.name}`);
}
```

---

### 7. Git Commit 規則（Git Commit Rules）

#### ✅ Conventional Commits 格式

```bash
# Format
<type>(<scope>): <subject>

# Examples
feat(menu): implement menu scanning with Gemini API
fix(auth): resolve anonymous login session persistence
docs(adr): add ADR-003 for Firebase backend selection
test(menu): add unit tests for menu store operations
refactor(ui): migrate HomePage to use UI abstraction layer
chore(deps): update Firebase SDK to v10.7.0
```

#### ✅ Type 定義

- `feat`: 新功能
- `fix`: 修復 bug
- `refactor`: 重構（不改變功能）
- `test`: 測試相關
- `docs`: 文件更新
- `chore`: 雜項（依賴更新、配置等）
- `style`: 程式碼格式調整（不影響功能）
- `perf`: 效能優化

---

### 8. 安全性規則（Security Rules）

#### ❌ 絕對禁止

```typescript
// ❌ NEVER: Expose API keys in frontend
const GEMINI_API_KEY = "AIza...";

// ❌ NEVER: Store sensitive data in localStorage
localStorage.setItem("apiKey", apiKey);

// ❌ NEVER: Disable Firebase Security Rules
// Bad firestore.rules:
// allow read, write: if true;
```

#### ✅ 必須遵守

```typescript
// ✅ CORRECT: Use environment variables
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

// ✅ CORRECT: Use secure storage
// Store in Firestore with proper security rules

// ✅ CORRECT: Proper Security Rules
// firestore.rules:
// allow read, write: if request.auth != null;
```

---

### 9. ADR 記錄規則（ADR Documentation Rules）

#### ✅ 何時必須建立 ADR

當你做出以下類型的決策時：
- 選擇技術框架或工具
- 改變專案架構
- 更換第三方服務
- 重大的效能優化策略
- 資料模型重大變更

#### ✅ ADR 必須包含

```markdown
# ADR-XXX: 決策標題

## Status
{Proposed | Accepted | Deprecated}

## Context
為什麼需要做這個決策？

## Decision
我們決定做什麼？

## Alternatives Considered
考慮過哪些方案？各方案的優缺點？

## Consequences
這個決策的正面/負面影響？風險與緩解策略？
```

---

### 10. 專案結構規則（Project Structure Rules）

#### ✅ 必須遵守的結構

```
korekore-menu/
├── app/                    # Next.js pages only
├── components/
│   ├── common/            # 抽象 UI (優先使用)
│   ├── ui/                # shadcn/ui (不直接使用)
│   ├── layout/            # Layout components
│   ├── menu/              # Menu domain
│   ├── order/             # Order domain
│   └── history/           # History domain
├── lib/
│   ├── firebase/          # Firebase services (封裝)
│   ├── stores/            # Zustand stores (business logic)
│   ├── i18n/              # Internationalization
│   └── utils/             # Pure utility functions
├── types/                 # TypeScript types (shared)
├── hooks/                 # Custom React hooks
└── tests/
    ├── unit/             # Unit tests (70% coverage)
    ├── integration/      # Integration tests
    └── e2e/              # E2E tests
```

#### ❌ 禁止的做法

- ❌ 在 `app/` 中寫商業邏輯
- ❌ 在 `components/` 中直接呼叫 Firebase
- ❌ 在 `lib/firebase/` 中引用 React 元件
- ❌ 測試檔案放在 `src/` 之外

---

## 🔍 自動檢查（Automated Checks）

這些檢查會在 CI/CD 中自動執行：

```yaml
# .github/workflows/test.yml
- TypeScript 型別檢查
- ESLint 代碼風格檢查
- Unit tests (必須 70% coverage)
- Integration tests
- E2E tests
- Build 成功
```

如果任何檢查失敗，PR 將無法合併。

---

## 📋 提交前檢查清單（Pre-Commit Checklist）

```bash
□ 程式碼與註解全英文
□ 對話與文件使用繁體中文
□ 技術專有名詞保留英文（Firebase, API, Event 等）
□ 使用 UI 抽象層（components/common/）
□ 使用 Zustand stores 管理狀態
□ 使用 Firebase service functions
□ TypeScript 無錯誤（npm run type-check）
□ ESLint 無錯誤（npm run lint）
□ 測試通過（npm run test:run）
□ 覆蓋率達標（npm run test:coverage）
□ 建置成功（npm run build）
□ Commit message 符合 Conventional Commits
□ 重要決策已記錄 ADR
```

---

## ⚠️ 違反規則的後果

如果 AI agent 違反這些規則：

1. **自動檢查失敗** → CI/CD 阻擋 PR 合併
2. **代碼需要重寫** → 浪費時間和資源
3. **技術債累積** → 未來維護困難
4. **專案品質下降** → 影響長期可維護性

---

## ✅ 規則驗證（Rule Validation）

你可以使用以下命令驗證是否遵守規則：

```bash
# 檢查所有規則
npm run validate

# 個別檢查
npm run type-check       # 規則 6
npm run lint             # 規則 6
npm run test:run         # 規則 5
npm run test:coverage    # 規則 5
npm run build            # 規則 6
```

---

**這些規則是強制性的，所有 AI agents 都必須遵守。**

**最後更新**: 2025-12-16
