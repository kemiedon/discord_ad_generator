# Nano-Banana API 整合測試指南

## ✅ 完成事項

### 1. API 整合

- ✅ `.env` 檔案已建立（包含 API Keys）
- ✅ `nanoBananaService.js` 已更新，支援真實 API 呼叫
- ✅ 安裝 `react-hot-toast` 用於更好的通知系統
- ✅ `App.jsx` 已整合 Toast 通知
- ✅ `HomePage.jsx` 已更新使用 Toast 代替 alert

### 2. 環境配置

```
VITE_NANO_BANANA_API_KEY=AIzaSyDotfTdMPGqg7V0OJj__qAxHJCxvbdPUGA
VITE_FIREBASE_API_KEY=AIzaSyBUZo5K1iyG3FNt2h6qgxu2uDqPAO_dAx8
VITE_FIREBASE_PROJECT_ID=discord-ad-b9fef
...
```

---

## 🧪 測試步驟

### 1. 啟動開發伺服器

伺服器已在 `http://localhost:3000` 運行

### 2. 填寫表單

1. **活動主題**：輸入一個主題（例如："AI 工作坊"）
2. **活動日期**：選擇一個日期（使用 jQuery UI 日期選擇器）
3. **重點項目**：輸入 2-3 個重點（每行一個）
4. **圖片風格**：從下拉選單選擇一種風格
5. **參考圖片**（可選）：可以拖放或點擊上傳

### 3. 點擊「生成圖片」按鈕

- 會看到 Toast 通知："正在生成圖片，請稍候..."
- 等待 30-60 秒（API 可能較慢）
- 成功後會看到 3 張生成的圖片

### 4. 預覽和下載

- 点擊圖片可以檢視
- 點擊「下載」按鈕可以下載圖片
- 選擇圖片並點擊「發布到 Discord」（目前是演示）

---

## 🔍 API 呼叫詳情

### Nano-Banana API 配置

```javascript
{
  key: YOUR_API_KEY,
  prompt: '生成的 prompt...',
  model_id: 'flux-pro-1.0',
  num_images: 3,
  width: 1080,
  height: 1080,
  guidance_scale: 7.5,
  num_inference_steps: 50
}
```

### API 端點

- 生成：`https://api.nanobanana.ai/generate`
- 超時：120 秒

### Image-to-Image 支援

如果上傳參考圖片，會自動使用 image-to-image 模式：

```javascript
{
  ...payload,
  init_image_url: referenceImageUrl,
  strength: 0.8  // 0-1，越低越接近原始圖片
}
```

---

## 📋 測試用例

### 用例 1: 文字生成

**輸入：**

- 主題：AI 工作坊
- 日期：2025-11-25
- 重點：學習基礎知識、實作專案、分享經驗
- 風格：賽博龐克
- 參考圖片：無

**預期結果：**

- 生成 3 張圖片
- 圖片風格為賽博龐克
- 包含主題、日期、重點等文字

### 用例 2: 參考圖片生成

**輸入：**

- 上傳一張參考圖片
- 其他資訊同上

**預期結果：**

- 生成的圖片風格類似參考圖片
- 保持品牌配色一致

---

## 🐛 故障排查

### 問題 1: API Key 無效

**症狀：** 收到 "缺少 VITE_NANO_BANANA_API_KEY 環境變數"
**解決：** 檢查 `.env` 檔案是否正確設定

### 問題 2: 超時錯誤

**症狀：** 生成超過 120 秒未完成
**解決：** API 可能過載，稍後重試

### 問題 3: Firebase 錯誤

**症狀：** 上傳參考圖片失敗
**解決：** 檢查 Firebase 設定和網路連接

### 問題 4: CORS 錯誤

**症狀：** 瀏覽器控制台有 CORS 相關錯誤
**解決：** nano-banana API 應支援 CORS，檢查 API 狀態

---

## 📊 瀏覽器開發者工具調試

### 查看 API 請求

1. 打開 Chrome 開發者工具 (F12)
2. 進入 「Network」 標籤
3. 點擊「生成圖片」
4. 查看 `api.nanobanana.ai` 的請求詳情

### 查看 Console 日誌

1. 進入 「Console」 標籤
2. 會看到詳細的日誌：
   - "開始生成圖片..."
   - "呼叫 nano-banana API..."
   - "圖片生成成功，共 3 張"

---

## 🚀 下一步優化

1. **Firebase Functions 代理**

   - 在 Firebase Functions 中包裝 API 呼叫
   - 保護 API Key（目前暴露在客戶端）

2. **錯誤重試機制**

   - 添加自動重試邏輯
   - 支援中斷繼續

3. **進度追蹤**

   - 顯示生成進度百分比
   - 預估剩餘時間

4. **圖片預覽模態**

   - 點擊放大查看
   - 完整尺寸預覽

5. **歷史記錄**
   - 儲存生成記錄到 Firestore
   - 支援快速重新生成

---

## 📝 相關文件

- **nanoBananaService.js** - API 呼叫邏輯
- **HomePage.jsx** - 主頁邏輯
- **App.jsx** - Toast 通知設定
- **.env** - 環境變數
- **CODE_REVIEW.md** - 詳細代碼審查

---

**測試開始時間：2025-11-25**  
**測試環境：macOS + Comet 瀏覽器**  
**開發伺服器：http://localhost:3000**
