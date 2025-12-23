# Bug 規格書：修復 npm run dev 錯誤

## 問題描述

執行 `npm run dev` 時失敗，錯誤信息：
```
Error: Failed to resolve entry for package "firebase". The package may have incorrect main/module/exports specified in its package.json: Missing "." specifier in "firebase" package
```

這是 Firebase 與 Vite 依賴優化機制的兼容性問題。

## 根本原因

- `vite.config.ts` 中的 `optimizeDeps.include` 包含了 `firebase`
- Firebase 模塊結構在 Vite 的預優化過程中無法正確解析

## 解決方案

調整 `vite.config.ts`：
- 從 `optimizeDeps.include` 中移除 `firebase`
- 配置 Firebase 相關包的優化選項

## 驗收條件

- [ ] `npm run dev` 命令成功啟動開發服務器
- [ ] 可在 `http://localhost:5173` 訪問應用
- [ ] 無 Firebase 相關的優化錯誤
- [ ] Vite HMR 正常工作

## 不在範圍內

- Firebase 功能驗證
- 其他依賴的優化問題
