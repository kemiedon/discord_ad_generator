# Discord 廣告生成器 - 100% 復刻指南

本文件提供完整的步驟，讓您能夠 100% 復刻此專案。

---

## 目錄

1. [專案結構](#專案結構)
2. [環境準備](#環境準備)
3. [專案初始化](#專案初始化)
4. [依賴安裝](#依賴安裝)
5. [核心文件創建](#核心文件創建)
6. [組件實作](#組件實作)
7. [服務實作](#服務實作)
8. [樣式實作](#樣式實作)
9. [環境變數配置](#環境變數配置)
10. [測試與運行](#測試與運行)
11. [部署](#部署)

---

## 專案結構

```
discord_ad_generator/
├── public/                      # 靜態資源
├── src/
│   ├── components/              # React 組件
│   │   ├── common/              # 通用組件
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Button.scss
│   │   │   │   └── index.js
│   │   │   ├── Card/
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Card.scss
│   │   │   │   └── index.js
│   │   │   ├── FileUpload/
│   │   │   │   ├── FileUpload.jsx
│   │   │   │   ├── FileUpload.scss
│   │   │   │   └── index.js
│   │   │   ├── Input/
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Input.scss
│   │   │   │   └── index.js
│   │   │   ├── Loading/
│   │   │   │   ├── Loading.jsx
│   │   │   │   ├── Loading.scss
│   │   │   │   └── index.js
│   │   │   ├── Modal/
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Modal.scss
│   │   │   │   └── index.js
│   │   │   ├── Select/
│   │   │   │   ├── Select.jsx
│   │   │   │   ├── Select.scss
│   │   │   │   └── index.js
│   │   │   └── TextArea/
│   │   │       ├── TextArea.jsx
│   │   │       ├── TextArea.scss
│   │   │       └── index.js
│   │   ├── HomePage/
│   │   │   ├── HomePage.jsx
│   │   │   ├── HomePage.scss
│   │   │   └── index.js
│   │   ├── InputForm/
│   │   │   ├── InputForm.jsx
│   │   │   ├── InputForm.scss
│   │   │   └── index.js
│   │   ├── PreviewGrid/
│   │   │   ├── PreviewGrid.jsx
│   │   │   ├── PreviewGrid.scss
│   │   │   └── index.js
│   │   └── PublishPreview/
│   │       ├── PublishPreview.jsx
│   │       ├── PublishPreview.scss
│   │       └── index.js
│   ├── config/
│   │   └── firebase.js           # Firebase 配置
│   ├── services/
│   │   ├── discordService.js     # Discord Webhook 服務
│   │   ├── firebaseStorage.js    # Firebase Storage 服務
│   │   └── nanoBananaService.js  # Gemini API 服務
│   ├── styles/
│   │   ├── _mixins.scss          # SASS mixins
│   │   ├── _variables.scss       # SASS 變數
│   │   └── global.scss           # 全域樣式
│   ├── utils/
│   │   └── promptBuilder.js      # Prompt 構建工具
│   ├── App.jsx                   # 主應用組件
│   ├── App.scss                  # 主應用樣式
│   └── main.jsx                  # 應用入口
├── SPEC/                         # 專案規格文件
│   ├── MAIN.md
│   ├── REPLICATION_GUIDE.md      # 本文件
│   └── TESTING_DISCORD.md
├── .env                          # 環境變數（不提交到 Git）
├── .env.example                  # 環境變數範例
├── .gitignore                    # Git 忽略文件
├── index.html                    # HTML 入口
├── package.json                  # 專案配置
├── README.md                     # 專案說明
└── vite.config.js                # Vite 配置
```

---

## 環境準備

### 必要工具

1. **Node.js** (v18 或更高)
   ```bash
   node --version  # 確認版本
   ```

2. **npm** 或 **yarn**
   ```bash
   npm --version
   ```

3. **Git**
   ```bash
   git --version
   ```

4. **程式碼編輯器**（推薦 VS Code）

### 必要帳號

1. **Google AI Studio**
   - 前往：https://aistudio.google.com/
   - 建立專案並取得 API Key

2. **Firebase**
   - 前往：https://console.firebase.google.com/
   - 建立新專案
   - 啟用 Storage 和 Firestore

3. **Discord**
   - 準備一個 Discord 伺服器
   - 建立 Webhook（參考 TESTING_DISCORD.md）

---

## 專案初始化

### 步驟 1：建立 Vite + React 專案

```bash
# 建立專案
npm create vite@latest discord_ad_generator -- --template react

# 進入專案目錄
cd discord_ad_generator
```

### 步驟 2：初始化 Git

```bash
git init
git add .
git commit -m "Initial commit"
```

---

## 依賴安裝

### 步驟 1：安裝主要依賴

```bash
npm install
```

### 步驟 2：安裝額外依賴

```bash
# HTTP 客戶端
npm install axios

# Firebase
npm install firebase

# 樣式
npm install sass

# UI 增強
npm install react-hot-toast

# jQuery（僅用於 Datepicker）
npm install jquery jquery-ui
```

### 步驟 3：確認 package.json

```json
{
  "name": "discord_ad_generator",
  "private": true,
  "version": "3.5.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.7.9",
    "firebase": "^11.0.2",
    "jquery": "^3.7.1",
    "jquery-ui": "^1.14.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hot-toast": "^2.6.0",
    "sass": "^1.83.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.17.0",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.17.0",
    "eslint-plugin-react": "^7.37.2",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.16",
    "globals": "^15.13.0",
    "vite": "^6.0.5"
  }
}
```

---

## 核心文件創建

### 1. Vite 配置 (vite.config.js)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
})
```

### 2. HTML 入口 (index.html)

```html
<!doctype html>
<html lang="zh-TW">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Discord 廣告生成器</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 3. 應用入口 (src/main.jsx)

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### 4. 主應用組件 (src/App.jsx)

```javascript
import { Toaster } from 'react-hot-toast'
import HomePage from './components/HomePage'
import './App.scss'

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Discord 廣告生成器</h1>
        <p className="app__subtitle">Skill Hub - 學習殿堂</p>
      </header>
      <main className="app__main">
        <HomePage />
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e1e2e',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  )
}

export default App
```

### 5. Git 忽略文件 (.gitignore)

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.*.local

# Test files
test-*.js
test-*.mjs
*.png
*.jpg
*.jpeg
generated-*.jpg
discord-ad-*.png
```

---

## 組件實作

由於組件較多，這裡提供關鍵組件的實作要點。完整程式碼請參考專案原始碼。

### 關鍵點 1：HomePage 組件

**功能**：
- 管理圖片生成和發布流程
- 整合 InputForm、PreviewGrid、PublishPreview

**關鍵狀態**：
```javascript
const [generatedImages, setGeneratedImages] = useState([])
const [isGenerating, setIsGenerating] = useState(false)
const [isPublishing, setIsPublishing] = useState(false)
const [currentFormData, setCurrentFormData] = useState(null)
const [showPreview, setShowPreview] = useState(false)
const [previewImages, setPreviewImages] = useState([])
const previewGridRef = useRef(null)
```

**關鍵函數**：
- `handleGenerate()` - 處理圖片生成
- `handlePublish()` - 打開預覽 Modal
- `handleConfirmPublish()` - 確認發布到 Discord

### 關鍵點 2：InputForm 組件

**功能**：
- 收集使用者輸入（主題、日期、重點、風格、參考圖片）
- 表單驗證
- 整合 jQuery UI Datepicker

**jQuery UI Datepicker 整合**：
```javascript
import { useEffect, useRef } from 'react'
import $ from 'jquery'
import 'jquery-ui/ui/widgets/datepicker'
import 'jquery-ui/themes/base/datepicker.css'

useEffect(() => {
  if (dateInputRef.current) {
    $(dateInputRef.current).datepicker({
      dateFormat: 'yy-mm-dd',
      onSelect: (dateText) => {
        handleChange('date', dateText)
      }
    })
  }

  return () => {
    if (dateInputRef.current) {
      $(dateInputRef.current).datepicker('destroy')
    }
  }
}, [])
```

**環境變數自動載入**：
```javascript
const [formData, setFormData] = useState({
  topic: '',
  date: '',
  points: '',
  style: '',
  referenceImage: null,
  webhookUrl: import.meta.env.VITE_DISCORD_WEBHOOK_URL || ''
})
```

### 關鍵點 3：PreviewGrid 組件

**功能**：
- 顯示生成的圖片
- 支援多選
- 提供下載和發布按鈕

**使用 forwardRef 暴露方法**：
```javascript
import { forwardRef, useImperativeHandle } from 'react'

const PreviewGrid = forwardRef(({ images, onPublish, isPublishing }, ref) => {
  const [selectedImages, setSelectedImages] = useState([])

  useImperativeHandle(ref, () => ({
    clearSelection: () => {
      setSelectedImages([])
    }
  }))

  // ... 組件邏輯
})

PreviewGrid.displayName = 'PreviewGrid'
export default PreviewGrid
```

### 關鍵點 4：PublishPreview 組件

**功能**：
- 顯示要發布的圖片預覽
- 允許編輯訊息內容
- 確認後發布

**關鍵邏輯**：
```javascript
const [message, setMessage] = useState(() => {
  return buildInitialMessage(formData)
})

const buildInitialMessage = (formData) => {
  const { topic, date, points } = formData
  let message = `@everyone\n\n【活動通知】${topic}\n📅 ${date} 晚上9:00-10:00\n`
  
  if (points && Array.isArray(points) && points.length > 0) {
    message += `\n✨ 本次重點項目：\n`
    points.forEach((point, index) => {
      message += `${index + 1}. ${point}\n`
    })
  }
  
  message += `\n💬 歡迎大家一起來討論、交流經驗，一起進步！`
  return message
}
```

### 關鍵點 5：Modal 組件

**功能**：
- 通用彈窗組件
- 支援不同尺寸
- 點擊背景關閉
- 鎖定 body 滾動

**關鍵實作**：
```javascript
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'unset'
  }
  return () => {
    document.body.style.overflow = 'unset'
  }
}, [isOpen])

const handleBackdropClick = (e) => {
  if (e.target === e.currentTarget) {
    onClose()
  }
}
```

---

## 服務實作

### 1. Gemini API 服務 (src/services/nanoBananaService.js)

**核心功能**：
- 使用 axios 直接調用 Gemini REST API
- 支援 text-to-image 和 image-to-image
- 瀏覽器原生 base64 轉換

**關鍵程式碼**：

```javascript
import axios from 'axios'

const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent'

export const generateImages = async (prompt, referenceImageUrl = null) => {
  const apiKey = import.meta.env.VITE_NANO_BANANA_API_KEY

  // 構建請求內容
  const parts = [{ text: prompt }]

  // 如果有參考圖片，加入 image-to-image
  if (referenceImageUrl) {
    const imageData = await loadImageAsBase64(referenceImageUrl)
    parts.push({
      inline_data: {
        mime_type: 'image/jpeg',
        data: imageData
      }
    })
  }

  const requestBody = {
    contents: [{
      parts: parts
    }],
    generationConfig: {
      temperature: 1,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
      responseMimeType: 'text/plain'
    }
  }

  // 發送請求（生成 4 張圖片）
  const numberOfImages = 4
  const promises = Array(numberOfImages).fill(null).map(() =>
    axios.post(`${API_ENDPOINT}?key=${apiKey}`, requestBody)
  )

  const responses = await Promise.all(promises)
  return responses.map(response => extractImageFromResponse(response.data))
}

// 瀏覽器原生 base64 轉換
const loadImageAsBase64 = async (imageUrl) => {
  const response = await fetch(imageUrl)
  const blob = await response.blob()
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1]
      resolve(base64String)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// 從 Gemini 回應中提取圖片
const extractImageFromResponse = (responseData) => {
  const text = responseData.candidates[0].content.parts[0].text
  const base64Match = text.match(/data:image\/(png|jpeg|jpg);base64,([A-Za-z0-9+/=]+)/)
  
  if (base64Match) {
    return `data:image/${base64Match[1]};base64,${base64Match[2]}`
  }
  
  throw new Error('無法從回應中提取圖片')
}
```

### 2. Discord 服務 (src/services/discordService.js)

**核心功能**：
- 使用 Webhook 發布圖片和訊息
- 格式化訊息內容
- URL 驗證

**關鍵程式碼**：

```javascript
import axios from 'axios'

// base64 Data URL 轉 Blob
const dataUrlToBlob = (dataUrl) => {
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

// 構建 Discord 訊息
const buildDiscordMessage = (formData) => {
  const { topic, date, points } = formData
  let message = `@everyone\n\n【活動通知】${topic}\n📅 ${date} 晚上9:00-10:00\n`
  
  if (points && Array.isArray(points) && points.length > 0) {
    message += `\n✨ 本次重點項目：\n`
    points.forEach((point, index) => {
      message += `${index + 1}. ${point}\n`
    })
  }
  
  message += `\n💬 歡迎大家一起來討論、交流經驗，一起進步！`
  return message
}

// 發布到 Discord
export const publishToDiscord = async (imageUrls, formData, webhookUrl, customMessage = null) => {
  if (!webhookUrl) {
    throw new Error('請先設定 Discord Webhook URL')
  }

  if (!imageUrls || imageUrls.length === 0) {
    throw new Error('沒有選擇要發布的圖片')
  }

  try {
    const messageContent = customMessage || buildDiscordMessage(formData)
    const formDataToSend = new FormData()
    
    formDataToSend.append('content', messageContent)
    
    imageUrls.forEach((imageUrl, index) => {
      const blob = dataUrlToBlob(imageUrl)
      const fileName = `${formData.topic.replace(/\s+/g, '_')}_${index + 1}.png`
      formDataToSend.append(`file${index}`, blob, fileName)
    })

    const response = await axios.post(webhookUrl, formDataToSend, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return {
      success: true,
      message: '成功發布到 Discord！',
      imageCount: imageUrls.length
    }
  } catch (error) {
    throw new Error(`發布失敗: ${error.message}`)
  }
}

// 驗證 Webhook URL
export const validateWebhookUrl = (url) => {
  if (!url) return false
  const webhookPattern = /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+$/
  return webhookPattern.test(url)
}
```

### 3. Firebase Storage 服務 (src/services/firebaseStorage.js)

**核心功能**：
- 上傳參考圖片到 Firebase Storage
- 取得圖片 URL

**關鍵程式碼**：

```javascript
import { storage } from '../config/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export const uploadFile = async (file, folder = 'reference_images') => {
  if (!file) {
    throw new Error('沒有選擇檔案')
  }

  try {
    const timestamp = Date.now()
    const fileName = `${folder}/${timestamp}_${file.name}`
    const storageRef = ref(storage, fileName)

    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)

    return downloadURL
  } catch (error) {
    throw new Error(`上傳失敗: ${error.message}`)
  }
}
```

### 4. Firebase 配置 (src/config/firebase.js)

```javascript
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
export const db = getFirestore(app)
```

### 5. Prompt 構建工具 (src/utils/promptBuilder.js)

**核心功能**：
- 根據表單資料構建 AI Prompt
- 確保文字可讀性

**關鍵程式碼**：

```javascript
const STYLE_MAP = {
  'cyberpunk': 'cyberpunk',
  '90s-anime': '90s anime style',
  'hand-drawn-japanese': 'hand-drawn Japanese illustration',
  'watercolor': 'watercolor painting',
  'photorealistic': 'photorealistic',
  'retro-poster': 'retro poster design',
  'neon': 'neon style'
}

export const buildPrompt = (formData) => {
  const { topic, date, points, style } = formData
  const selectedStyle = STYLE_MAP[style] || 'modern design'

  let keyPointsSection = ''
  if (points && points.length > 0) {
    const pointsList = points.map((p, i) => `${i + 1}. ${p}`).join('\n')
    keyPointsSection = `
Key Points:
${pointsList}`
  }

  return `Create a Discord event promotional image in ${selectedStyle} style.

Content Requirements:
- Main Title: "${topic}" (bold, sans-serif font, adjust size if text is long, no line breaks)
- Brand: "Skill Hub"
- Subtitle: "Kemie, Ayn, 聖博老師の學習殿堂"
- Event Time: "${date} 晚上9:00-10:00" (clear and prominent)${keyPointsSection}

CRITICAL - Text Readability:
- Background MUST include blurred areas or gradient color blocks for text placement
- If background is complex, add a semi-transparent rectangular overlay:
  * Use white overlay (rgba(255,255,255,0.8)) for dark backgrounds
  * Use black overlay (rgba(0,0,0,0.7)) for light backgrounds
- Text color must contrast well with background (white on dark, black on light)
- Ensure all text is clearly readable

Image Specifications:
- Size: 1080x1080px
- Format: Square, suitable for Discord and social media
- Style: ${selectedStyle}`
}
```

---

## 樣式實作

### 1. 全域變數 (src/styles/_variables.scss)

```scss
// 顏色系統
$primary-color: #5865F2;
$secondary-color: #00D9FF;
$accent-color: #FF006E;
$success-color: #10b981;
$error-color: #ef4444;
$warning-color: #f59e0b;

// 背景顏色
$bg-primary: #0f0f1e;
$bg-secondary: #1a1a2e;
$card-bg: #16213e;

// 文字顏色
$text-primary: #ffffff;
$text-secondary: #a0aec0;
$text-muted: #718096;

// 間距
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
$spacing-2xl: 48px;

// 邊框半徑
$radius-sm: 4px;
$radius-md: 8px;
$radius-lg: 12px;
$radius-xl: 16px;

// 陰影
$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
$shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);

// 動畫時間
$transition-fast: 0.15s;
$transition-base: 0.2s;
$transition-slow: 0.3s;

// 斷點
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
```

### 2. Mixins (src/styles/_mixins.scss)

```scss
// 響應式斷點
@mixin mobile {
  @media (max-width: #{$breakpoint-md - 1px}) {
    @content;
  }
}

@mixin tablet {
  @media (min-width: #{$breakpoint-md}) and (max-width: #{$breakpoint-lg - 1px}) {
    @content;
  }
}

@mixin desktop {
  @media (min-width: #{$breakpoint-lg}) {
    @content;
  }
}

// Flexbox
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

// 文字省略
@mixin text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 卡片樣式
@mixin card {
  background: $card-bg;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  box-shadow: $shadow-md;
}

// 按鈕重置
@mixin button-reset {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  cursor: pointer;
  outline: none;
}
```

### 3. 全域樣式 (src/styles/global.scss)

```scss
@import './variables';
@import './mixins';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background: $bg-primary;
  color: $text-primary;
  overflow-x: hidden;
}

#root {
  min-height: 100vh;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

// 滾動條樣式
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: $bg-secondary;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}
```

---

## 環境變數配置

### 1. 創建 .env 文件

```bash
touch .env
```

### 2. 填入環境變數

```env
# Gemini API (nano-banana pro)
VITE_NANO_BANANA_API_KEY=你的_Gemini_API_Key

# Firebase 配置
VITE_FIREBASE_API_KEY=你的_Firebase_API_Key
VITE_FIREBASE_AUTH_DOMAIN=你的專案ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=你的專案ID
VITE_FIREBASE_STORAGE_BUCKET=你的專案ID.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=你的_Sender_ID
VITE_FIREBASE_APP_ID=你的_App_ID

# Discord Webhook URL（選填）
VITE_DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/你的webhook_id/你的webhook_token
```

### 3. 建立 .env.example（給其他開發者參考）

```env
# Gemini API (nano-banana pro)
VITE_NANO_BANANA_API_KEY=your_api_key_here

# Firebase 配置
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Discord Webhook URL（選填）
VITE_DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your_webhook_id/your_webhook_token
```

---

## 測試與運行

### 步驟 1：啟動開發伺服器

```bash
npm run dev
```

應該會看到：
```
  VITE v6.0.5  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 步驟 2：測試圖片生成

1. 開啟瀏覽器訪問 http://localhost:5173
2. 填寫表單：
   - 活動主題：「AI 工作坊」
   - 活動日期：選擇日期
   - 重點項目：填入幾個重點（選填）
   - 圖片風格：選擇一種風格
   - 參考圖片：可選擇上傳（選填）
3. 點擊「生成圖片」
4. 等待 30-60 秒
5. 應該會看到 4 張生成的圖片

### 步驟 3：測試 Discord 發布

1. 確認 `.env` 中有設定 `VITE_DISCORD_WEBHOOK_URL`
2. 或在表單中手動輸入 Webhook URL
3. 選擇要發布的圖片（點擊圖片左上角的核取方塊）
4. 點擊「發布到 Discord」
5. 在預覽彈窗中確認圖片和訊息
6. 編輯訊息（如需要）
7. 點擊「確認發布到 Discord」
8. 檢查 Discord 頻道是否收到訊息和圖片

### 常見問題排除

**問題 1：圖片生成失敗（403 錯誤）**
- 檢查 Gemini API Key 是否有效
- 確認 API Key 有圖片生成權限
- 檢查 API 配額是否用盡

**問題 2：Discord 發布失敗（404 錯誤）**
- 檢查 Webhook URL 格式是否正確
- 確認 Webhook 沒有被刪除
- 重新建立 Webhook 並更新 URL

**問題 3：參考圖片上傳失敗**
- 檢查 Firebase Storage 規則
- 確認 Firebase 專案已啟用 Storage
- 檢查圖片大小（建議 < 5 MB）

**問題 4：Datepicker 不顯示**
- 確認 jQuery 和 jQuery UI 已安裝
- 檢查 CSS 是否正確引入
- 查看瀏覽器 Console 是否有錯誤

---

## 部署

### 選項 1：部署到 Vercel

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 登入
vercel login

# 部署
vercel
```

### 選項 2：部署到 Firebase Hosting

```bash
# 安裝 Firebase CLI
npm install -g firebase-tools

# 登入
firebase login

# 初始化
firebase init hosting

# 建置專案
npm run build

# 部署
firebase deploy --only hosting
```

### 部署前檢查清單

- [ ] 所有環境變數已設定
- [ ] Firebase 專案已建立並配置
- [ ] Discord Webhook 已建立
- [ ] .env 文件未提交到 Git
- [ ] 專案已通過本地測試
- [ ] 圖片生成功能正常
- [ ] Discord 發布功能正常

---

## 版本控制建議

### Git Commit 格式

```bash
# 功能新增
git commit -m "feat: 新增 Discord 發布預覽功能"

# Bug 修復
git commit -m "fix: 修復瀏覽器相容性問題"

# 樣式調整
git commit -m "style: 優化 Modal 動畫效果"

# 文檔更新
git commit -m "docs: 更新 README 安裝說明"

# 重構
git commit -m "refactor: 重構 discordService 程式碼結構"

# 測試
git commit -m "test: 新增圖片生成測試"
```

### 版本號規則

使用語義化版本號（Semantic Versioning）：

- **主版本號（Major）**：不相容的 API 修改
- **次版本號（Minor）**：向下相容的功能新增
- **修訂號（Patch）**：向下相容的問題修正

範例：
- `1.0.0` - 初始版本
- `1.1.0` - 新增功能（例如：發布預覽）
- `1.1.1` - Bug 修復

---

## 總結

遵循本指南，您應該能夠 100% 復刻此專案。關鍵要點：

1. **環境準備**：確保所有必要工具和帳號已就緒
2. **依賴安裝**：嚴格按照 package.json 安裝依賴
3. **組件實作**：按照專案結構逐步建立組件
4. **服務整合**：正確配置 Gemini API、Firebase、Discord
5. **測試驗證**：每個功能都要測試確保正常運作
6. **環境變數**：正確設定所有環境變數

如有任何問題，請參考：
- `SPEC/MAIN.md` - 完整規格書
- `TESTING_DISCORD.md` - Discord 測試指南
- 原始碼注釋 - 每個文件都有詳細說明

祝您復刻成功！🎉
