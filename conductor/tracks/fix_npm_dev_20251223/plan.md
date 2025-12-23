# 實施計畫：修復 npm run dev 錯誤

## Phase 1: 修復 Vite 配置

- [ ] Task: 調整 vite.config.ts
  - [ ] 修改 optimizeDeps 配置，移除 firebase 或適當配置
  - [ ] 驗證改動不會影響其他依賴優化
  - [ ] 提交代碼變更
- [ ] Task: Conductor - Phase Verification

## Phase 2: 驗證修復

- [ ] Task: 測試 npm run dev
  - [ ] 執行 `npm run dev` 命令
  - [ ] 確認開發服務器成功啟動
  - [ ] 訪問 http://localhost:5173 驗證應用可訪問
  - [ ] 檢查瀏覽器開發工具無錯誤
  - [ ] 提交驗證報告

