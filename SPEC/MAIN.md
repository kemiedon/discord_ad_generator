# 專案規格書

## Discord 廣告生成器 - 專案需求規格

根據 `PROMPT_GUIDE.md` 提示詞框架整理

---

## 一、Web 開發需求

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
- **UI 組件**：jQuery UI Datepicker（僅用於日期選擇器）
- **後端服務**：Firebase
  - Firebase Storage（儲存上傳的參考圖片和生成的圖片）
  - Firebase Firestore（儲存生成記錄和 Discord 伺服器設定）
  - Firebase Functions（處理圖片生成 API 呼叫）
- **響應式設計**：必須支援桌面、平板、手機
  - 桌面版：左右佈局（左側表單，右側預覽）
  - 手機版：上下佈局（上方表單，下方預覽）
- **部署**：Firebase Hosting 或 Vercel

**技術整合說明**：

- React 作為主要框架
- jQuery 和 jQuery UI 僅用於 Datepicker 組件
- 使用 useEffect 在 React 組件中初始化 jQuery UI Datepicker
- 其他組件使用 React 原生開發

#### 2. 功能需求（按優先級）：

**✅ P0 - 核心功能**

##### **輸入表單**

- 主題輸入欄位（文字）
- 日期選擇器（使用 jQuery UI Datepicker）
- 附加重點輸入欄位（多行文字，支援多個重點項目）
- 參考圖片上傳功能（可選，支援拖放或點擊上傳）

##### **風格選擇器**

- 下拉選單，包含以下預設風格選項：
  1. 賽博龐克
  2. 90 年代動畫
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
  - **活動時間**：[使用者輸入日期] 晚上 9:00-10:00（清晰明確）
  - **說明文字**：使用者輸入的附加重點
  - **文字可讀性保證**：
    - 背景需包含模糊區域或漸層色塊，確保文字清晰可讀
    - 若背景過於複雜，自動加上半透明矩形遮罩（白色或黑色，依明暗度決定）

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

#### 3. UX 設計規範：

基於業界最佳實踐，本專案採用以下 UX 設計原則：

##### **表單設計原則**

- **單欄佈局**：採用單欄設計，提供自然的上下閱讀流程，降低認知負擔
- **即時驗證**：
  - 當使用者完成欄位輸入或移動到下一欄位時，立即提供驗證回饋
  - 避免過早驗證（使用者開始輸入時就顯示錯誤）
  - 錯誤訊息清晰、具體，說明如何修正
  - 錯誤訊息顯示在欄位下方，保持可見直到錯誤修正
  - 使用紅色邊框標示錯誤欄位
- **清晰的標籤**：
  - 標籤位於輸入框上方，永不消失
  - 使用簡潔、無術語的文字
  - 必填欄位標示紅色星號（\*）
- **輔助說明**：
  - 在需要時提供範例或格式說明
  - 使用 placeholder 顯示輸入範例
- **按鈕設計**：
  - 主要動作按鈕（生成圖片）使用顯眼的顏色和大小
  - 按鈕文字描述具體動作（「生成圖片」而非「提交」）
  - Loading 狀態明確顯示，防止重複點擊

##### **漸進式揭露（Progressive Disclosure）**

- 採用單頁表單設計（因欄位數量適中，約 5 個主要欄位）
- 進階選項（如參考圖片上傳）設為可選，不強制填寫
- 生成結果後才顯示預覽和發布選項

##### **回饋機制**

- **Loading 狀態**：
  - 圖片生成時顯示動畫和進度提示
  - 使用「正在生成圖片，請稍候...」等友善文字
- **成功/失敗提示**：
  - 使用 Toast 通知或模態對話框
  - 成功：綠色提示，自動消失
  - 失敗：紅色提示，提供重試選項
- **視覺回饋**：
  - Hover 效果提示可互動元素
  - 點擊後提供視覺回饋（按鈕狀態變化）

##### **圖片生成工具特定 UX**

- **Prompt 輸入**：主要輸入欄位清晰可見，提供範例
- **風格選擇**：使用下拉選單，選項清晰分類
- **預覽展示**：
  - 3 張圖片以網格方式並排顯示
  - 支援點擊放大查看
  - 提供選擇框供使用者選擇要發布的圖片
- **迭代優化**：
  - 提供「重新生成」按鈕
  - 保留使用者輸入，方便微調後再次生成

##### **行動裝置優化**

- 觸控友善：按鈕和輸入框最小尺寸 44x44px
- 避免過多滾動：手機版採用上下佈局，分段呈現
- 使用原生日期選擇器（在行動裝置上）

#### 4. 設計要求：

- **視覺風格**：現代化、專業的 SaaS 風格
- **色彩方案**：
  - 主色調：深紫色 (#5865F2) - Discord 品牌色
  - 輔助色：霓虹藍 (#00D9FF)、霓虹粉 (#FF006E)
- **佈局**：
  - 桌面版：左側輸入表單區域（固定寬度 400px），右側預覽區域（彈性寬度）
  - 手機版：上方輸入表單，下方預覽區域
- **動畫效果**：
  - 圖片生成時的 Loading 動畫
  - Hover 效果
  - 平滑的過渡效果（使用 CSS transitions）

---

### 【技術約束】

- **瀏覽器支援**：Chrome、Firefox、Safari、Edge（最新版本）
- **效能要求**：
  - 首次載入時間 < 3 秒
  - 圖片生成時間 < 10 秒（3 張）
- **SEO 需求**：基本的 meta tags 和 Open Graph 標籤
- **無障礙**：基本的鍵盤導航支援

---

### 【開發階段】

**第一階段：專案初始化**

- 建立 React + Vite 專案
- 安裝 jQuery 和 jQuery UI 依賴
- 設定 Firebase 專案和服務
- 建立基本資料夾結構
- 設定環境變數

**第二階段：UI 開發**

- 建立 React 組件結構
- 實作 SASS 樣式（包含響應式）
- 建立輸入表單組件
- 整合 jQuery UI Datepicker（使用 useEffect）
- 建立圖片預覽組件
- 實作拖放上傳組件

**第三階段：核心功能開發**

- 整合 nano-banana pro API
- 實作參考圖片上傳到 Firebase Storage
- 實作圖片生成邏輯（包含 prompt 構建）
- 實作圖片命名和儲存
- 實作表單驗證

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
- **文字可讀性為首要考量**

---

### 【設計需求】

#### 1. 風格定義：

- **視覺風格**：根據使用者選擇的風格（下拉選單）
  - 賽博龐克
  - 90 年代動畫
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

##### **文字可讀性保證（重要）**

- **背景處理**：
  - 生成的圖片必須包含模糊區域或漸層色塊，作為文字放置區域
  - 模糊區域可以是：
    - 高斯模糊背景
    - 漸層色塊（從透明到半透明）
    - 純色區塊（與主題風格協調）
- **自動遮罩**：
  - 若背景過於複雜或對比度不足，自動加上半透明矩形遮罩
  - 遮罩顏色選擇：
    - 深色背景 → 使用白色半透明遮罩（rgba(255, 255, 255, 0.8)）
    - 淺色背景 → 使用黑色半透明遮罩（rgba(0, 0, 0, 0.7)）
  - 遮罩應覆蓋所有文字區域，確保文字清晰可讀

##### **文字內容與排版**

- **主標題**：使用者輸入的主題
  - 字體：黑體字、粗體、醒目
  - 排版規則：文字過長時縮小字體，不換行
  - 位置：圖片上方或中央
  - 顏色：根據背景自動調整（深色背景用白色，淺色背景用黑色）
- **品牌名稱**：Skill Hub
  - 字體：品牌字體
  - 位置：顯眼位置（建議左上角或右上角）
- **副標題**：Kemie, Ayn, 聖博老師の學習殿堂
  - 字體：次要字體
  - 位置：主標題下方
- **活動時間**：[日期] 晚上 9:00-10:00
  - 字體：清晰、明確
  - 格式：例如「2025-11-25 晚上 9:00-10:00」
  - 位置：圖片下方或時間區塊
- **說明文字**：使用者輸入的附加重點
  - 字體：可讀性高的字體
  - 位置：圖片中下方或側邊
- **背景元素**：
  - 根據參考圖片生成類似風格（如有上傳）
  - 可包含抽象圖形、漸層、科技元素等
  - **必須確保有足夠的模糊或漸層區域供文字放置**

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
  - **Prompt 必須包含文字可讀性指令**：
    - 要求背景包含模糊區域或漸層
    - 若背景複雜，加上半透明遮罩
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

### 1. **技術棧**

- ✅ 使用 React.js + Vite
- ✅ jQuery UI Datepicker（僅用於日期選擇器）
- ✅ 純 CSS/SASS 樣式
- ✅ Firebase 後端服務
- 📌 **開發注意**：React 為主要框架，jQuery UI 僅用於 Datepicker 組件

### 2. **nano-banana pro API**

- ✅ 使用者已有 API Key
- ✅ 支援 image-to-image 功能
- ✅ 使用下拉選單控制風格（7 種預設風格）
- ✅ 每次生成 3 張圖片
- ✅ API 回傳圖片後直接下載
- ✅ **文字可讀性為首要考量**
- 📌 **開發注意**：Prompt 必須包含背景模糊/遮罩指令

### 3. **Discord Bot 設定**

- ✅ 使用者將建立 Discord Bot
- ✅ 支援多個 Discord 伺服器/頻道
- ✅ 發布時附帶特定格式的訊息
- 📌 **開發注意**：程式碼中需預留多組 Bot Token 和 Channel ID 設定

### 4. **Firebase 專案**

- ✅ 使用者將申請 Firebase 專案
- ✅ 確認使用服務：Storage、Firestore、Functions、Hosting
- 📌 **開發注意**：提供完整的 Firebase 設定範例

### 5. **UX 設計**

- ✅ 採用單頁表單設計（欄位數量適中）
- ✅ 即時驗證，清晰錯誤訊息
- ✅ 漸進式揭露（進階選項可選）
- ✅ 行動裝置優化
- 📌 **開發注意**：遵循業界最佳實踐

### 6. **圖片生成**

- ✅ 背景必須包含模糊區域或漸層色塊
- ✅ 複雜背景自動加上半透明遮罩
- ✅ 文字顏色根據背景明暗度自動調整
- 📌 **開發注意**：Prompt 構建時必須包含這些指令

### 7. **風格選擇**

- ✅ 使用下拉選單，不需要 AI 智能推薦
- ✅ 7 種預設風格選項

### 8. **圖片文字排版**

- ✅ 透過 AI prompt 控制，文字直接生成在圖片上
- ✅ 使用黑體字

### 9. **圖片生成流程**

- ✅ 參考圖片為可選
- ✅ 有上傳：image-to-image
- ✅ 無上傳：text-to-image

### 10. **歷史記錄功能**

- ✅ 儲存圖片 URL、輸入資料、生成時間
- ✅ 可重新生成先前的設定

### 11. **響應式設計**

- ✅ 桌面版：左右佈局
- ✅ 手機版：上下佈局

---

## 五、開發準備事項

### 環境變數設定（`.env.example`）

```env
# nano-banana pro API
NANO_BANANA_API_KEY=<your-nano-banana-api-key>

# Firebase Configuration
FIREBASE_API_KEY=<your-firebase-api-key>
FIREBASE_AUTH_DOMAIN=<your-project-id>.firebaseapp.com
FIREBASE_PROJECT_ID=<your-project-id>
FIREBASE_STORAGE_BUCKET=<your-project-id>.appspot.com
FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
FIREBASE_APP_ID=<your-app-id>
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
4. 遵循 UX 最佳實踐
5. 優先考慮文字可讀性

---

## 六、Prompt 構建範例

### 基本 Prompt 結構

```
Create a Discord event promotional image in [STYLE] style.

Content Requirements:
- Main Title: "[TOPIC]" (bold, sans-serif font, adjust size if text is long, no line breaks)
- Brand: "Skill Hub"
- Subtitle: "Kemie, Ayn, 聖博老師の學習殿堂"
- Event Time: "[DATE] 晚上9:00-10:00" (clear and prominent)
- Key Points: [POINTS]

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
- Style: [SELECTED_STYLE]
```

### 風格對應 Prompt 關鍵字

- 賽博龐克 → "cyberpunk"
- 90 年代動畫 → "90s anime style"
- 手繪日系 → "hand-drawn Japanese illustration"
- 水彩 → "watercolor painting"
- 高寫實 → "photorealistic"
- 復古海報 → "retro poster design"
- 霓虹風 → "neon style"

---

## 七、時程預估

### MVP 版本（P0 功能）

- **總開發時間**：6-8 小時（jQuery 開發較 React 簡單直接）
- **建議時程**：1-2 天（含測試和調整）

### 完整版本（P0 + P1 功能）

- **總開發時間**：8-10 小時
- **建議時程**：2-3 天（含測試和調整）

### 分階段交付

- **第 1 天**：階段 1-2（專案初始化 + UI）
- **第 2 天**：階段 3-4（圖片生成 + Discord 整合）→ **MVP 完成**
- **第 3 天**：階段 5-6（進階功能 + 測試部署）→ **完整版完成**

---

## 八、開發歷史記錄

### 2025-11-25 - Gemini API 整合與測試

#### 執行的指令順序

**1. 專案初始檢查**

```bash
# 查看專案結構
ls -la

# 檢查環境變數
ls -la | grep -E "^-.*\.env"

# 啟動開發伺服器
npm run dev
```

**2. API 測試與除錯**

```bash
# 安裝必要套件
npm install @google/genai
npm install dotenv

# 測試不同的 Gemini 模型
node test-api.js
node test-gemini-api.mjs
node test-gemini-models.mjs
node test-image-models.mjs

# 測試完整流程
node test-full-flow.mjs
node test-new-model.mjs
```

**3. 清理測試文件**

```bash
# 清理測試腳本
rm -f test-*.js test-*.mjs

# 清理測試圖片
rm -f *.png

# 查看生成的圖片大小
ls -lh *.png
ls -lh gemini-*.png discord-ad-*.png 2>/dev/null | awk '{print $5, $9}' | sort
```

**4. Git 版本控制**

```bash
# 查看當前狀態
git status

# 添加所有變更
git add .

# 提交變更
git commit -m "feat: 整合 Gemini API 圖片生成功能

- 實作 nanoBananaService.js 使用 @google/genai SDK
- 使用 gemini-3-pro-image-preview 模型
- 完成 API 測試，生成圖片成功
- 更新 promptBuilder 構建提示詞
- 添加錯誤處理和日誌輸出
- 更新依賴：@google/genai, dotenv"

# 推送到遠端
git push origin master
```

#### 主要變更文件

**新增文件**

- `src/services/nanoBananaService.js` - Gemini API 服務
- `src/services/firebaseStorage.js` - Firebase Storage 服務
- `src/utils/promptBuilder.js` - Prompt 構建工具
- `SPEC/CODE_REVIEW_20251125.md` - 代碼審查文檔
- `SPEC/TESTING_GUIDE_20251125.md` - 測試指南

**修改文件**

- `package.json` - 添加 @google/genai, dotenv 依賴
- `src/services/nanoBananaService.js` - 實作 Gemini API 整合
- `src/components/HomePage/HomePage.jsx` - 整合圖片生成流程
- `src/App.jsx` - 添加 Toast 通知
- `.env.example` - 更新環境變數範例
- `.gitignore` - 添加測試文件忽略規則

#### 測試結果

**模型測試**

- ✅ `gemini-2.5-flash-image` - 成功 (圖片 1.7-1.8 MB)
- ✅ `gemini-3-pro-image-preview` - 成功 (圖片 0.8-1.0 MB) ⭐ 當前使用
- ❌ `gemini-2.0-flash-exp` - 僅返回文字
- ❌ `imagen-3.0-generate-001` - 404 錯誤

**API 測試統計**

- 成功率: 100% (3/3 圖片)
- 平均生成時間: 5-8 秒/張
- 圖片格式: PNG (base64 Data URL)
- 圖片大小: 0.8-1.0 MB

#### 技術實作細節

**使用的技術棧**

- React 18 + Vite
- Google GenAI SDK (@google/genai)
- Firebase (Storage, Firestore)
- SASS for styling
- React Hot Toast for notifications

**API 配置**

- 服務：nano-banana pro (Gemini)
- 模型：`gemini-3-pro-image-preview`
- 每次生成：3 張圖片
- 輸出格式：base64 Data URL
- 圖片規格：1080x1080px 正方形

#### 後續開發任務

- [ ] 實作參考圖片功能
- [ ] 實作 Discord Bot 發布功能
- [ ] 添加歷史記錄功能
- [ ] 優化圖片大小和載入速度
- [ ] 添加批次下載功能
