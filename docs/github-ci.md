# GitHub Actions CI/CD 背景知識

**日期**: 2025-12-23
**用途**: 為建立 GitHub Actions 工作流程提供背景知識和項目特定的需求

---

## 📚 目錄

1. [CI/CD 基本概念](#cicd-基本概念)
2. [GitHub Actions 概述](#github-actions-概述)
3. [KoreKore 項目的 CI 需求](#korekore-項目的-ci-需求)
4. [工作流程觸發條件](#工作流程觸發條件)
5. [環境變數與 Secrets](#環境變數與-secrets)
6. [代碼品質檢查清單](#代碼品質檢查清單)
7. [最佳實踐](#最佳實踐)
8. [故障排除](#故障排除)

---

## CI/CD 基本概念

### 什麼是 CI/CD？

**CI (Continuous Integration - 持續集成)**
- 開發者頻繁提交代碼到共享倉庫（通常是主分支）
- 自動化系統在每次提交時執行測試和檢查
- 目的：及早發現集成問題，提高代碼品質

**CD (Continuous Deployment/Delivery - 持續部署/交付)**
- Continuous Delivery: 自動準備代碼供生產部署，但人工手動觸發部署
- Continuous Deployment: 自動部署到生產環境（無需人工介入）

### KoreKore 的 CI/CD 策略

```
┌─────────────────────────────────────────────────────────┐
│  Developer Push Code to GitHub                          │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  CI Trigger: Tests → Lint → Type Check → Build         │
│  GitHub Actions 自動執行檢查                             │
└────────────────┬────────────────────────────────────────┘
                 │
         ┌───────┴────────┐
         │                │
    成功 ▼            失敗 ▼
  ┌──────────────┐  ┌──────────────┐
  │ 標記為通過    │  │ 標記為失敗    │
  │ 允許合併 PR  │  │ 阻止合併 PR  │
  │              │  │ 通知開發者    │
  └──────────────┘  └──────────────┘
         │
         ▼
  ┌──────────────┐
  │ Vercel 部署  │
  │ (Pre/Prod)  │
  └──────────────┘
```

---

## GitHub Actions 概述

### GitHub Actions 是什麼？

GitHub Actions 是 GitHub 內建的自動化平台，允許您在指定的事件（如 push、pull request）時執行自定義的工作流程。

### 核心概念

| 概念 | 說明 | 例子 |
|------|------|------|
| **Workflow** | 完整的自動化流程配置 | `.github/workflows/ci.yml` |
| **Trigger** | 觸發工作流程的事件 | `push`, `pull_request` |
| **Job** | 工作流程中的一個工作單位 | `test`, `lint`, `build` |
| **Step** | Job 內的單個任務 | `npm test`, `npm run lint` |
| **Action** | 可重用的工作單位 | `actions/checkout@v4` |
| **Runner** | 執行工作流程的虛擬機 | `ubuntu-latest`, `windows-latest` |

### 簡單的工作流程結構

```yaml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## KoreKore 項目的 CI 需求

### 專案概況

| 項目 | 內容 |
|------|------|
| **框架** | React 18 + Vite |
| **語言** | TypeScript 5.3 |
| **測試** | Vitest + React Testing Library |
| **代碼品質** | ESLint + Prettier + TypeScript |
| **構建** | Vite (構建時間: <10 秒) |
| **Node.js 版本** | 18+ 或 20+ |

### 必需的檢查清單

#### 1. 代碼品質檢查 (Quality Checks)

| 檢查 | 命令 | 目的 | 失敗影響 |
|------|------|------|---------|
| **TypeScript** | `npm run type-check` | 確保型別安全 | 代碼在執行時崩潰 |
| **ESLint** | `npm run lint` | 檢查代碼風格、潛在 bugs | 不一致的代碼風格、邏輯錯誤 |
| **Prettier** | `npm run format --check` | 檢查代碼格式 | 合併時的衝突 |

#### 2. 單元測試與集成測試

| 檢查 | 命令 | 目的 | 失敗影響 |
|------|------|------|---------|
| **Unit Tests** | `npm test` | 測試各個功能單元 | 功能 bug |
| **Coverage Report** | `npm run test:coverage` | 檢查測試覆蓋率 | 隱藏的邏輯 bug |
| **目標覆蓋率** | >80% | 確保主要代碼有測試 | 回歸風險 |

#### 3. 構建驗證

| 檢查 | 命令 | 目的 | 失敗影響 |
|------|------|------|---------|
| **構建** | `npm run build` | 驗證生產環境構建 | 無法部署到生產環境 |
| **輸出檢查** | 確認 `dist/` 生成 | 驗證構建工件完整 | 部署包遺失或損壞 |

### 檢查執行順序

建議按照以下順序執行檢查（從快速到耗時）：

```
1. Prettier 格式檢查 (最快, <1秒)
   ↓
2. ESLint 代碼檢查 (~5秒)
   ↓
3. TypeScript 型別檢查 (~10秒)
   ↓
4. Unit Tests (Vitest) (~15秒，可並行)
   ↓
5. Build 構建驗證 (~10秒)
```

**總預期時間**: 35-45 秒 per push

---

## 工作流程觸發條件

### 何時運行 CI？

#### 強制執行的觸發條件

```yaml
on:
  push:
    branches:
      - main              # 任何 push 到 main 分支時運行
      - develop           # 任何 push 到 develop 分支時運行

  pull_request:
    branches:
      - main              # 任何對 main 的 PR 時運行
      - develop           # 任何對 develop 的 PR 時運行
```

#### 可選的觸發條件

```yaml
on:
  # 在指定路徑更改時運行（避免不必要的運行）
  push:
    paths:
      - 'src/**'
      - 'package.json'
      - '.github/workflows/**'
      - '!docs/**'           # 不執行（除非有其他改動）

  # 手動觸發（用於重新運行或測試）
  workflow_dispatch

  # 定時執行（如每日檢查依賴安全性）
  schedule:
    - cron: '0 2 * * *'    # 每天早上 2 點執行
```

### 哪些代碼需要 CI 檢查？

✅ **需要檢查**：
- `src/**` - 應用源代碼
- `__tests__/**` - 測試代碼
- `package.json` - 依賴定義（版本變化）
- `.github/workflows/**` - 工作流程本身
- `tsconfig.json` - TypeScript 配置

❌ **不需要檢查**（可排除）：
- `docs/**` - 文檔只有文字更改
- `README.md` - 只有說明文字
- `.gitignore` - 配置文件不影響代碼
- `LICENSE` - 許可證文件

---

## 環境變數與 Secrets

### GitHub 中的 Secret 管理

CI 工作流程可能需要存取敏感信息（如 API keys）。GitHub 提供 Secrets 功能安全地存儲這些信息。

**設置步驟**：
1. 進入 Repository Settings → Secrets and variables → Actions
2. 點擊 "New repository secret"
3. 輸入 Name 和 Value
4. 在工作流程中使用: `${{ secrets.SECRET_NAME }}`

### KoreKore 所需的 Secrets

| Secret Name | 用途 | 何時需要 |
|-------------|------|--------|
| `CODECOV_TOKEN` | 上傳 coverage 到 Codecov | 生成覆蓋率報告時 |
| `VERCEL_TOKEN` | Vercel 部署授權 | 自動部署到 Vercel |
| `VERCEL_PROJECT_ID` | Vercel 項目 ID | 指定部署目標 |
| `VERCEL_ORG_ID` | Vercel 組織 ID | 指定 Vercel 組織 |

### 不同環境的環境變數

```bash
# .env.example (提交到 Git)
VITE_API_BASE_URL=https://api.example.com
VITE_APP_NAME=KoreKore

# GitHub Secrets (不提交到 Git)
FIREBASE_API_KEY=xxx...
GEMINI_API_KEY=xxx...

# CI 工作流程中使用
env:
  CI: true        # 告訴測試工具在 CI 環境運行
  NODE_ENV: test  # 設定為測試環境
```

---

## 代碼品質檢查清單

### 1. TypeScript 型別檢查

**目的**: 確保沒有型別錯誤

```bash
npm run type-check
```

**預期結果**:
```
✓ 0 errors
✓ TypeScript 編譯通過
```

**常見失敗原因**:
- 未導入的類型
- 類型不匹配
- Any 類型濫用

### 2. ESLint 代碼檢查

**目的**: 檢查代碼風格、邏輯錯誤、潛在 bugs

```bash
npm run lint
```

**預期結果**:
```
✓ 0 errors
✓ 0 warnings (目標)
```

**常見失敗原因**:
- 未使用的變數
- 缺失的 null check
- 不一致的縮進

**修復方式**:
```bash
npm run lint:fix  # 自動修復大多數問題
```

### 3. Prettier 格式檢查

**目的**: 確保代碼格式一致

```bash
npm run format --check
```

**修復方式**:
```bash
npm run format  # 自動格式化所有文件
```

### 4. 單元測試

**目的**: 驗證代碼功能正確性

```bash
npm test              # 執行所有測試
npm run test:coverage # 生成覆蓋率報告
```

**預期結果**:
```
✓ All tests passed
✓ Coverage >80%
```

**常見失敗原因**:
- 新增功能但未寫測試
- 既有測試過時
- Mock 數據不準確

### 5. 構建驗證

**目的**: 驗證生產環境構建成功

```bash
npm run build
```

**驗證步驟**:
1. ✅ 執行成功（無紅色錯誤）
2. ✅ 生成 `dist/` 資料夾
3. ✅ 包含 `index.html` 和 `assets/` 目錄
4. ✅ 所有資源文件正確打包

---

## 最佳實踐

### 1. 快速失敗原則 (Fail Fast)

在工作流程中，快速檢查應該首先執行，以便開發者快速獲得反饋：

```yaml
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      # 最快的檢查優先
      - name: Format check (Prettier)
        run: npm run format --check

      - name: Lint (ESLint)
        run: npm run lint

      - name: Type check (TypeScript)
        run: npm run type-check

      - name: Tests (Vitest)
        run: npm test

      - name: Build
        run: npm run build
```

### 2. 使用 Matrix 策略進行跨版本測試

```yaml
strategy:
  matrix:
    node-version: [18, 20]
    os: [ubuntu-latest, macos-latest]

steps:
  - uses: actions/setup-node@v4
    with:
      node-version: ${{ matrix.node-version }}
```

### 3. 緩存依賴以加快執行速度

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'  # 自動緩存 node_modules
```

**效果**: 依賴安裝時間從 30 秒減少到 5 秒

### 4. 上傳測試覆蓋率報告

```yaml
- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/coverage-final.json
    flags: unittests
```

### 5. 通知開發者失敗

```yaml
- name: Comment on PR (if failed)
  if: failure()
  uses: actions/github-script@v7
  with:
    script: |
      github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: '❌ CI 檢查失敗，請修復上述錯誤後重新推送'
      })
```

### 6. 分離 Job 以支持並行執行

```yaml
jobs:
  format:
    runs-on: ubuntu-latest
    steps:
      - run: npm run format --check

  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
```

**效果**: 所有 jobs 並行運行，總時間為最長 job 的時間

---

## 故障排除

### 常見問題與解決方案

#### 問題 1: "Cannot find module" 錯誤

**症狀**: CI 中失敗，但本地成功

**原因**: `node_modules` 未正確安裝

**解決**:
```yaml
- run: npm ci  # 使用 ci 而不是 install
```

#### 問題 2: 測試超時

**症狀**: Vitest 測試在 CI 中超時

**原因**: CI 環境資源受限

**解決**:
```bash
# 在 vitest.config.ts 中設定
testTimeout: 10000  # 增加超時時間為 10 秒
```

#### 問題 3: Firebase 初始化失敗

**症狀**: Firebase API 調用在 CI 中失敗

**原因**: 缺失環境變數

**解決**:
```yaml
env:
  VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
  VITE_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
```

#### 問題 4: Prettier 格式不一致

**症狀**: CI 中格式檢查失敗

**原因**: 本地 Prettier 版本與 CI 不同，或配置不一致

**解決**:
```bash
# 在 CI 前確保格式化
npm run format

# 提交變更
git add .
git commit -m "style: format code"
git push
```

#### 問題 5: 構建失敗 (Firebase CommonJS 問題)

**症狀**: `npm run build` 失敗，Firebase 解析錯誤

**原因**: Vite 與 Firebase 兼容性問題（這正是我們正在修復的）

**解決**: 參考 `fix_npm_build_20251223` track

---

## 總結檢查清單

在建立 GitHub Actions 工作流程時，確保包括：

### 必需項目
- [ ] ✅ 檢查 Node.js 版本配置 (18 or 20+)
- [ ] ✅ 設置 npm ci 安裝依賴（而不是 npm install）
- [ ] ✅ 執行 Prettier 格式檢查
- [ ] ✅ 執行 ESLint 代碼檢查
- [ ] ✅ 執行 TypeScript 型別檢查
- [ ] ✅ 執行 Vitest 單元測試
- [ ] ✅ 執行 npm run build 構建驗證
- [ ] ✅ 在 main 和 develop 分支上觸發

### 可選但推薦
- [ ] ⭐ 上傳測試覆蓋率報告到 Codecov
- [ ] ⭐ 在 PR 失敗時自動評論
- [ ] ⭐ 使用 Matrix 策略進行多版本測試
- [ ] ⭐ 緩存 node_modules 加快執行
- [ ] ⭐ 分離 jobs 支持並行執行

### 配置與安全
- [ ] 🔐 在 GitHub Secrets 中存儲敏感信息
- [ ] 🔐 不提交 .env 到 Git
- [ ] 🔐 使用 `secrets.` 在工作流程中引用 Secrets
- [ ] 🔐 限制工作流程的權限

---

## 相關資源

### 內部文檔
- [技術棧 (tech-stack.md)](./tech-stack.md) - 項目使用的工具和框架
- [工作流程 (workflow.md)](../conductor/workflow.md) - Conductor 工作流程
- [代碼標準 (code-standards.md)](./code-standards.md) - 代碼風格要求

### 外部資源
- [GitHub Actions 官方文檔](https://docs.github.com/en/actions)
- [Vitest 文檔](https://vitest.dev/)
- [React Testing Library 文檔](https://testing-library.com/docs/react-testing-library/intro/)
- [Vite 構建指南](https://vitejs.dev/guide/build.html)

### 工具文檔
- [ESLint](https://eslint.org/docs/)
- [Prettier](https://prettier.io/docs/)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

**最後更新**: 2025-12-23
**維護者**: KoreKore 開發團隊

