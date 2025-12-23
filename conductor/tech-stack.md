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
