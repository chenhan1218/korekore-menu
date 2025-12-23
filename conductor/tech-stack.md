# Tech Stack - KoreKore

## 前端 (Frontend)
* **框架:** Next.js (React) - 支援 SSR/SSG，提升效能與使用者體驗。
* **開發語言:** TypeScript - 確保程式碼品質與型別安全。
* **樣式工具:** Tailwind CSS - 快速構建符合 Warm Muji-style 的響應式 UI。
* **狀態管理:** Zustand - 輕量化處理 Client-side 狀態。
* **API 請求:** Fetch API / Axios - 與後端及 Gemini API 進行通訊。

## 後端與雲端服務 (Backend & Cloud Services)
* **服務平台:** Firebase
    * **Authentication:** 處理使用者登入。
    * **Firestore (NoSQL):** 儲存使用者點餐紀錄與解析後的菜單數據。
    * **Cloud Storage:** 存放使用者拍攝的菜單圖片。
    * **Cloud Functions (Node.js):** 封裝敏感的 API Key，處理與 Gemini 1.5 Flash API 的通訊。
* **AI 模型:** Gemini 1.5 Flash API - 負責菜單圖片的 OCR 解析與翻譯。

## 部署與工具 (Deployment & Tools)
* **部署平台:** Vercel - 與 Next.js 深度整合，提供極速的部署與全球 CDN 加速。
* **版本控制:** Git (GitHub/GitLab)。
* **測試工具:** Vitest & React Testing Library - 確保核心邏輯與組件的正確性。

## 架構原則
* **Serverless 優先:** 盡可能利用 Firebase 與 Vercel 的 Serverless 特性，降低維運成本。
* **模組化設計:** UI 組件與業務邏輯分離，提高程式碼的可重用性。

---

## 版本與依賴注記 (2025-12-23)

### Firebase 集成計畫
* **當前狀態:** Firebase 依賴已安裝（v10.14.1）但代碼中未使用
* **構建配置:** vite.config.ts 中已移除 Firebase 的 optimizeDeps 配置，避免 CommonJS 兼容性問題
* **未來集成:** 當需要 Firebase 功能時，應使用**子模塊導入**方式（如 `firebase/auth`、`firebase/firestore`）而非直接導入 'firebase' 包

### 開發工具版本
* **Vite:** v5.0.0 - 快速開發和生產構建
* **TypeScript:** v5.3.3 - 嚴格型別檢查
* **ESLint & Prettier:** 確保代碼品質和一致性
* **Vitest:** v1.1.0 - 快速單元測試框架
* **Node.js 環境:** 構建使用 jsdom 進行 DOM 測試環境模擬
