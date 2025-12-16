# Prompt: 開發新功能

## 🎯 任務目標

開發一個新功能，遵循專案的架構原則和代碼品質標準。

---

## 📋 開發流程

### 1. 需求分析

```markdown
請回答以下問題：

□ 這個功能要解決什麼問題？
□ 使用者旅程是什麼？（User Journey）
□ 有哪些邊界條件（Edge Cases）？
□ 效能要求是什麼？
□ 是否需要持久化儲存？
□ 是否需要與 Firebase 互動？
□ 是否需要呼叫外部 API？
```

### 2. 架構設計

```markdown
在實作前，請設計：

□ 資料模型（Data Models）
  - 定義 TypeScript types（在 types/ 目錄）

□ 狀態管理
  - 是否需要新的 Zustand store？
  - 或使用現有的 store？

□ UI 元件規劃
  - 需要哪些 UI 元件？
  - 是否需要建立新的抽象元件？

□ API 設計（如適用）
  - Firebase Functions?
  - API endpoints?
  - 請求/回應格式？
```

### 3. 測試策略

```markdown
規劃測試：

□ 單元測試（Unit Tests）
  - 測試哪些純函數？
  - 測試哪些 store operations？

□ 整合測試（Integration Tests）
  - 測試哪些元件互動？

□ E2E 測試（End-to-End Tests）
  - 測試哪些使用者旅程？
```

---

## 🛠️ 實作步驟

### Step 1: 建立型別定義

```typescript
// types/your-feature.ts

/**
 * Your feature data model
 */
export interface YourFeatureData {
  id: string;
  // ... other fields
}

/**
 * Your feature state
 */
export interface YourFeatureState {
  // ... state fields
}
```

### Step 2: 建立 Firebase 服務（如需要）

```typescript
// lib/firebase/your-feature.ts

/**
 * Fetch data from Firestore
 *
 * @param id - Document ID
 * @returns Feature data
 */
export async function getYourFeatureData(
  id: string
): Promise<YourFeatureData | null> {
  try {
    const docRef = doc(db, "your-collection", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as YourFeatureData;
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw new Error("Failed to fetch data");
  }
}
```

### Step 3: 建立 Zustand Store（如需要）

```typescript
// lib/stores/useYourFeatureStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface YourFeatureState {
  data: YourFeatureData[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setData: (data: YourFeatureData[]) => void;
  addData: (item: YourFeatureData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useYourFeatureStore = create<YourFeatureState>()(
  persist(
    (set) => ({
      data: [],
      isLoading: false,
      error: null,

      setData: (data) => set({ data }),
      addData: (item) => set((state) => ({
        data: [...state.data, item]
      })),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "your-feature-storage",
    }
  )
);
```

### Step 4: 建立 UI 元件（使用抽象層）

```typescript
// components/your-feature/YourFeatureCard.tsx

import { MenuCard, PrimaryButton } from "@/components/common";

interface YourFeatureCardProps {
  data: YourFeatureData;
  onAction: () => void;
}

/**
 * Your feature card component
 */
export function YourFeatureCard({
  data,
  onAction
}: YourFeatureCardProps) {
  return (
    <MenuCard title={data.title} description={data.description}>
      {/* Card content */}

      <PrimaryButton onClick={onAction}>
        執行動作
      </PrimaryButton>
    </MenuCard>
  );
}
```

### Step 5: 建立頁面

```typescript
// app/your-feature/page.tsx

import { useYourFeatureStore } from "@/lib/stores/useYourFeatureStore";
import { YourFeatureCard } from "@/components/your-feature/YourFeatureCard";

export default function YourFeaturePage() {
  const { data, isLoading } = useYourFeatureStore();

  if (isLoading) {
    return <div>載入中...</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Your Feature</h1>

      <div className="grid gap-4 mt-8">
        {data.map((item) => (
          <YourFeatureCard
            key={item.id}
            data={item}
            onAction={() => handleAction(item.id)}
          />
        ))}
      </div>
    </main>
  );
}
```

### Step 6: 撰寫測試

```typescript
// tests/unit/stores/useYourFeatureStore.test.ts

import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useYourFeatureStore } from "@/lib/stores/useYourFeatureStore";

describe("useYourFeatureStore", () => {
  beforeEach(() => {
    useYourFeatureStore.getState().reset();
  });

  it("should add data correctly", () => {
    const { result } = renderHook(() => useYourFeatureStore());

    const mockData = { id: "1", title: "Test" };

    act(() => {
      result.current.addData(mockData);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0]).toEqual(mockData);
  });
});
```

---

## ✅ 完成檢查清單

在提交前，確認：

```bash
□ 程式碼與註解全英文
□ 對話與文件使用繁體中文
□ 技術專有名詞保留英文
□ 使用 UI 抽象層（components/common/）
□ 使用 Zustand stores
□ 使用 Firebase service functions
□ TypeScript 無錯誤（npm run type-check）
□ ESLint 無錯誤（npm run lint）
□ 測試通過（npm run test:run）
□ 覆蓋率達標（npm run test:coverage）
□ 建置成功（npm run build）
□ Commit message 符合 Conventional Commits
□ 更新 README（如需要）
□ 記錄 ADR（如涉及重大決策）
```

---

## 📝 Commit Message 範例

```bash
feat(your-feature): implement your feature functionality

- Add data models for your feature
- Create Zustand store for state management
- Implement UI components with abstraction layer
- Add unit tests (80% coverage)
- Add integration tests for key flows

Related: #123
```

---

**遵循此流程可確保代碼品質和架構一致性。**
