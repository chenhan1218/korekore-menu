# ADR-001: 選擇 Zustand 作為狀態管理工具

## Status
Accepted

## Context

KoreKore 專案需要選擇一個狀態管理工具來管理：
- 菜單資料 (menu data)
- 使用者狀態 (user state)
- UI 狀態 (UI state)

需求：
- 輕量級，不影響 bundle size
- TypeScript 支援良好
- 學習曲線平緩
- 支援持久化 (persistence)
- 與 Next.js App Router 相容

## Decision

選擇 **Zustand** 作為狀態管理工具。

理由：
1. **輕量**: 僅 1KB，對效能影響最小
2. **簡單直觀**: API 設計簡潔，團隊容易上手
3. **TypeScript 完美支援**: 型別推斷優秀
4. **內建 middleware**: 支援 persist、devtools
5. **不需要 Provider**: 減少 boilerplate code

## Alternatives Considered

### 方案 A: Redux Toolkit

**優點**:
- 生態系成熟，社群大
- DevTools 強大
- 大型專案經過驗證

**缺點**:
- Bundle size 較大 (11KB+)
- Boilerplate code 較多
- 學習曲線陡峭
- 對於 KoreKore 這種中小型專案是 overkill

### 方案 B: Context API + useReducer

**優點**:
- React 內建，無需額外依賴
- Bundle size 為 0

**缺點**:
- 沒有內建持久化
- 沒有 DevTools
- 複雜狀態管理較繁瑣
- 需要大量 boilerplate code

### 方案 C: Jotai

**優點**:
- Atomic state management
- 輕量 (2.5KB)
- TypeScript 支援好

**缺點**:
- 學習曲線較 Zustand 陡
- 社群較小
- 文件較少

## Consequences

### 正面影響
- ✅ 快速開發：簡單的 API 加速開發速度
- ✅ 效能優異：輕量且不需要 Context Provider
- ✅ 易於測試：store 是獨立的，容易 mock 和測試
- ✅ 可維護性：代碼簡潔，容易理解和維護

### 負面影響
- ⚠️ 生態系較小：相比 Redux 可用的 middleware 較少
- ⚠️ 未來擴展：如果專案變得非常複雜，可能需要遷移到 Redux

### 風險與緩解策略
- **風險**: 如果未來需要複雜的狀態管理（如時間旅行調試），Zustand 可能不足
- **緩解**:
  1. 建立良好的 store 結構，方便未來遷移
  2. 將商業邏輯與 UI 分離
  3. 使用 TypeScript 確保型別安全

### 遷移計劃（如需要）
如果未來需要遷移到 Redux：
1. Store 結構已經是 slice-based，與 Redux Toolkit 相似
2. Actions 和 reducers 的概念相通
3. 預估遷移時間：1-2 天

## Implementation

```typescript
// lib/stores/useMenuStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MenuState {
  menus: MenuDocument[];
  currentMenu: MenuDocument | null;
  selectedItems: string[];

  // Actions
  setMenus: (menus: MenuDocument[]) => void;
  addMenu: (menu: MenuDocument) => void;
  // ...
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      menus: [],
      currentMenu: null,
      selectedItems: [],

      setMenus: (menus) => set({ menus }),
      addMenu: (menu) => set((state) => ({
        menus: [menu, ...state.menus]
      })),
      // ...
    }),
    {
      name: "menu-storage",
    }
  )
);
```

## References

- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Redux vs Zustand Comparison](https://blog.logrocket.com/zustand-vs-redux/)
- [State Management in Next.js 14](https://nextjs.org/docs/app/building-your-application/data-fetching/patterns)

---

**日期**: 2025-12-16
**決策者**: @chenhan1218
**實作檔案**:
- `lib/stores/useMenuStore.ts`
- `lib/stores/useUserStore.ts`
- `lib/stores/useUIStore.ts`
