# ADR-002: 建立 UI 抽象層

## Status
Accepted

## Context

KoreKore 專案目前使用 shadcn/ui + Tailwind CSS 作為 UI framework。然而：

1. **框架遷移風險**: 未來可能需要遷移到其他 UI framework（Material-UI, Ant Design 等）
2. **耦合度問題**: 頁面直接依賴 shadcn/ui 元件，遷移成本高
3. **一致性要求**: 需要確保整個專案的 UI 風格一致

問題：如何降低 UI framework 的遷移成本，同時保持開發效率？

## Decision

建立 **UI 抽象層** (`components/common/`)，在頁面與底層 UI framework 之間增加一層抽象。

實作方式：
1. 建立抽象的通用元件 (PrimaryButton, MenuCard 等)
2. 這些元件內部使用 shadcn/ui 實作
3. 頁面只使用抽象元件，不直接使用 shadcn/ui
4. 未來遷移時只需修改抽象元件的實作

## Alternatives Considered

### 方案 A: 直接使用 shadcn/ui（原始做法）

**優點**:
- 開發速度快
- 無額外抽象層
- 代碼簡單

**缺點**:
- ❌ 遷移成本高（需修改所有頁面）
- ❌ 與 UI framework 強耦合
- ❌ 難以統一自訂邏輯

### 方案 B: 使用無頭 UI (Headless UI)

**優點**:
- 完全控制樣式
- 框架無關

**缺點**:
- 需要自己處理所有樣式
- 開發速度慢
- 對於 KoreKore 這種專案是 overkill

### 方案 C: 完全自建 UI 元件庫

**優點**:
- 完全掌控
- 無第三方依賴

**缺點**:
- ❌ 開發成本極高
- ❌ 維護成本高
- ❌ 不如使用成熟的 UI framework

## Consequences

### 正面影響
- ✅ **低遷移成本**: 未來更換 UI framework 只需修改 3-5 個抽象元件
- ✅ **統一 API**: 整個專案使用一致的 API 介面
- ✅ **易於自訂**: 可在抽象層加入專案特定的邏輯
- ✅ **更好的測試**: 可以 mock 抽象元件進行測試

### 負面影響
- ⚠️ **多一層抽象**: 增加代碼複雜度
- ⚠️ **初期開發稍慢**: 需要先建立抽象元件

### 遷移成本評估

**不使用抽象層** (直接用 shadcn/ui):
- 遷移到 Material-UI: 需修改 **30+ 個檔案**（所有頁面）
- 預估時間: **5-7 天**

**使用抽象層**:
- 遷移到 Material-UI: 只需修改 **3-5 個檔案**（抽象元件）
- 預估時間: **1-2 天**
- **成本降低 80%** 🎯

## Implementation

### 抽象元件範例

```typescript
// components/common/PrimaryButton.tsx
import { Button } from "@/components/ui/button";

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  // ... 統一的 API
}

export function PrimaryButton({
  children,
  onClick,
  size = "md"
}: PrimaryButtonProps) {
  // 轉換抽象的 size 到 shadcn/ui 的規格
  const uiSize = {
    sm: "sm" as const,
    md: "default" as const,
    lg: "lg" as const,
  }[size];

  return (
    <Button size={uiSize} onClick={onClick}>
      {children}
    </Button>
  );
}

// 未來遷移到 Material-UI:
// import { Button as MuiButton } from '@mui/material';
//
// export function PrimaryButton({ ... }) {
//   return <MuiButton size={size}>{children}</MuiButton>;
// }
```

### 使用範例

```typescript
// ✅ 推薦：使用抽象元件
import { PrimaryButton, MenuCard } from "@/components/common";

<PrimaryButton size="lg" onClick={handleUpload}>
  上傳菜單
</PrimaryButton>

// ❌ 避免：直接使用 shadcn/ui
import { Button } from "@/components/ui/button";
<Button size="lg" onClick={handleUpload}>上傳菜單</Button>
```

## Gradual Migration Plan

不需要立即重構所有現有代碼：

1. **階段 1**: 建立抽象元件（已完成）
   - PrimaryButton
   - MenuCard

2. **階段 2**: 新功能使用抽象元件
   - 所有新開發的頁面使用抽象元件
   - 不回頭修改舊代碼

3. **階段 3**: 漸進式重構（可選）
   - 當修改舊頁面時，順便改用抽象元件
   - 不強制重構

## References

- [Adapter Pattern](https://refactoring.guru/design-patterns/adapter)
- [Component Abstraction Best Practices](https://kentcdodds.com/blog/how-to-use-react-context-effectively)
- [UI Framework Migration Guide](https://react-ui-roundup.vercel.app/)

---

**日期**: 2025-12-16
**決策者**: @chenhan1218
**實作檔案**:
- `components/common/PrimaryButton.tsx`
- `components/common/MenuCard.tsx`
- `components/common/index.ts`
- `app/(root)/page.refactored.example.tsx` (範例)
