# 修復 npm run build 錯誤 - 規格說明

**Track ID**: `fix_npm_build_20251223`
**Type**: Bug Fix
**Priority**: High
**Status**: New
**Created**: 2025-12-23

---

## 📋 概述

Vite 在執行 `npm run build` 時無法解析 Firebase package 的 exports 配置，導致生產環境構建失敗。

**當前錯誤**:
```
[commonjs--resolver] Failed to resolve entry for package "firebase".
The package may have incorrect main/module/exports specified in its package.json:
Missing "." specifier in "firebase" package
```

**根本原因**: Firebase v10.7.0 的 package.json exports 配置與 Vite 的 CommonJS resolver 不兼容。

---

## 🎯 功能需求

| # | 需求 | 優先級 | 備註 |
|---|------|--------|------|
| F1 | `npm run build` 命令執行成功 | P0 | 無錯誤輸出 |
| F2 | 生成有效的 `dist/` 資料夾 | P0 | 包含所有必要的檔案 |
| F3 | TypeScript 檢查通過 | P0 | `npm run type-check` |
| F4 | 單元測試全數通過 | P0 | `npm test` |
| F5 | ESLint 檢查通過 | P0 | `npm run lint` |

---

## ✅ 驗收標準

### 成功標準
- [x] `npm run build` 執行成功，終端無紅色錯誤訊息
- [x] `dist/` 資料夾正確生成且包含以下內容：
  - `index.html`
  - `assets/` 資料夾（包含 JS、CSS 檔案）
- [x] `npm run type-check` 執行通過（0 errors）
- [x] `npm test` 全數通過（所有測試 pass）
- [x] `npm run lint` 執行通過（0 errors）
- [x] Prettier 格式檢查通過

### 回歸測試
- [x] 執行整個測試套件，確保沒有新增的失敗
- [x] 手動確認應用功能（菜單掃描功能仍可正常使用）

---

## 📌 不在範圍內

- ❌ 更新 Firebase 主版本（需維持 v10.x 相容性）
- ❌ 修改應用代碼邏輯
- ❌ 優化構建性能（除非必要）
- ❌ 更新其他依賴版本（除非必要用於修復此問題）

---

## 🔍 背景資訊

### 相關檔案
- `vite.config.ts` - Vite 配置檔案
- `package.json` - 依賴定義
- `tsconfig.json` - TypeScript 配置
- `node_modules/firebase/package.json` - Firebase 的 exports 配置

### 環境信息
- **Node.js 版本**: (待確認)
- **Firebase 版本**: v10.7.0
- **Vite 版本**: v5.0.0
- **構建工具**: Rollup (Vite 使用)

### 已知的類似問題
- Firebase v9.x 與 Vite 有已知的兼容性問題
- 常見解決方案：
  1. 調整 Vite 配置的 CommonJS 優化
  2. 使用 `@rollup/plugin-commonjs` polyfill
  3. 更新 Firebase 至相容版本

---

## 📝 注意事項

- 此 bug 阻止生產環境部署，應優先處理
- 修復必須保證所有現有功能繼續正常運作
- 任何配置更改應在 `tech-stack.md` 中記錄

