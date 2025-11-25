# 專案規格書

## Discord 廣告生成器 - 專案需求規格

根據 `PROMPT_GUIDE.md` 提示詞框架整理

---

## 一、Web開發需求

### 【專案概述】
- **專案名稱**：Discord 廣告生成器（Discord Ad Generator）
- **目的**：提供一個線上工具，讓使用者輸入活動主題、日期和重點說明，自動生成符合品牌風格的 Discord 社群宣傳圖片，並可直接發布到指定的 Discord 聊天區
- **目標用戶群**：
  - Skill Hub 社群管理員
  - 「Kemie, Ayn, 聖博老師の學習殿堂」課程講師
  - 需要定期發布活動宣傳的社群經營者
- **核心功能說明**：使用者輸入活動資訊後，系統根據選定風格和參考圖片生成 3 張預覽圖，確認後可直接發布到 Discord

---

### 【技術需求】

#### 1. 前端技術棧：
- **框架**：React.js
- **後端服務**：Firebase
  - Firebase Storage（儲存上傳的參考圖片和生成的圖片）
  - Firebase Firestore（儲存生成記錄）
  - Firebase Functions（處理圖片生成 API 呼叫）
- **響應式設計**：必須支援桌面、平板、手機
- **部署**：Firebase Hosting 或 Vercel

#### 2. 功能需求（按優先級）：

**✅ P0 - 核心功能**
- **輸入表單**：
  - 主題輸入欄位（文字）
  - 日期選擇器（Date Picker）
  - 附加重點輸入欄位（多行文字）
  - 參考圖片上傳功能（支援拖放或點擊上傳）
  
- **風格選擇器**：
  - 根據使用者輸入的主題，智能推薦風格選項
  - 常見風格包含：AI科技風、插畫風、極簡風、賽博朋克風等
  - 使用者可選擇其中一種風格
  
- **圖片生成與預覽**：
  - 點擊「生成」按鈕後，同時生成 3 張圖片
  - 即時預覽 3 張生成的圖片
  - 圖片內容包含：
    - **主標題**：使用者輸入的主題（文字過長時自動縮小字體，不換行）
    - **品牌名稱**：Skill Hub
    - **副標題**：Kemie, Ayn, 聖博老師の學習殿堂
    - **活動時間**：[使用者輸入日期] 晚上9:00-10:00（清晰明確）
    - **說明文字**：使用者輸入的附加重點
    
- **Discord 發布功能**：
  - 選擇要發布的圖片（可多選）
  - 連接 Discord Bot，發布到指定聊天區
  - 顯示發布成功/失敗狀態

**🔄 P1 - 進階功能**
- 儲存生成歷史記錄
- 下載圖片到本地（批次下載）
- 編輯已生成的圖片（調整文字位置、大小）
- 自訂風格模板

#### 3. 設計要求：
- **視覺風格**：現代化、專業的 SaaS 風格
- **色彩方案**：
  - 主色調：深紫色 (#5865F2) - Discord 品牌色
  - 輔助色：霓虹藍 (#00D9FF)、霓虹粉 (#FF006E)
- **佈局**：
  - 左側：輸入表單區域
  - 右側：預覽區域（3 張圖片並排或網格顯示）
- **動畫效果**：
  - 圖片生成時的 Loading 動畫
  - Hover 效果
  - 平滑的過渡效果

---

### 【技術約束】
- **瀏覽器支援**：Chrome、Firefox、Safari、Edge（最新版本）
- **效能要求**：
  - 首次載入時間 < 3 秒
  - 圖片生成時間 < 10 秒（3 張）
- **SEO需求**：基本的 meta tags 和 Open Graph 標籤
- **無障礙**：基本的鍵盤導航支援

---

### 【開發階段】

**第一階段：專案初始化**
- 建立 React 專案
- 設定 Firebase 專案和服務
- 建立基本資料夾結構
- 設定環境變數

**第二階段：UI 開發**
- 建立輸入表單組件
- 建立風格選擇器組件
- 建立圖片預覽組件
- 建立上傳組件

**第三階段：核心功能開發**
- 整合 nano-banana pro 圖片生成 API
- 實作參考圖片上傳到 Firebase Storage
- 實作風格推薦邏輯
- 實作圖片生成邏輯（包含文字排版規則）

**第四階段：Discord 整合**
- 建立 Discord Bot
- 實作 Discord Webhook 或 Bot API
- 實作發布到指定聊天區功能
- 錯誤處理和狀態回饋

**第五階段：測試與部署**
- 功能測試
- 響應式測試
- 部署到 Firebase Hosting 或 Vercel
- 設定 CI/CD

---

### 【交付物】
- 完整的 React + Firebase 專案原始碼
- README.md（包含安裝、設定、運行說明）
- 環境變數設定範例（.env.example）
- Discord Bot 設定指南
- 部署指南

---

## 二、圖片生成需求

### 【任務目標】
- 生成 Discord 社群宣傳圖片
- 應用場景：在 Discord 發布活動宣傳

---

### 【設計需求】

#### 1. 風格定義：
- **視覺風格**：根據使用者選擇的風格（AI科技風、插畫風、極簡風、賽博朋克風等）
- **色彩方案**：
  - 主色調：與 Skill Hub 品牌一致（深紫色系）
  - 根據參考圖片調整配色
- **設計語言**：現代、專業、吸引眼球

#### 2. 內容元素：
- **主標題**：使用者輸入的主題
  - 字體：粗體、醒目
  - 排版規則：文字過長時縮小字體，不換行
  - 位置：圖片上方或中央
  
- **品牌名稱**：Skill Hub
  - 字體：品牌字體
  - 位置：顯眼位置（建議左上角或右上角）
  
- **副標題**：Kemie, Ayn, 聖博老師の學習殿堂
  - 字體：次要字體
  - 位置：主標題下方
  
- **活動時間**：[日期] 晚上9:00-10:00
  - 字體：清晰、明確
  - 格式：例如「2025-11-25 晚上9:00-10:00」
  - 位置：圖片下方或時間區塊
  
- **說明文字**：使用者輸入的附加重點
  - 字體：可讀性高的字體
  - 位置：圖片中下方或側邊
  
- **背景元素**：
  - 根據參考圖片生成類似風格
  - 可包含抽象圖形、漸層、科技元素等

#### 3. 技術規格：
- **尺寸規格**：1080x1080（正方形，適合 Discord 和社群媒體）
- **圖片格式**：JPG
- **解析度**：72dpi（網頁用）
- **檔案大小限制**：≤ 500KB

---

### 【參考範例】
- 使用者上傳的參考圖片
- 根據參考圖片的風格、配色、排版生成類似風格
- 保持品牌一致性（Skill Hub 品牌元素）

---

### 【輸出要求】
- **圖片數量**：每次生成 3 張
- **變化版本**：3 張圖片在保持風格一致的前提下，提供細微變化（例如：背景元素位置、色調微調）
- **命名規則**：`[主題slug]_[活動日期時間].jpg`
  - 範例：`ai_workshop_20251125_2100.jpg`
  - 主題 slug：將主題轉換為英文或拼音，使用底線分隔
  - 日期時間格式：YYYYMMDD_HHMM

---

## 三、技術整合需求

### 圖片生成 API
- **使用 API**：nano-banana pro
- **整合方式**：在 Firebase Functions 中呼叫 API
- **功能需求**：
  - 支援 text-to-image 生成
  - 支援 image-to-image（根據參考圖片生成類似風格）
  - 可控制風格參數

### Discord Bot 設定
- 需要建立 Discord Bot 並取得 Token
- Bot 需要有發送訊息和上傳圖片的權限
- 需要取得目標聊天區的 Channel ID

### 參考圖片處理
- 上傳到 Firebase Storage
- 取得圖片 URL 傳遞給圖片生成 API
- 使用 image-to-image 或 style transfer 技術

---

## 四、已確認事項 ✅

### 1. **nano-banana pro API**
   - ✅ 使用者已有 API Key
   - 📌 **開發注意**：程式碼中需預留 API Key 設定位置（環境變數）

### 2. **Discord Bot 設定**
   - ✅ 使用者將建立 Discord Bot
   - 📌 **開發注意**：程式碼中需預留以下設定位置：
     - Discord Bot Token
     - Target Channel ID
     - 使用環境變數或設定檔案

### 3. **Firebase 專案**
   - ✅ 使用者將申請 Firebase 專案
   - ✅ 確認使用服務：Storage、Firestore、Functions、Hosting
   - 📌 **開發注意**：
     - 提供完整的 Firebase 設定範例（`.env.example`）
     - 程式碼寫好，讓使用者貼入 Firebase config 即可

### 4. **風格推薦邏輯**
   - ✅ 採用 **AI 智能推薦**
   - 📌 **開發注意**：
     - 根據使用者輸入的主題文字，使用 AI 分析並推薦適合的風格
     - 可能需要額外的 AI API（例如 OpenAI GPT）或使用 nano-banana pro 內建功能

---

## 五、開發準備事項

### 環境變數設定（`.env.example`）
程式碼需包含以下環境變數範本：
```env
# nano-banana pro API
VITE_NANO_BANANA_API_KEY=<your-nano-banana-api-key>

# Discord Bot
VITE_DISCORD_BOT_TOKEN=<your-discord-bot-token>
VITE_DISCORD_CHANNEL_ID=<your-discord-channel-id>

# Firebase Configuration
VITE_FIREBASE_API_KEY=<your-firebase-api-key>
VITE_FIREBASE_AUTH_DOMAIN=<your-project-id>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=<your-project-id>
VITE_FIREBASE_STORAGE_BUCKET=<your-project-id>.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
VITE_FIREBASE_APP_ID=<your-app-id>
```

### 開發原則
1. 所有敏感資訊使用環境變數
2. 提供清晰的設定文檔和註解
3. 確保使用者只需填入相關 Key 和 ID 即可運行
