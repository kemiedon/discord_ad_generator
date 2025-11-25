# Discord 廣告生成器

快速生成精美的 Discord 社群宣傳圖片

## 🚀 功能特色

- ✨ 7 種預設風格選擇（賽博龐克、90年代動畫、手繪日系等）
- 🎨 支援上傳參考圖片，生成類似風格
- 📱 響應式設計，支援桌面、平板、手機
- 🤖 一鍵發布到多個 Discord 伺服器
- 📝 歷史記錄管理
- 💾 批次下載功能

## 📋 技術棧

- **前端框架**: React 18 + Vite
- **樣式**: SASS
- **後端服務**: Firebase (Storage, Firestore, Functions)
- **圖片生成**: nano-banana pro API
- **Discord 整合**: Discord.js

## 🛠️ 安裝步驟

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

複製 `.env.example` 為 `.env`：

```bash
cp .env.example .env
```

然後填入您的 API Keys：

```env
# nano-banana pro API
VITE_NANO_BANANA_API_KEY=your_api_key_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Firebase 設定

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用以下服務：
   - **Storage**: 用於儲存圖片
   - **Firestore**: 用於儲存歷史記錄和 Discord 伺服器設定
   - **Functions**: 用於處理 API 呼叫（可選）
   - **Hosting**: 用於部署網站
4. 在專案設定中取得 Firebase 設定資訊，貼到 `.env` 檔案中

### 4. Discord Bot 設定

請參考 [Discord Bot 設定指南](./docs/DISCORD_SETUP.md)

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
- **重點**: 輸入活動重點項目（支援多個）
- **參考圖片**: 上傳參考圖片（可選）
- **風格**: 選擇圖片風格

### 2. 生成圖片

點擊「生成」按鈕，系統將生成 3 張圖片供您預覽

### 3. 發布到 Discord

1. 選擇要發布的圖片
2. 選擇目標 Discord 伺服器
3. 點擊「發布」按鈕

## 📚 文檔

- [Discord Bot 設定指南](./docs/DISCORD_SETUP.md)
- [部署指南](./docs/DEPLOYMENT.md)
- [專案規格書](./SPEC/MAIN.md)

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📝 授權

MIT License

## 👨‍💻 作者

Skill Hub - Kemie, Ayn, 聖博老師の學習殿堂
