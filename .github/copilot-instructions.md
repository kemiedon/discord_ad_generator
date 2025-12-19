# GitHub Copilot 指示

## 專案規則

### 文件管理
- **禁止任意新增 Markdown 檔案**
  - 除非用戶明確要求，否則不要創建 .md 檔案
  - 不要創建總結報告、變更記錄等 Markdown 文件
  - 完成工作後直接回報結果即可，不需要創建文件記錄

### 程式碼規範
- 移除所有測試用的 `console.log` 和 `console.warn`
- 保留 `console.error` 用於生產環境錯誤追蹤
- 使用 `multi_replace_string_in_file` 進行多個獨立編輯操作以提高效率

### Git 提交
- 提交訊息使用 Conventional Commits 格式
- 中文描述變更內容
- 確保所有變更都經過測試

### 測試檔案
- 測試檔案命名：`test-*.js`
- 測試完成後應清理測試生成的圖片和檔案
- 不要將測試檔案提交到版本控制
