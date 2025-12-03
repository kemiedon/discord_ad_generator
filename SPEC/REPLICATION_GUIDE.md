# Discord 廣告生成器 - 完整復刻指南

**版本**: v4.2.0  
**最後更新**: 2025-12-03  
**適用對象**: 希望從零開始復刻此專案的開發者

---

## 📋 目錄

1. [專案概述](#專案概述)
2. [技術架構](#技術架構)
3. [環境準備](#環境準備)
4. [快速開始](#快速開始)
5. [核心功能實作重點](#核心功能實作重點)
6. [部署指南](#部署指南)
7. [常見問題](#常見問題)

---

## 專案概述

### 功能特色

✅ **圖片生成**: 使用 Google Gemini API 生成 4 張 Discord 宣傳圖片  
✅ **進度顯示**: 實時顯示生成進度條和狀態訊息  
✅ **參考圖片**: 支援上傳參考圖片進行 image-to-image 生成  
✅ **Discord 發布**: 直接透過 Webhook 發布到 Discord 頻道  
✅ **發布預覽**: 發布前預覽圖片和編輯訊息內容  
✅ **歷史記錄**: 使用 Firestore 儲存和管理生成記錄  
✅ **Webhook 管理**: 支援多個頻道快速切換  
✅ **響應式設計**: 完整支援桌面、平板、手機裝置

---

## 技術架構

### 前端技術棧

```json
{
  "框架": "React 18.3.1",
  "建置工具": "Vite 6.0.5",
  "樣式": "SASS 1.83.0",
  "HTTP客戶端": "axios 1.7.9",
  "通知系統": "react-hot-toast 2.6.0",
  "圖片壓縮": "browser-image-compression 2.0.2",
  "後端服務": "Firebase 11.0.2 (Firestore)"
}
```

### 專案結構(精簡版)

```
discord_ad_generator/
├── index.html
├── package.json
├── vite.config.js
├── .env (不提交)
├── .env.example
├── test-firebase.html
├── SPEC/
│   ├── MAIN.md
│   ├── PROMPT_GUIDE.md
│   └── REPLICATION_GUIDE.md (本文件)
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   │   ├── HomePage/          # 主頁面
│   │   ├── InputForm/         # 輸入表單
│   │   ├── PreviewGrid/       # 圖片預覽
│   │   ├── PublishPreview/    # 發布預覽
│   │   ├── HistoryPanel/      # 歷史記錄
│   │   └── common/            # 通用組件
│   │       ├── Button/
│   │       ├── Input/
│   │       ├── Select/
│   │       ├── TextArea/
│   │       ├── Modal/
│   │       ├── ProgressBar/   # 進度條(NEW)
│   │       └── ...
│   ├── config/
│   │   ├── firebase.js        # Firebase 配置
│   │   └── webhooks.js        # Webhook 配置(NEW)
│   ├── services/
│   │   ├── nanoBananaService.js   # Gemini API
│   │   ├── discordService.js      # Discord Webhook
│   │   └── historyService.js      # 歷史記錄
│   ├── utils/
│   │   ├── promptBuilder.js       # Prompt 構建
│   │   └── imageCompression.js    # 圖片壓縮
│   └── styles/
│       ├── _variables.scss    # SCSS 變數
│       └── _mixins.scss       # SCSS Mixins
```

---

## 環境準備

### 1. 安裝必要工具

```bash
# 確認 Node.js 版本 (建議 v18+)
node --version

# 確認 npm
npm --version

# 確認 Git
git --version
```

### 2. 註冊必要服務

#### Google Gemini API

1. 前往 [Google AI Studio](https://aistudio.google.com/)
2. 登入並點擊 "Get API Key"
3. 創建或選擇專案
4. 複製 API Key (格式: `AIza...`)

#### Firebase 專案

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 創建新專案 `discord-ad-generator`
3. 啟用 Firestore Database (測試模式)
4. 選擇地區: `asia-east1` (台灣)
5. 複製 Firebase 配置

#### Discord Webhook

1. Discord 頻道設定 → 整合 → Webhooks
2. 建立 Webhook
3. 複製 URL (格式: `https://discord.com/api/webhooks/{id}/{token}`)

---

## 快速開始

### 步驟 1: 建立專案

```bash
# 使用 Vite 建立 React 專案
npm create vite@latest discord_ad_generator -- --template react
cd discord_ad_generator
```

### 步驟 2: 安裝依賴

```bash
npm install axios@1.7.9 \
  firebase@11.0.2 \
  react-hot-toast@2.6.0 \
  browser-image-compression@2.0.2 \
  sass@1.83.0
```

### 步驟 3: 配置環境變數

創建 `.env`:

```env
# Gemini API
VITE_NANO_BANANA_API_KEY=你的_GEMINI_API_KEY

# Firebase
VITE_FIREBASE_API_KEY=你的_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=你的專案ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=你的專案ID
VITE_FIREBASE_STORAGE_BUCKET=你的專案ID.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=你的_SENDER_ID
VITE_FIREBASE_APP_ID=你的_APP_ID

# Discord Webhook (選填)
VITE_DISCORD_WEBHOOK_URL=你的_WEBHOOK_URL
```

### 步驟 4: 啟動開發伺服器

```bash
npm run dev
```

訪問 `http://localhost:5173`

---

## 核心功能實作重點

### 1. 進度條系統 (NEW in v4.2.0)

**ProgressBar 組件** (`src/components/common/ProgressBar/ProgressBar.jsx`):

```jsx
function ProgressBar({ current, total, label, status }) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className='progress-bar'>
      <div className='progress-bar__header'>
        <span className='progress-bar__label'>{label}</span>
        <span className='progress-bar__count'>
          {current} / {total}
        </span>
      </div>

      <div className='progress-bar__track'>
        <div className='progress-bar__fill' style={{ width: `${percentage}%` }}>
          <span className='progress-bar__percentage'>{percentage}%</span>
        </div>
      </div>

      {status && <div className='progress-bar__status'>{status}</div>}
    </div>
  )
}
```

**SCSS 動畫** (`ProgressBar.scss`):

```scss
.progress-bar__fill {
  // 光澤動畫
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 100%
    );
    animation: shimmer 2s infinite;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.progress-bar__status {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
```

**整合到生成流程** (`HomePage.jsx`):

```jsx
const handleGenerate = async formData => {
  setIsGenerating(true)
  setProgressCurrent(0)
  setProgressTotal(4)
  setProgressStatus('準備開始生成...')

  try {
    // 1. 處理參考圖片
    if (formData.referenceImage) {
      setProgressStatus('正在處理參考圖片...')
      // ... 處理邏輯
    }

    // 2. 構建 Prompt
    setProgressStatus('正在構建生成提示詞...')
    const prompt = buildPrompt(formData)

    // 3. 生成圖片 (附帶進度回調)
    setProgressStatus('正在生成圖片...')
    const images = await generateImages(
      prompt,
      referenceImageBase64,
      (current, total, status) => {
        setProgressCurrent(current)
        setProgressTotal(total)
        setProgressStatus(status)
      }
    )

    // 4. 壓縮圖片
    setProgressStatus('正在壓縮圖片...')
    const compressedImages = await compressImages(images)

    // 5. 保存歷史
    setProgressStatus('正在保存歷史記錄...')
    const thumbnail = await generateThumbnail(compressedImages[0])
    await saveHistory({ ...formData, thumbnail })

    setProgressStatus('✅ 已保存到歷史記錄')
  } catch (error) {
    console.error(error)
  } finally {
    setIsGenerating(false)
  }
}
```

### 2. Webhook 預設選項管理 (NEW in v4.2.0)

**配置檔** (`src/config/webhooks.js`):

```javascript
export const WEBHOOKS = [
  {
    id: 'webhook1',
    name: 'Skill Hub佈告欄',
    url: 'https://discord.com/api/webhooks/你的ID/你的TOKEN'
  },
  {
    id: 'webhook2',
    name: '廣瞻一般頻道',
    url: 'https://discord.com/api/webhooks/你的ID/你的TOKEN'
  }
]

export const getWebhookById = id => WEBHOOKS.find(webhook => webhook.id === id)

export const getWebhookByUrl = url =>
  WEBHOOKS.find(webhook => webhook.url === url)

export const getDefaultWebhook = () => WEBHOOKS[0]
```

**表單整合** (`InputForm.jsx`):

```jsx
const [webhookPreset, setWebhookPreset] = useState('webhook1')
const [webhookUrl, setWebhookUrl] = useState('')

const handleWebhookPresetChange = e => {
  const value = e.target.value
  setWebhookPreset(value)

  if (value === 'custom') {
    setWebhookUrl('')
  } else {
    const webhook = getWebhookById(value)
    if (webhook) {
      setWebhookUrl(webhook.url)
    }
  }
}

// JSX
;<Select
  label='Discord Webhook 頻道'
  value={webhookPreset}
  onChange={handleWebhookPresetChange}
>
  {WEBHOOKS.map(webhook => (
    <option key={webhook.id} value={webhook.id}>
      {webhook.name}
    </option>
  ))}
  <option value='custom'>自訂 Webhook URL</option>
</Select>

{
  webhookPreset === 'custom' && (
    <Input
      label='Discord Webhook URL'
      value={webhookUrl}
      onChange={e => setWebhookUrl(e.target.value)}
    />
  )
}
```

### 3. 歷史記錄彈出視窗 (v4.2.0 重構)

**Modal 式設計** (`HistoryPanel.jsx`):

```jsx
function HistoryPanel({ isOpen, onClose, onLoadHistory }) {
  const [history, setHistory] = useState([])

  useEffect(() => {
    if (isOpen) {
      loadHistory()
    }
  }, [isOpen])

  const handleLoad = item => {
    onLoadHistory(item)
    onClose() // 載入後自動關閉
  }

  if (!isOpen) return null

  return (
    <div className='history-panel'>
      <div className='history-panel__overlay' onClick={onClose} />
      <div className='history-panel__modal'>
        <header className='history-panel__header'>
          <h2>歷史記錄</h2>
          <button onClick={onClose}>✕</button>
        </header>
        <div className='history-panel__list'>
          {history.map(item => (
            <HistoryCard
              key={item.id}
              item={item}
              onLoad={() => handleLoad(item)}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
```

**動畫效果** (`HistoryPanel.scss`):

```scss
.history-panel__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease;
  z-index: 1000;
}

.history-panel__modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 1200px;
  max-height: 85vh;
  background: $bg-secondary;
  border-radius: 12px;
  animation: slideUp 0.3s ease;
  z-index: 1001;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translate(-50%, -45%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}
```

### 4. 圖片縮圖生成 (解決 Firestore 1MB 限制)

**縮圖生成** (`imageCompression.js`):

```javascript
export const generateThumbnail = async imageUrl => {
  const response = await fetch(imageUrl)
  const blob = await response.blob()

  const thumbnail = await imageCompression(blob, {
    maxSizeMB: 0.05, // 50KB
    maxWidthOrHeight: 300,
    useWebWorker: true,
    quality: 0.6
  })

  const reader = new FileReader()
  return new Promise(resolve => {
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(thumbnail)
  })
}
```

**保存時使用縮圖** (`HomePage.jsx`):

```jsx
// 生成小縮圖
const thumbnail = await generateThumbnail(compressedImages[0])

await saveHistory({
  topic: formData.topic,
  date: formData.date,
  points: formData.points,
  style: formData.style,
  thumbnail: thumbnail, // 只保存縮圖
  imageCount: compressedImages.length,
  webhookUrl: formData.webhookUrl
})
```

### 5. 表單 UI 優化

**SCSS 變數定義** (`_variables.scss`):

```scss
// 顏色系統
$discord-purple: #5865f2;
$discord-purple-dark: #4752c4;
$bg-dark: #1e1f22;
$bg-secondary: #313338; // NEW: 表單輸入背景
$bg-light: #383a40;
$border-color: #3f4147; // NEW: 邊框顏色
$text-primary: #ffffff;
$text-secondary: #b5bac1;
```

**輸入框樣式改進** (`Input.scss`):

```scss
.input__field {
  background: $bg-secondary; // 較淺的背景
  border: 1px solid $border-color; // 明顯的邊框
  color: $text-primary;
  transition: $transition-normal;

  &:focus {
    background: $bg-light;
    border-color: $discord-purple;
    outline: none;
  }
}
```

---

## 部署指南

### Firebase Hosting

```bash
# 安裝 Firebase CLI
npm install -g firebase-tools

# 登入
firebase login

# 初始化
firebase init hosting

# 建置
npm run build

# 部署
firebase deploy
```

### Vercel

```bash
# 安裝 Vercel CLI
npm install -g vercel

# 登入
vercel login

# 部署
vercel
```

**設定環境變數**: 在 Vercel Dashboard → Settings → Environment Variables 添加所有 `.env` 變數

---

## 常見問題

### Q1: Firestore permission-denied

**解決**: 前往 Firebase Console → Firestore → 規則,設為測試模式:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 31);
    }
  }
}
```

### Q2: 進度條不顯示

**檢查**:

1. HomePage 是否有 `progressCurrent`, `progressTotal`, `progressStatus` 狀態
2. nanoBananaService 是否正確呼叫 `onProgress` 回調
3. ProgressBar 組件是否在 `isGenerating` 時渲染

### Q3: Webhook 下拉選單無選項

**檢查**:

1. `src/config/webhooks.js` 是否正確設定
2. WEBHOOKS 陣列是否有尾部逗號 (移除)
3. Webhook URL 格式是否正確

### Q4: 歷史記錄保存超時

**解決**:

1. 確保使用 `generateThumbnail()` 生成縮圖
2. 只保存 thumbnail,不保存完整圖片
3. 檢查 Firestore API 是否啟用

### Q5: SCSS 編譯錯誤

**解決**:

1. 確認所有變數已在 `_variables.scss` 定義
2. 使用 `@use` 而非 `@import`
3. 變數前綴正確 (如 `$discord-purple` 而非 `$primary`)

---

## 測試清單

### 功能測試

- [ ] 圖片生成 (text-to-image)
- [ ] 圖片生成 (image-to-image)
- [ ] 進度條實時更新
- [ ] Discord 發布成功
- [ ] 歷史記錄保存/載入/刪除
- [ ] Webhook 預設選項切換
- [ ] 表單驗證

### UI/UX 測試

- [ ] 桌面版佈局
- [ ] 手機版佈局
- [ ] 彈出視窗動畫
- [ ] 進度條動畫
- [ ] Loading 狀態
- [ ] Toast 通知

### 瀏覽器測試

- [ ] Chrome (最新版)
- [ ] Firefox (最新版)
- [ ] Safari (最新版)
- [ ] Edge (最新版)

---

## 重要提醒

1. **環境變數安全**: 永遠不要將 `.env` 提交到 Git
2. **API 配額**: 注意 Gemini API 的使用配額限制
3. **Firestore 規則**: 生產環境使用嚴格的安全規則
4. **Webhook 保密**: 不要公開分享 Webhook URL
5. **定期備份**: 定期備份 Firestore 數據

---

## 參考資源

- [MAIN.md](./MAIN.md) - 完整專案規格書
- [PROMPT_GUIDE.md](./PROMPT_GUIDE.md) - AI 指令規範和使用者 Prompt 記錄
- [Firebase 文檔](https://firebase.google.com/docs)
- [React 文檔](https://react.dev/)
- [Vite 文檔](https://vitejs.dev/)
- [Google AI Studio](https://aistudio.google.com/)

---

**版本**: v4.2.0  
**最後更新**: 2025-12-03  
**維護者**: Kemie, Ayn, 聖博老師の學習殿堂

祝你復刻成功! 🎉
