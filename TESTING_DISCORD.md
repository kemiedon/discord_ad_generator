# Discord 發布功能測試指南

## 前置準備

### 1. 確認環境變數已設定

檢查 `.env` 檔案中的 Discord Webhook URL：

```
VITE_DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/你的webhook_id/你的webhook_token
```

### 2. 重新啟動開發伺服器

修改 `.env` 後必須重新啟動：

```bash
# 停止目前的開發伺服器 (Ctrl + C)
# 重新啟動
npm run dev
```

## 測試流程

### 步驟 1: 填寫活動資訊

1. 開啟瀏覽器訪問 `http://localhost:5173`
2. 填寫以下欄位：
   - **活動主題**：例如「AI 工作坊」（必填）
   - **活動日期**：選擇日期（必填）
   - **重點項目**：每行一個重點（選填）
     ```
     學習 AI 基礎知識
     實作圖片生成
     分享經驗交流
     ```
   - **圖片風格**：選擇一種風格（必填）
   - **參考圖片**：可選擇上傳（選填）
   - **Discord Webhook URL**：應該自動填入環境變數的值

### 步驟 2: 生成圖片

1. 點擊「生成圖片」按鈕
2. 等待 30-60 秒
3. 系統會生成 4 張圖片

### 步驟 3: 選擇並發布

1. 點擊圖片左上角的核取方塊選擇要發布的圖片
2. 可以使用「全選」按鈕快速選擇所有圖片
3. 點擊「發布到 Discord」按鈕
4. 等待上傳完成

### 步驟 4: 檢查 Discord 頻道

前往你的 Discord 頻道，應該會看到：

1. `@everyone` 提及通知
2. 活動通知訊息，包含：
   - 活動主題
   - 日期時間
   - 重點項目列表（如果有填寫）
   - 歡迎訊息
3. 所有選擇的圖片附件

## 預期結果

### Discord 訊息格式

```
@everyone

【活動通知】AI 工作坊
📅 12/15 晚上9:00-10:00

✨ 本次重點項目：
1. 學習 AI 基礎知識
2. 實作圖片生成
3. 分享經驗交流

💬 歡迎大家一起來討論、交流經驗，一起進步！
```

### 圖片檔名格式

```
AI_工作坊_1.png
AI_工作坊_2.png
AI_工作坊_3.png
AI_工作坊_4.png
```

## 常見問題排除

### 1. Webhook URL 欄位是空的

**原因**：環境變數沒有載入  
**解決方法**：

- 確認 `.env` 檔案中有 `VITE_DISCORD_WEBHOOK_URL`
- 重新啟動開發伺服器
- 如果還是空的，可以手動輸入 Webhook URL

### 2. 顯示「Discord Webhook URL 格式不正確」

**原因**：URL 格式錯誤  
**正確格式**：`https://discord.com/api/webhooks/{數字ID}/{長字串token}`  
**解決方法**：

- 回到 Discord 伺服器設定重新複製 Webhook URL
- 確保 URL 完整複製（不要有多餘空格）

### 3. 顯示「Discord Webhook URL 無效」(404 錯誤)

**原因**：Webhook 已被刪除或 URL 錯誤  
**解決方法**：

- 到 Discord 伺服器檢查 Webhook 是否存在
- 如果被刪除，重新建立新的 Webhook

### 4. 發布失敗但沒有錯誤訊息

**檢查項目**：

1. 開啟瀏覽器的開發者工具 (F12)
2. 查看 Console 標籤的錯誤訊息
3. 查看 Network 標籤的請求詳情
4. 檢查 Discord Webhook 的權限設定

### 5. 圖片沒有上傳

**可能原因**：

- 圖片太大（Discord 限制 8MB）
- 網路連線問題
- Webhook 權限不足

**解決方法**：

- 檢查網路連線
- 確認 Webhook 有上傳檔案的權限
- 查看瀏覽器 Console 的詳細錯誤訊息

## 測試清單

完成以下測試項目：

- [ ] 只填必填欄位（不填重點項目）
- [ ] 填寫完整資訊（包含重點項目）
- [ ] 選擇 1 張圖片發布
- [ ] 選擇多張圖片發布
- [ ] 使用「全選」功能發布
- [ ] 上傳參考圖片後發布
- [ ] 檢查 Discord 訊息格式正確
- [ ] 檢查圖片正確顯示
- [ ] 檢查 @everyone 通知有效

## 開發者除錯

### 查看詳細 Log

開啟瀏覽器 Console (F12)，會看到：

```
開始發布到 Discord...
圖片數量: 2
Webhook URL: 已設定
訊息內容: @everyone
【活動通知】...
發送請求到 Discord Webhook...
✅ 發布成功！ 204
```

### 測試 Webhook URL 驗證

在瀏覽器 Console 執行：

```javascript
// 測試有效的 URL
validateWebhookUrl('https://discord.com/api/webhooks/123456789/abcdefg')
// 應該返回 true

// 測試無效的 URL
validateWebhookUrl('https://example.com/webhook')
// 應該返回 false
```

## 成功指標

✅ Discord 頻道收到通知  
✅ 訊息格式正確  
✅ 圖片完整上傳  
✅ @everyone 標籤有效  
✅ 發布後選取狀態清空  
✅ 瀏覽器顯示成功通知

## 下一步功能

- [ ] 歷史記錄功能（儲存到 Firestore）
- [ ] 多個 Discord 伺服器管理
- [ ] 批次下載功能
- [ ] 自訂發布時間
- [ ] 預約發布功能
