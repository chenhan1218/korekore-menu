# API 整合與配置指南

## 目錄
- [Gemini API 整合](#gemini-api-整合)
- [Firebase 設置](#firebase-設置)
- [環境變數配置](#環境變數配置)
- [常見錯誤與除錯](#常見錯誤與除錯)

---

## Gemini API 整合

### API 基本信息

| 項目 | 值 |
|------|-----|
| **API 提供商** | Google Generative AI |
| **Model** | gemini-1.5-flash |
| **價格** | ~0.075 USD per 1M input tokens, ~0.3 USD per 1M output tokens |
| **速度** | 快速（適合實時解析） |
| **支援格式** | Text, Images (PNG, JPEG, WebP, HEIC) |

### 申請 API Key

1. 訪問 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 點擊「Create API Key」
3. 在下拉菜單選擇「Create new API Key」
4. 複製生成的 API Key
5. 設置環境變數 `VITE_GEMINI_API_KEY`

### 實現 Gemini Service

```typescript
// src/services/geminiService.ts
import { GoogleGenerativeAI } from '@google/generative-ai'
import { AppError, ErrorCode } from '../types/error'
import { MenuItem, ParsedMenuResponse } from '../types/api'

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
)

/**
 * 解析菜單圖片，返回結構化菜單數據
 *
 * @param imageBase64 - 圖片的 Base64 編碼
 * @param language - 目標語言 ('zh_TW' | 'en')
 * @returns 解析後的菜單數據
 *
 * @throws AppError - 當 API 調用失敗時
 */
export const parseMenuImage = async (
  imageBase64: string,
  language: 'zh_TW' | 'en' = 'zh_TW'
): Promise<ParsedMenuResponse> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = buildMenuParsingPrompt(language)

    const response = await model.generateContent([
      {
        inlineData: {
          mimeType: 'image/jpeg', // 或根據實際格式調整
          data: imageBase64,
        },
      },
      prompt,
    ])

    const responseText = response.response.text()

    // 嘗試從響應中提取 JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const parsedJson = JSON.parse(jsonMatch[0])

    // 驗證響應 Schema
    validateMenuResponse(parsedJson)

    return {
      items: parsedJson.items,
      metadata: {
        parsedAt: new Date().toISOString(),
        confidence: parsedJson.confidence || 0.95,
        language,
      },
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new AppError(
        ErrorCode.PARSE_ERROR,
        `Failed to parse Gemini response: ${error.message}`,
        'AI 響應解析失敗，請重試',
        true
      )
    }

    if (error instanceof Error && error.message.includes('API key')) {
      throw new AppError(
        ErrorCode.GEMINI_API_ERROR,
        'Invalid Gemini API Key',
        '配置錯誤，請檢查 API Key',
        false
      )
    }

    throw new AppError(
      ErrorCode.GEMINI_API_ERROR,
      `Gemini API error: ${error instanceof Error ? error.message : 'Unknown'}`,
      'AI 服務暫時不可用，請稍後重試',
      true
    )
  }
}

/**
 * 構建菜單解析的 Prompt
 */
function buildMenuParsingPrompt(language: 'zh_TW' | 'en'): string {
  if (language === 'zh_TW') {
    return `
請分析這張菜單圖片，並用以下 JSON 格式返回菜單數據：

{
  "items": [
    {
      "id": "unique_id",
      "name": "原文菜名 (例如: 天婦羅)",
      "name_zh_TW": "繁體中文翻譯及簡單口感描述 (例如: 天婦羅 - 炸蝦及季節蔬菜)",
      "price": "價格 (保留原文格式，例如: ¥1500)"
    },
    ...
  ],
  "confidence": 0.95
}

要求：
1. 每個菜單項目必須包含：id, name, name_zh_TW, price
2. name 應保持原文菜名，不翻譯
3. name_zh_TW 應包含翻譯 + 簡單口感描述
4. 如圖片不清楚或無法解析，請在回應中明確說明
5. 如無法確定價格，使用 "未標示"
6. 返回所有找到的菜單項目，即使不完整也要包含
`
  }

  return `
Please analyze this menu image and return the menu data in the following JSON format:

{
  "items": [
    {
      "id": "unique_id",
      "name": "Original menu name (e.g., 天婦羅)",
      "name_zh_TW": "Traditional Chinese translation with brief description",
      "price": "Price in original format (e.g., ¥1500)"
    },
    ...
  ],
  "confidence": 0.95
}

Requirements:
1. Each menu item must include: id, name, name_zh_TW, price
2. name should keep the original, untranslated
3. name_zh_TW should include translation + brief taste description
4. If image is unclear, clearly state this in the response
5. If price cannot be determined, use "Not specified"
6. Return all found menu items, even if incomplete
`
}

/**
 * 驗證 Gemini 響應的 Schema
 */
function validateMenuResponse(data: any): asserts data is ParsedMenuResponse {
  if (!data.items || !Array.isArray(data.items)) {
    throw new Error('Response missing items array')
  }

  data.items.forEach((item: any, index: number) => {
    if (!item.id || !item.name || !item.name_zh_TW || item.price === undefined) {
      throw new Error(
        `Invalid item at index ${index}: missing required fields`
      )
    }
  })
}
```

### 使用示例

```typescript
// src/features/ai-processing/hooks/useGeminiParsing.ts
import { useState } from 'react'
import { parseMenuImage } from '../../../services/geminiService'
import { AppError } from '../../../types/error'

export const useGeminiParsing = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AppError | null>(null)

  const parse = async (imageBase64: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await parseMenuImage(imageBase64)
      return result
    } catch (err) {
      const appError = err instanceof AppError ? err : new AppError(
        'UNKNOWN_ERROR',
        String(err),
        '發生未知錯誤，請重試'
      )
      setError(appError)
      throw appError
    } finally {
      setLoading(false)
    }
  }

  return { parse, loading, error }
}
```

---

## Firebase 設置

### 前置條件

1. 擁有 Google 帳號
2. 訪問 [Firebase Console](https://console.firebase.google.com)

### 建立 Firebase 項目

1. 點擊「Create Project」
2. 輸入項目名稱（例如：korekore-menu）
3. 選擇 Google Analytics（可選）
4. 點擊「Create」

### 啟用 Firestore

1. 在 Firebase Console 左側菜單選擇「Firestore Database」
2. 點擊「Create Database」
3. 選擇「Start in test mode」（開發階段）
4. 選擇區域（建議選擇離用戶最近的地區）
5. 點擊「Enable」

### 啟用 Cloud Storage

1. 在左側菜單選擇「Storage」
2. 點擊「Get Started」
3. 選擇區域
4. 點擊「Done」

### 設置 Firebase Authentication

1. 在左側菜單選擇「Authentication」
2. 點擊「Get Started」
3. 啟用以下登入方式：
   - ✅ **Anonymous** - 無須登入，使用裝置識別
   - ✅ **Email/Password** - 用戶登入

### Firestore 安全規則

```javascript
// Firestore Rules - test mode 模板
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 用戶數據 - 只有自己可訪問
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth.uid == userId;
    }

    // 公開數據（如需要）
    match /public/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Cloud Storage 安全規則

```javascript
// Storage Rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 用戶菜單圖片 - 只有上傳者可訪問
    match /users/{userId}/menus/{allPaths=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

### Firebase Service 實現

```typescript
// src/services/firebaseService.ts
import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore'
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage'
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { AppError, ErrorCode } from '../types/error'
import { MenuData, MenuItem } from '../types/api'

// Firebase 配置
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// 初始化 Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)
const auth = getAuth(app)

/**
 * 初始化匿名認證
 */
export const initializeAuth = async (): Promise<string> => {
  try {
    const userCred = await signInAnonymously(auth)
    return userCred.user.uid
  } catch (error) {
    throw new AppError(
      ErrorCode.FIREBASE_ERROR,
      `Failed to initialize auth: ${error}`,
      '無法初始化認證，請重試',
      true
    )
  }
}

/**
 * 監聽認證狀態
 */
export const onAuthChange = (callback: (uid: string | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user?.uid ?? null)
  })
}

/**
 * 保存菜單到 Firestore + Cloud Storage
 */
export const saveMenu = async (
  userId: string,
  menuData: {
    imageBlobUrl: string // 本地 blob URL
    items: MenuItem[]
    originalLanguage: string
    notes?: string
  }
): Promise<string> => {
  try {
    // 1. 將圖片上傳至 Cloud Storage
    const imageFile = await fetch(menuData.imageBlobUrl).then((r) =>
      r.blob()
    )
    const timestamp = Date.now()
    const imageRef = ref(
      storage,
      `users/${userId}/menus/${timestamp}_menu.jpg`
    )
    const uploadResult = await uploadBytes(imageRef, imageFile)
    const imageUrl = await getDownloadURL(uploadResult.ref)

    // 2. 保存菜單元數據到 Firestore
    const menuDocRef = collection(db, 'users', userId, 'menus')
    const docRef = await addDoc(menuDocRef, {
      imageUrl,
      items: menuData.items,
      originalLanguage: menuData.originalLanguage,
      uploadedAt: Timestamp.now(),
      notes: menuData.notes || '',
      confidence: menuData.items.length > 0 ? 0.95 : 0,
    })

    return docRef.id
  } catch (error) {
    throw new AppError(
      ErrorCode.FIREBASE_ERROR,
      `Failed to save menu: ${error}`,
      '無法保存菜單，請檢查網路連線',
      true
    )
  }
}

/**
 * 獲取用戶的菜單歷史
 */
export const getUserMenus = async (userId: string): Promise<MenuData[]> => {
  try {
    const menusRef = collection(db, 'users', userId, 'menus')
    const q = query(menusRef)
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      uploadedAt: doc.data().uploadedAt?.toDate?.() || new Date(),
    })) as MenuData[]
  } catch (error) {
    throw new AppError(
      ErrorCode.FIREBASE_ERROR,
      `Failed to fetch menus: ${error}`,
      '無法獲取菜單歷史',
      false
    )
  }
}
```

---

## 環境變數配置

### .env.example 模板

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GEMINI_MODEL=gemini-1.5-flash

# App Configuration
VITE_APP_NAME=KoreKore
VITE_APP_ENV=development
```

### 本地設置步驟

```bash
# 1. 複製示例文件
cp .env.example .env.local

# 2. 編輯 .env.local，填入你的 API Key 與 Firebase 配置
# 從 Firebase Console 複製：
#   - Project Settings → General → 複製配置
#   - 粘貼到對應的 VITE_FIREBASE_* 變數

# 3. 從 Google AI Studio 複製 Gemini API Key
#   - 粘貼到 VITE_GEMINI_API_KEY

# 4. 確認 .env.local 已加入 .gitignore（應已默認）
```

### 環境變數在代碼中的使用

```typescript
// src/config/environment.ts
export const env = {
  firebaseApiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  firebaseProjectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY,
  geminiModel: import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const

// 驗證必需的環境變數
if (!env.firebaseProjectId || !env.geminiApiKey) {
  throw new Error('Missing required environment variables')
}
```

---

## 常見錯誤與除錯

### Gemini API Errors

| 錯誤 | 原因 | 解決方案 |
|------|------|---------|
| `PERMISSION_DENIED` | API Key 無效或未啟用 | 檢查 API Key，確保已啟用 Generative AI API |
| `INVALID_ARGUMENT` | 圖片格式不支援 | 確保圖片為 JPG, PNG, WebP, HEIC |
| `RESOURCE_EXHAUSTED` | 超過 API 配額 | 檢查使用量，可能需要升級方案 |

### Firebase Errors

| 錯誤 | 原因 | 解決方案 |
|------|------|---------|
| `PERMISSION_DENIED` | Firestore 規則阻止訪問 | 檢查 Firestore 安全規則 |
| `UNAUTHENTICATED` | 用戶未認證 | 呼叫 `initializeAuth()` |
| `QUOTA_EXCEEDED` | 超過 Firebase 免費方案配額 | 升級到付費方案 |

### 本地除錯

```typescript
// src/utils/debugLog.ts
export const debugLog = (tag: string, data: any) => {
  if (import.meta.env.DEV) {
    console.log(`[${tag}]`, data)
  }
}

// 在 service 中使用
import { debugLog } from '../utils/debugLog'

export const parseMenuImage = async (imageBase64: string) => {
  debugLog('parseMenuImage', { imageSize: imageBase64.length })
  // ...
}
```

---

**最後更新：2025-12-17**
