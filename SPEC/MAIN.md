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
- **建置工具**：Vite
- **樣式方案**：純 CSS/SASS
- **後端服務**：Firebase
  - Firebase Storage（儲存上傳的參考圖片和生成的圖片）
  - Firebase Firestore（儲存生成記錄和 Discord 伺服器設定）
  - Firebase Functions（處理圖片生成 API 呼叫）
- **響應式設計**：必須支援桌面、平板、手機
  - 桌面版：左右佈局（左側表單，右側預覽）
  - 手機版：上下佈局（上方表單，下方預覽）
- **部署**：Firebase Hosting 或 Vercel

#### 2. 功能需求（按優先級）：

**✅ P0 - 核心功能**

##### **輸入表單**
- 主題輸入欄位（文字）
- 日期選擇器（Date Picker）
- 附加重點輸入欄位（多行文字，支援多個重點項目）
- 參考圖片上傳功能（可選，支援拖放或點擊上傳）
  
##### **風格選擇器**
- 下拉選單，包含以下預設風格選項：
  1. 賽博龐克
  2. 90年代動畫
  3. 手繪日系
  4. 水彩
  5. 高寫實
  6. 復古海報
  7. 霓虹風
- 使用者可選擇其中一種風格
  
##### **圖片生成與預覽**
- 點擊「生成」按鈕後，呼叫 nano-banana pro API 生成 3 張圖片
- 即時預覽 3 張生成的圖片
- 圖片內容包含（透過 AI prompt 控制）：
  - **主標題**：使用者輸入的主題（黑體字，文字過長時自動縮小字體，不換行）
  - **品牌名稱**：Skill Hub
  - **副標題**：Kemie, Ayn, 聖博老師の學習殿堂
  - **活動時間**：[使用者輸入日期] 晚上9:00-10:00（清晰明確）
  - **說明文字**：使用者輸入的附加重點
    
##### **Discord 發布功能**
- 選擇要發布的圖片（可多選）
- 支援多個 Discord 伺服器/頻道設定
- 發布時附帶以下格式的文字訊息：
  ```
  @everyone
  【活動通知】{主題} - {日期} 晚上9:00-10:00
  
  本次重點項目：
  {重點1}
  {重點2}
  {重點3}
  {重點4}
  ...
  
  歡迎大家一起來討論、交流經驗，一起進步！
  ```
- 顯示發布成功/失敗狀態

**🔄 P1 - 進階功能**

##### **歷史記錄功能**
- 儲存以下資訊到 Firestore：
  - 生成的圖片（Firebase Storage URL）
  - 使用者輸入的資料（主題、日期、重點、風格）
  - 生成時間（timestamp）
- 顯示歷史記錄列表
- 可選擇先前的設定重新生成圖片
- 下載圖片到本地（批次下載）

##### **Discord 伺服器管理**
- 新增/編輯/刪除 Discord 伺服器設定
- 每個設定包含：
  - 伺服器名稱（自訂）
  - Bot Token
  - Channel ID
- 發布時可選擇目標伺服器

#### 3. 設計要求：
- **視覺風格**：現代化、專業的 SaaS 風格
- **色彩方案**：
  - 主色調：深紫色 (#5865F2) - Discord 品牌色
  - 輔助色：霓虹藍 (#00D9FF)、霓虹粉 (#FF006E)
- **佈局**：
  - 桌面版：左側輸入表單區域，右側預覽區域（3 張圖片網格顯示）
  - 手機版：上方輸入表單，下方預覽區域
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
- 建立 React + Vite 專案
- 設定 Firebase 專案和服務
- 建立基本資料夾結構
- 設定環境變數

**第二階段：UI 開發**
- 建立設計系統（SASS 變數）
- 建立輸入表單組件
- 建立風格選擇器組件
- 建立圖片預覽組件
- 建立上傳組件
- 實作響應式佈局

**第三階段：核心功能開發**
- 整合 nano-banana pro API
- 實作參考圖片上傳到 Firebase Storage
- 實作圖片生成邏輯（包含 prompt 構建）
- 實作圖片命名和儲存

**第四階段：Discord 整合**
- 建立 Discord Bot
- 實作 Discord API 整合
- 實作多伺服器設定管理
- 實作發布功能（圖片 + 訊息）
- 錯誤處理和狀態回饋

**第五階段：進階功能**
- 實作歷史記錄（Firestore CRUD）
- 實作重新生成功能
- 實作批次下載功能

**第六階段：測試與部署**
- 功能測試
- 響應式測試
- 部署到 Firebase Hosting 或 Vercel

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
- **視覺風格**：根據使用者選擇的風格（下拉選單）
  - 賽博龐克
  - 90年代動畫
  - 手繪日系
  - 水彩
  - 高寫實
  - 復古海報
  - 霓虹風
- **色彩方案**：
  - 主色調：與 Skill Hub 品牌一致（深紫色系）
  - 根據參考圖片調整配色（如有上傳）
- **設計語言**：現代、專業、吸引眼球

#### 2. 內容元素：
- **主標題**：使用者輸入的主題
  - 字體：黑體字、粗體、醒目
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
  - 根據參考圖片生成類似風格（如有上傳）
  - 可包含抽象圖形、漸層、科技元素等

#### 3. 技術規格：
- **尺寸規格**：1080x1080（正方形，適合 Discord 和社群媒體）
- **圖片格式**：JPG
- **解析度**：72dpi（網頁用）
- **檔案大小限制**：≤ 500KB

---

### 【參考範例】
- 使用者上傳的參考圖片（可選）
- 如有上傳：使用 image-to-image 生成類似風格
- 如無上傳：使用 text-to-image 純文字生成
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

### nano-banana pro API
- **使用 API**：nano-banana pro
- **整合方式**：在 Firebase Functions 中呼叫 API
- **功能需求**：
  - 支援 text-to-image 生成
  - 支援 image-to-image（根據參考圖片生成類似風格）
  - 透過 prompt 控制風格和文字內容
  - 每次呼叫生成 3 張圖片（或呼叫 3 次）
  - API 回傳圖片後直接下載並儲存到 Firebase Storage

### Discord Bot 設定
- 需要建立 Discord Bot 並取得 Token
- Bot 需要有發送訊息和上傳圖片的權限
- 支援多個 Discord 伺服器/頻道
- 發布訊息格式：
  ```
  @everyone
  【活動通知】{主題} - {日期} 晚上9:00-10:00
  
  本次重點項目：
  {重點1}
  {重點2}
  {重點3}
  ...
  
  歡迎大家一起來討論、交流經驗，一起進步！
  ```

### 參考圖片處理
- 上傳到 Firebase Storage
- 取得圖片 URL 傳遞給圖片生成 API
- 使用 image-to-image 技術

---

## 四、已確認事項 ✅

### 1. **nano-banana pro API**
   - ✅ 使用者已有 API Key
   - ✅ 支援 image-to-image 功能
   - ✅ 使用下拉選單控制風格（7 種預設風格）
   - ✅ 每次生成 3 張圖片
   - ✅ API 回傳圖片後直接下載
   - 📌 **開發注意**：程式碼中需預留 API Key 設定位置（環境變數）

### 2. **Discord Bot 設定**
   - ✅ 使用者將建立 Discord Bot
   - ✅ 支援多個 Discord 伺服器/頻道
   - ✅ 發布時附帶特定格式的訊息
   - 📌 **開發注意**：程式碼中需預留多組 Bot Token 和 Channel ID 設定

### 3. **Firebase 專案**
   - ✅ 使用者將申請 Firebase 專案
   - ✅ 確認使用服務：Storage、Firestore、Functions、Hosting
   - 📌 **開發注意**：提供完整的 Firebase 設定範例

### 4. **風格推薦邏輯**
   - ✅ 使用下拉選單，不需要 AI 智能推薦
   - ✅ 7 種預設風格選項

### 5. **圖片文字排版**
   - ✅ 透過 AI prompt 控制，文字直接生成在圖片上
   - ✅ 使用黑體字

### 6. **圖片生成流程**
   - ✅ 參考圖片為可選
   - ✅ 有上傳：image-to-image
   - ✅ 無上傳：text-to-image

### 7. **歷史記錄功能**
   - ✅ 儲存圖片 URL、輸入資料、生成時間
   - ✅ 可重新生成先前的設定

### 8. **響應式設計**
   - ✅ 桌面版：左右佈局
   - ✅ 手機版：上下佈局

### 9. **開發工具**
   - ✅ Vite + React
   - ✅ 純 CSS/SASS

---

## 五、開發準備事項

### 環境變數設定（`.env.example`）
```env
# nano-banana pro API
VITE_NANO_BANANA_API_KEY=<your-nano-banana-api-key>

# Firebase Configuration
VITE_FIREBASE_API_KEY=<your-firebase-api-key>
VITE_FIREBASE_AUTH_DOMAIN=<your-project-id>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=<your-project-id>
VITE_FIREBASE_STORAGE_BUCKET=<your-project-id>.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
VITE_FIREBASE_APP_ID=<your-app-id>
```

### Discord 伺服器設定（儲存在 Firestore）
```json
{
  "servers": [
    {
      "id": "server_1",
      "name": "Skill Hub 主伺服器",
      "botToken": "<discord-bot-token>",
      "channelId": "<discord-channel-id>"
    },
    {
      "id": "server_2",
      "name": "測試伺服器",
      "botToken": "<discord-bot-token>",
      "channelId": "<discord-channel-id>"
    }
  ]
}
```

### 開發原則
1. 所有敏感資訊使用環境變數或 Firestore
2. 提供清晰的設定文檔和註解
3. 確保使用者只需填入相關 Key 和 ID 即可運行

---

## 六、詳細開發任務規劃

### **階段 1：專案初始化與環境設定** ⏱️ 30 分鐘

#### 任務清單：
- [ ] 使用 Vite 建立 React 專案
  ```bash
  npm create vite@latest discord-ad-generator -- --template react
  ```
- [ ] 安裝必要依賴套件
  - Firebase SDK
  - SASS
  - Discord.js（或使用 Webhook）
  - 其他工具庫（date-fns、axios 等）
- [ ] 建立專案資料夾結構
  ```
  src/
  ├── components/      # React 組件
  ├── services/        # API 服務（Firebase、nano-banana、Discord）
  ├── styles/          # SASS 樣式
  ├── utils/           # 工具函數
  ├── config/          # 設定檔
  └── App.jsx
  ```
- [ ] 設定 Firebase 專案
  - 建立 `.env.example`
  - 建立 Firebase 初始化檔案
- [ ] 建立 README.md 和基本文檔

**交付物**：可運行的空白 React 專案

---

### **階段 2：UI/UX 開發** ⏱️ 1.5-2 小時

#### 任務清單：

##### 2.1 設計系統建立
- [ ] 建立 SASS 變數檔（`_variables.scss`）
  - 顏色定義（Discord 紫、霓虹藍、霓虹粉等）
  - 字體定義
  - 間距定義
  - 斷點定義（響應式）
- [ ] 建立全域樣式（`global.scss`）
- [ ] 建立 mixins（響應式、動畫等）

##### 2.2 基礎組件開發
- [ ] `Button` 組件（主要按鈕、次要按鈕）
- [ ] `Input` 組件（文字輸入）
- [ ] `TextArea` 組件（多行文字）
- [ ] `DatePicker` 組件
- [ ] `Select` 組件（風格下拉選單）
- [ ] `FileUpload` 組件（拖放上傳）
- [ ] `Card` 組件（圖片預覽卡片）
- [ ] `Loading` 組件（生成中動畫）
- [ ] `Toast` 組件（成功/失敗提示）

##### 2.3 主要頁面佈局
- [ ] 建立主頁面組件（`HomePage.jsx`）
- [ ] 桌面版佈局
  - 左側：表單區域（40%）
  - 右側：預覽區域（60%）
- [ ] 手機版佈局
  - 上方：表單區域
  - 下方：預覽區域
- [ ] 響應式切換邏輯

##### 2.4 表單區域組件
- [ ] `InputForm` 組件
  - 主題輸入
  - 日期選擇
  - 重點輸入（支援多個項目）
  - 參考圖片上傳
  - 風格選擇下拉選單
  - 生成按鈕

##### 2.5 預覽區域組件
- [ ] `PreviewGrid` 組件
  - 3 張圖片網格顯示
  - 圖片選擇功能（checkbox）
  - 下載按鈕
  - 發布按鈕

**交付物**：完整的 UI 介面（靜態，無功能）

---

### **階段 3：核心功能開發 - 圖片生成** ⏱️ 2-2.5 小時

#### 任務清單：

##### 3.1 nano-banana pro API 整合
- [ ] 建立 API 服務檔（`services/nanoBananaService.js`）
- [ ] 實作 API 呼叫函數
  - `generateImages(prompt, style, referenceImage)`
  - 處理 text-to-image
  - 處理 image-to-image
- [ ] 實作 prompt 構建邏輯
  - 根據使用者輸入構建完整 prompt
  - 包含主題、日期、重點、品牌資訊
  - 根據風格調整 prompt
  - 指定黑體字
- [ ] 實作圖片下載和儲存
  - 下載 API 回傳的圖片
  - 儲存到 Firebase Storage
  - 生成圖片 URL

##### 3.2 Firebase Storage 整合
- [ ] 建立 Storage 服務檔（`services/firebaseStorage.js`）
- [ ] 實作參考圖片上傳函數
  - `uploadReferenceImage(file)`
  - 取得圖片 URL
- [ ] 實作生成圖片儲存函數
  - `saveGeneratedImage(imageBlob, filename)`
  - 使用命名規則：`[主題slug]_[日期時間].jpg`

##### 3.3 圖片生成邏輯
- [ ] 建立圖片生成流程
  1. 使用者點擊「生成」按鈕
  2. 驗證表單輸入
  3. 顯示 Loading 狀態
  4. 上傳參考圖片（如有）
  5. 構建 prompt
  6. 呼叫 nano-banana API（生成 3 張）
  7. 下載並儲存圖片到 Firebase Storage
  8. 顯示預覽
  9. 隱藏 Loading，顯示成功提示

##### 3.4 工具函數
- [ ] 建立 `utils/slugify.js`（主題轉 slug）
- [ ] 建立 `utils/formatDate.js`（日期格式化）
- [ ] 建立 `utils/promptBuilder.js`（prompt 構建）

**交付物**：可生成圖片並預覽的功能

---

### **階段 4：Discord 整合** ⏱️ 2-3 小時

#### 任務清單：

##### 4.1 Discord 伺服器設定管理
- [ ] 建立 Firestore 資料結構
  ```
  servers/
  ├── server_1
  │   ├── name: "Skill Hub 主伺服器"
  │   ├── botToken: "..."
  │   └── channelId: "..."
  └── server_2
      └── ...
  ```
- [ ] 建立設定管理頁面/組件
  - 新增伺服器
  - 編輯伺服器
  - 刪除伺服器
  - 列表顯示

##### 4.2 Discord API 整合
- [ ] 建立 Discord 服務檔（`services/discordService.js`）
- [ ] 實作發布函數
  - `postToDiscord(serverId, images, message)`
  - 使用 Discord.js 或 Webhook
  - 上傳圖片
  - 發送訊息
- [ ] 實作訊息格式化函數
  - 根據使用者輸入構建訊息
  - 格式：
    ```
    @everyone
    【活動通知】{主題} - {日期} 晚上9:00-10:00
    
    本次重點項目：
    {重點1}
    {重點2}
    ...
    
    歡迎大家一起來討論、交流經驗，一起進步！
    ```

##### 4.3 發布功能實作
- [ ] 建立發布流程
  1. 使用者選擇要發布的圖片
  2. 選擇目標 Discord 伺服器
  3. 點擊「發布」按鈕
  4. 顯示 Loading 狀態
  5. 呼叫 Discord API
  6. 顯示成功/失敗提示
- [ ] 錯誤處理
  - Bot Token 無效
  - Channel ID 無效
  - 網路錯誤
  - 權限不足

##### 4.4 Discord Bot 設定指南
- [ ] 建立 `docs/DISCORD_SETUP.md`
  - 如何建立 Discord Bot
  - 如何取得 Bot Token
  - 如何取得 Channel ID
  - 如何設定 Bot 權限

**交付物**：可發布圖片到 Discord 的功能

---

### **階段 5：進階功能（P1）** ⏱️ 2-3 小時

#### 任務清單：

##### 5.1 歷史記錄功能
- [ ] 建立 Firestore 資料結構
  ```
  history/
  ├── record_1
  │   ├── images: [url1, url2, url3]
  │   ├── input: { topic, date, points, style }
  │   └── createdAt: timestamp
  └── record_2
      └── ...
  ```
- [ ] 建立歷史記錄服務（`services/historyService.js`）
  - `saveHistory(data)`
  - `getHistory()`
  - `deleteHistory(id)`
- [ ] 建立歷史記錄組件
  - 列表顯示
  - 點擊查看詳情
  - 重新生成按鈕
  - 刪除按鈕

##### 5.2 重新生成功能
- [ ] 實作重新生成邏輯
  1. 從歷史記錄載入設定
  2. 填充表單
  3. 自動觸發生成

##### 5.3 下載功能
- [ ] 單張下載
  - 點擊圖片下載
- [ ] 批次下載
  - 選擇多張圖片
  - 打包成 ZIP
  - 下載

**交付物**：完整的歷史記錄和下載功能

---

### **階段 6：測試與部署** ⏱️ 1-2 小時

#### 任務清單：

##### 6.1 功能測試
- [ ] 測試圖片生成流程
- [ ] 測試 Discord 發布流程
- [ ] 測試歷史記錄功能
- [ ] 測試下載功能
- [ ] 測試錯誤處理

##### 6.2 響應式測試
- [ ] 桌面版測試（1920x1080、1366x768）
- [ ] 平板版測試（768x1024）
- [ ] 手機版測試（375x667、414x896）

##### 6.3 效能測試
- [ ] 測量首次載入時間
- [ ] 測量圖片生成時間
- [ ] Lighthouse 分數檢查

##### 6.4 部署
- [ ] 建立部署文檔（`docs/DEPLOYMENT.md`）
- [ ] 部署到 Firebase Hosting 或 Vercel
- [ ] 設定環境變數
- [ ] 測試線上版本

**交付物**：已部署的線上版本

---

## 七、時程預估

### MVP 版本（P0 功能）
- **總開發時間**：4-6 小時
- **建議時程**：1-2 天（含測試和調整）

### 完整版本（P0 + P1 功能）
- **總開發時間**：6-8 小時
- **建議時程**：2-3 天（含測試和調整）

### 分階段交付
- **第 1 天**：階段 1-2（專案初始化 + UI）
- **第 2 天**：階段 3-4（圖片生成 + Discord 整合）→ **MVP 完成**
- **第 3 天**：階段 5-6（進階功能 + 測試部署）→ **完整版完成**

---

## 八、下一步行動

✅ **規格已完整確認，準備開始開發！**

請確認：
1. 您是否已準備好 nano-banana pro API Key？
2. 您是否已建立 Firebase 專案？
3. 您希望我現在開始開發嗎？
4. 您偏好哪個開發方案？
   - **方案 A**：分階段開發（3 天，每天交付可測試版本）
   - **方案 B**：快速開發（1-2 天，直接完成 MVP）

確認後我將立即開始開發！🚀

  
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
