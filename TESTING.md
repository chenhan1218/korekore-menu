# 測試指南

本專案使用完整的測試金字塔策略，確保程式碼品質和可維護性。

## 📊 測試策略

```
           ┌─────────────┐
           │  E2E Tests  │  10%  - 完整使用者旅程
           └─────────────┘
         ┌─────────────────┐
         │ Integration Tests│ 20%  - 元件互動
         └─────────────────┘
     ┌───────────────────────┐
     │    Unit Tests         │ 70%  - 商業邏輯
     └───────────────────────┘
```

## 🛠️ 測試工具

- **Vitest**: 快速的單元測試框架
- **Testing Library**: React 元件測試
- **Playwright**: E2E 測試
- **Coverage**: 程式碼覆蓋率報告

## 📝 執行測試

### 單元測試
```bash
# 開發模式（watch mode）
npm run test

# 執行一次
npm run test:run

# UI 介面
npm run test:ui

# 產生覆蓋率報告
npm run test:coverage
```

### E2E 測試
```bash
# 執行所有 E2E 測試
npm run test:e2e

# UI 模式（推薦）
npm run test:e2e:ui
```

### 執行所有測試
```bash
npm run test:all
```

## 📁 測試檔案結構

```
tests/
├── setup.ts                    # 測試環境設定
├── unit/                       # 單元測試
│   ├── stores/                 # Store 測試
│   ├── utils/                  # 工具函數測試
│   └── lib/                    # 核心邏輯測試
├── integration/                # 整合測試
│   └── components/             # 元件測試
└── e2e/                        # E2E 測試
    └── *.spec.ts
```

## ✅ 測試覆蓋率目標

| 類型 | 目標 | 當前 |
|------|------|------|
| 程式碼行 | 70% | - |
| 函數 | 70% | - |
| 分支 | 60% | - |
| 語句 | 70% | - |

## 📚 撰寫測試的最佳實踐

### 1. 單元測試（Unit Tests）

測試**純函數**和**商業邏輯**，不依賴外部服務。

```typescript
// ✅ 好的單元測試
describe('calculateTotal', () => {
  it('應該正確計算總金額', () => {
    const items = [
      { price: 100, quantity: 2 },
      { price: 200, quantity: 1 },
    ];

    expect(calculateTotal(items)).toBe(400);
  });
});
```

### 2. 整合測試（Integration Tests）

測試**元件互動**和**使用者行為**。

```typescript
// ✅ 好的整合測試
it('點擊按鈕應該觸發上傳', async () => {
  const user = userEvent.setup();
  render(<UploadButton />);

  await user.click(screen.getByRole('button'));

  expect(mockUpload).toHaveBeenCalled();
});
```

### 3. E2E 測試（End-to-End Tests）

測試**完整的使用者旅程**。

```typescript
// ✅ 好的 E2E 測試
test('使用者應該能上傳菜單並查看結果', async ({ page }) => {
  await page.goto('/');
  await page.click('text=上傳菜單');
  await page.setInputFiles('input[type="file"]', 'menu.jpg');
  await expect(page.locator('text=解析完成')).toBeVisible();
});
```

## 🚫 測試反模式

### ❌ 不要測試實作細節
```typescript
// ❌ 壞例子
expect(component.state.isOpen).toBe(true);

// ✅ 好例子
expect(screen.getByRole('dialog')).toBeVisible();
```

### ❌ 不要在單元測試中發送真實請求
```typescript
// ❌ 壞例子
it('應該從 API 取得資料', async () => {
  const data = await fetch('/api/menus'); // 真實請求
});

// ✅ 好例子
it('應該從 API 取得資料', async () => {
  vi.mock('/api/menus', { menus: [...] });
  const data = await getMenus();
});
```

## 🎯 測試優先級

1. **高優先級**（必須測試）
   - 商業邏輯（計算、驗證）
   - 資料轉換（API 回應處理）
   - 關鍵使用者流程（上傳、點餐）

2. **中優先級**（應該測試）
   - UI 元件互動
   - 狀態管理
   - 錯誤處理

3. **低優先級**（可選測試）
   - 樣式變化
   - 動畫效果

## 🔄 CI/CD 整合

專案已設定 GitHub Actions，每次 push 和 PR 都會自動執行：

1. TypeScript 型別檢查
2. 單元測試 + 覆蓋率報告
3. E2E 測試

## 📈 查看覆蓋率報告

執行測試後，可在以下位置查看報告：

```bash
# 終端機輸出
npm run test:coverage

# HTML 報告（在瀏覽器開啟）
open coverage/index.html
```

## 🐛 Debug 測試

### Vitest Debug
```bash
# 使用 UI 模式
npm run test:ui

# 或使用 --inspect
node --inspect-brk ./node_modules/vitest/vitest.mjs
```

### Playwright Debug
```bash
# 使用 UI 模式（推薦）
npm run test:e2e:ui

# 或使用 headed 模式
npx playwright test --headed --debug
```

## 📖 延伸閱讀

- [Vitest 文檔](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright 文檔](https://playwright.dev/)
- [Testing Best Practices](https://testingjavascript.com/)
