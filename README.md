# Discord 廣告生成器

快速生成精美的 Discord 社群宣傳圖片並直接發布

## ✅ 最新測試狀態 (v4.0.0 - 2025-12-03)

### 已測試通過功能

- ✅ **一般生圖功能**: 使用 Gemini 3 Pro Image Preview API 生成圖片
- ✅ **Discord 發布功能**: 透過 Webhook 直接發布到 Discord 頻道
- ✅ **預覽功能**: 在發布前預覽所選圖片和訊息內容
- ✅ **錯誤處理**: 自動重試機制,友善錯誤提示

### 待測試功能

- ⚠️ **參考圖片圖生圖**: 上傳參考圖片並依照風格生成 (已修復,待測試)

## 🚀 功能特色

- ✨ 4 種預設風格選擇（賽博龐克、Pixel 遊戲、高寫實照片、復古海報）
- 🎨 支援上傳參考圖片，生成類似風格
- 📱 響應式設計，支援桌面、平板、手機
- 🤖 一鍵發布到 Discord (透過 Webhook)
- 🔄 自動重試機制，提升成功率
- 🎯 即時預覽，所見即所得

## 📋 技術棧

- **前端框架**: React 18.3.1 + Vite 6.0.5
- **樣式**: SASS 1.83.0
- **HTTP 客戶端**: Axios 1.7.9
- **通知系統**: React Hot Toast 2.6.0
- **後端服務**: Firebase 11.0.2
- **圖片生成 API**: Google Gemini 3 Pro Image Preview
- **Discord 整合**: Discord Webhook API

## 🛠️ 安裝步驟

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

建立 `.env` 檔案：

```bash
touch .env
```

填入您的 API Keys：

```env
# Google Gemini API (必填)
VITE_NANO_BANANA_API_KEY=your_gemini_api_key_here

# Discord Webhook URL (必填)
VITE_DISCORD_WEBHOOK_URL=your_discord_webhook_url_here

# Firebase Configuration (選填 - 目前未使用)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**取得 API Keys:**

1. **Gemini API Key**:

   - 前往 [Google AI Studio](https://makersuite.google.com/app/apikey)
   - 建立新的 API Key

2. **Discord Webhook URL**:
   - 在 Discord 頻道設定中選擇「整合」→「Webhook」
   - 建立新 Webhook 並複製 URL

### 3. Firebase 設定 (選填)

> 注意: 目前版本不需要 Firebase,參考圖片處理已改為瀏覽器本地處理

如果未來需要使用 Firebase:

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 建立新專案
3. 啟用 Storage 和 Firestore
4. 取得設定資訊並填入 `.env`

## 🎮 運行專案

### 開發模式

```bash
npm run dev
```

專案將在 `http://localhost:3000` 運行

### 建置生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## 📁 專案結構

```
discord-ad-generator/
├── src/
│   ├── components/          # React 組件
│   │   ├── common/          # 通用組件（Button、Input 等）
│   │   ├── InputForm/       # 輸入表單組件
│   │   ├── PreviewGrid/     # 圖片預覽組件
│   │   └── ...
│   ├── services/            # API 服務
│   │   ├── nanoBananaService.js    # nano-banana pro API
│   │   ├── firebaseStorage.js      # Firebase Storage
│   │   ├── discordService.js       # Discord API
│   │   └── historyService.js       # 歷史記錄
│   ├── utils/               # 工具函數
│   │   ├── slugify.js       # 文字轉 slug
│   │   ├── formatDate.js    # 日期格式化
│   │   └── promptBuilder.js # Prompt 構建
│   ├── styles/              # SASS 樣式
│   │   ├── _variables.scss  # 變數定義
│   │   ├── _mixins.scss     # Mixins
│   │   └── global.scss      # 全域樣式
│   ├── config/              # 設定檔
│   │   └── firebase.js      # Firebase 初始化
│   ├── App.jsx              # 主應用組件
│   └── main.jsx             # 入口檔案
├── public/                  # 靜態資源
├── docs/                    # 文檔
│   ├── DISCORD_SETUP.md     # Discord Bot 設定指南
│   └── DEPLOYMENT.md        # 部署指南
├── SPEC/                    # 專案規格書
│   ├── MAIN.md              # 主要規格
│   └── PROMPT_GUIDE.md      # 提示詞指南
├── .env.example             # 環境變數範例
├── package.json             # 專案依賴
├── vite.config.js           # Vite 設定
└── README.md                # 本檔案
```

## 🎨 使用說明

### 1. 輸入活動資訊

- **主題**: 輸入活動主題（例如：AI 工作坊）
- **日期**: 選擇活動日期
- **重點**: 輸入活動重點項目（每行一個重點）
- **風格**: 選擇圖片風格（賽博龐克、Pixel 遊戲、高寫實照片、復古海報）
- **參考圖片**: 上傳參考圖片（可選，用於圖生圖）
- **Discord Webhook URL**: 輸入 Discord Webhook URL

### 2. 生成圖片

點擊「生成圖片」按鈕，系統將：

1. 根據您的輸入構建 AI 提示詞
2. 調用 Gemini API 生成 4 張圖片
3. 顯示在預覽區域

### 3. 預覽與發布

1. 在預覽區域勾選要發布的圖片
2. 點擊「預覽選中的圖片」按鈕
3. 在彈出視窗中：
   - 檢視選中的圖片
   - 編輯發布訊息（支援 @everyone 標註）
   - 確認後點擊「確認發布到 Discord」
4. 圖片和訊息將自動發送到指定的 Discord 頻道

### 4. 常見問題

**Q: 圖片生成失敗怎麼辦？**  
A: 系統會自動重試最多 2 次。如果仍然失敗，請檢查：

- API Key 是否正確
- 網路連線是否正常
- 提示詞是否過長或包含敏感內容

**Q: Discord 發布失敗？**  
A: 請確認：

- Webhook URL 格式正確
- Webhook 沒有被刪除或停用
- 圖片總大小不超過 8MB

**Q: 參考圖片功能無效？**  
A: 目前圖生圖功能已修復但待測試。請：

- 確保圖片格式為 JPG 或 PNG
- 圖片大小不超過 5MB
- 如果仍有問題請回報

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📝 授權

MIT License

## 👨‍💻 作者

Skill Hub - Kemie, Ayn, 聖博老師の學習殿堂
