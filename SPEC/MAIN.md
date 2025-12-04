# 專案規格書

## Discord 廣告生成器 - 專案需求規格

根據 `PROMPT_GUIDE.md` 提示詞框架整理

**目前版本**: v5.1.0  
**最後更新**: 2025-12-05

---

## 📑 目錄

1. [專案概述](#專案概述)
2. [UI/UX 設計規範](#uiux-設計規範)
3. [技術需求](#技術需求)
4. [圖片生成需求](#圖片生成需求)
5. [技術整合需求](#技術整合需求)
6. [環境設定](#環境設定)
7. [版本更新記錄](#版本更新記錄)
8. [開發歷史詳細記錄](#開發歷史詳細記錄)

---

## 專案概述

### 專案基本資訊

- **專案名稱**：Discord 廣告生成器（Discord Ad Generator）
- **目的**：提供一個線上工具，讓使用者輸入活動主題、日期和重點說明，自動生成符合品牌風格的 Discord 社群宣傳圖片，並可直接發布到指定的 Discord 聊天區
- **目標用戶群**：
  - Skill Hub 社群管理員
  - 「Kemie, Ayn, 聖博老師の學習殿堂」課程講師
  - 需要定期發布活動宣傳的社群經營者
- **核心功能**：使用者輸入活動資訊後，系統根據選定風格和參考圖片生成 4 張預覽圖，確認後可直接發布到 Discord

### 當前開發狀態

**✅ 已完成功能（P0 核心功能）**

- 圖片生成（text-to-image 和 image-to-image）
- 4 種風格選項（賽博龐克、Pixel 遊戲、高寫實照片、復古海報）
- 每次生成 4 張圖片
- 參考圖片上傳功能
- 圖片生成進度條顯示
- Discord Webhook 發布功能
- 發布前預覽與訊息編輯
- 歷史記錄（彈出視窗）
- Webhook 預設選項管理
- 圖片壓縮與縮圖生成
- Firebase Firestore 整合
- 響應式設計（桌面 + 手機）

**🔄 待完成功能（P1 進階功能）**

- 多 Discord 伺服器管理（儲存多組 Webhook URL）
- 批次下載功能（下載所有生成的圖片為 ZIP）
- 圖片編輯功能（裁切、調整大小、濾鏡效果）
- 快取機制（減少 API 調用）
- PWA 支援（離線功能）
- 深色模式切換
- 多語言支援（i18n）

---

## UI/UX 設計規範

### 設計理念

採用「復古遊戲」(Retro Gaming) 風格，融合 80 年代街機與 8-bit 遊戲美學，使用柔和的復古色調而非刺眼的霓虹效果。所有介面元素採用**直角設計**（無圓角），強調像素化的復古質感。

---

### 🎨 視覺設計系統

#### 色彩系統

**主色調**

- **背景深色**: `#1a1a2e` - 深海軍藍
- **容器背景**: `rgba(49, 54, 56, 0.5)` - 半透明深灰
- **表單輸入背景**: `#222034` - 深紫灰
- **邊框顏色**: `#313638` - 深灰色

**強調色**

- **黃色 (主要)**: `#f8b700` - 金黃色，用於標題、focus 狀態、主要按鈕
- **藍色 (次要)**: `#29adff` - 天藍色，用於標籤、邊框、次要按鈕
- **紅色 (強調)**: `#ff6b6b` - 珊瑚紅，用於漸層、按鈕邊框
- **粉紅色 (錯誤)**: `#ff004d` - 亮粉紅，用於錯誤提示、刪除按鈕
- **青綠色 (成功)**: `#4ecdc4` - 土耳其藍，用於成功狀態
- **深青綠**: `#45b8b0` - 用於成功按鈕邊框

**文字顏色**

- **主要文字**: `#ffffff` - 白色
- **標籤文字**: `#29adff` - 天藍色
- **次要文字**: `rgba(255, 255, 255, 0.4)` - 半透明白色 (placeholder)
- **Loading 文字**: `#f8b700` - 金黃色，粗體

#### 字體系統

**主要字體**

- **中文/介面**: `'Noto Sans TC'` (思源黑體)
- **圖標**: `'Font Awesome 6 Free'` (版本 6.5.1)
- **程式碼**: `'Courier New', monospace`

**字級層級**

- 超大標題: `$font-size-3xl`
- 大標題: `$font-size-2xl` - 用於頁面標題
- 中標題: `$font-size-xl`
- 基本: `$font-size-base` - 用於按鈕、輸入框、Loading 文字
- 小字: `$font-size-sm` - 用於標籤
- 極小: `$font-size-xs`

#### 圖標系統

**來源與版本**

- **CDN**: Font Awesome 6.5.1 Free
- **載入位置**: `index.html` 的 `<head>` 區塊

**使用的圖標**

- **導航**: `fa-chevron-left`, `fa-chevron-right` (日期選擇器)
- **操作**: `fa-sync-alt` (重新整理), `fa-trash-alt` (清空全部), `fa-trash` (刪除單項), `fa-times` (關閉)
- **表單**: 自訂 SVG 下拉箭頭（天藍色）

**圖標顏色**

- 預設: `#29adff` (天藍色)
- Hover: `#f8b700` (金黃色)
- 錯誤/刪除: `#ff004d` (粉紅色)

#### 邊框系統

**統一規範**

- **標準粗細**: `3px` - 適用於所有元件（按鈕、輸入框、容器、卡片）
- **邊框樣式**: 實線 (solid)
- **圓角**: `0` (完全直角，無圓角)

**特殊情況**

- **Focus 外框**: `0 0 0 3px rgba(248, 183, 0, 0.1)` - 金黃色半透明
- **選中外框**: `0 0 0 3px #f8b700` - 實心金黃色外框
- **虛線邊框**: 僅用於 FileUpload 拖曳區域

---

### 🧩 組件設計規範

#### 按鈕設計

**統一規範**

- **形狀**: 直角矩形 (`border-radius: 0`)
- **邊框粗細**: `3px`
- **文字顏色**: 白色 (`#ffffff`)
- **字體粗細**: `bold` (700)
- **懸停效果**: 輕微位移 + 顏色變化
- **禁用狀態**: 50% 透明度
- **過渡時間**: 0.3s

**按鈕類型**

**Primary (主要按鈕)**

```scss
background: linear-gradient(135deg, #f8b700 0%, #ff6b6b 100%);
border: 3px solid #ff6b6b;
box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);

&:hover {
  background: linear-gradient(135deg, #ff6b6b 0%, #f8b700 100%);
  border-color: #f8b700;
  transform: translateY(-2px);
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.3);
}

&:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.3);
}
```

- 用於: 生成圖片、確認發布

**Secondary (次要按鈕)**

```scss
background: rgba(49, 54, 56, 0.6);
border: 3px solid #29adff;

&:hover {
  background: rgba(41, 173, 255, 0.1);
  border-color: #f8b700;
}
```

- 用於: 歷史記錄、取消操作

**Success (成功按鈕)**

```scss
background: #4ecdc4;
border: 3px solid #45b8b0;

&:hover {
  background: #3db3ab;
  border-color: #29adff;
  transform: translateY(-2px);
}
```

- 用於: 確認、載入歷史記錄

**Danger (危險按鈕)**

```scss
background: #ff004d;
border: 3px solid #cc003d;

&:hover {
  background: #cc003d;
  border-color: #ff6b6b;
  transform: translateY(-2px);
}
```

- 用於: 刪除、清除

**Loading 狀態**

```scss
&--loading {
  position: relative;
  pointer-events: none;
  opacity: 0.7;
}
```

- **設計理念**: 按下後保持 enabled 外觀，僅降低透明度
- **無 spinner**: 不顯示旋轉載入圖標
- **互動**: 禁用點擊但保持視覺一致性
- **恢復**: 生成完畢後恢復完整透明度與互動

#### 表單元件設計

**Input**

```scss
background: #222034;
border: 3px solid #313638;
border-radius: 0;
color: #fff;

&:focus {
  border-color: #f8b700;
  box-shadow: 0 0 0 3px rgba(248, 183, 0, 0.1);
}

&::placeholder {
  color: rgba(255, 255, 255, 0.4);
}
```

**TextArea**

```scss
background: #222034;
border: 3px solid #313638;
border-radius: 0;
min-height: 120px;
resize: vertical;

&:focus {
  border-color: #f8b700;
  box-shadow: 0 0 0 3px rgba(248, 183, 0, 0.1);
}
```

**Select (下拉選單)**

```scss
background: #222034;
border: 3px solid #313638;
border-radius: 0;
appearance: none;
background-image: url('data:image/svg+xml,...'); // 天藍色箭頭

&:focus {
  border-color: #f8b700;
  box-shadow: 0 0 0 3px rgba(248, 183, 0, 0.1);
}

option {
  background: #222034;
  color: #fff;

  &:checked {
    background: #29adff;
    color: #1a1a2e;
  }
}
```

**已知限制**: 原生 `<option>` 下拉選單的某些樣式（如圓角）受作業系統控制，CSS 無法完全覆蓋。若需完整自訂，需使用 React Select 或自訂 JavaScript 組件。

**File Upload**

```scss
border: 3px dashed #313638;
background: #222034;
border-radius: 0;

&:hover {
  border-style: solid;
  border-color: #f8b700;
}

&--dragging {
  background: rgba(248, 183, 0, 0.1);
  border-color: #f8b700;
}
```

#### 卡片與容器

**Card**

```scss
background: rgba(49, 54, 56, 0.5);
border: 3px solid #313638;
border-radius: 0;
padding: $spacing-lg;

&:hover {
  border-color: #f8b700;
  box-shadow: 0 0 0 3px rgba(248, 183, 0, 0.1);
  transform: translateY(-2px);
}
```

**InputForm**

```scss
background: rgba(49, 54, 56, 0.5);
border: 3px solid #313638;
border-radius: 0;
padding: $spacing-lg;

&__title {
  color: #f8b700;
  border-bottom: 3px solid #29adff;
  font-weight: 700;
}
```

**PreviewGrid Header**

```scss
background: rgba(49, 54, 56, 0.5);
border: 3px solid #313638;
border-radius: 0;
padding: $spacing-md $spacing-lg;
```

**圖片卡片**

```scss
border: 3px solid #313638;
border-radius: 0;
background: rgba(49, 54, 56, 0.3);

&--selected {
  border: 3px solid #f8b700;
  box-shadow: 0 0 0 3px #f8b700;
}

&:hover {
  border-color: #29adff;
  transform: translateY(-2px);
}
```

#### Loading 組件

**Spinner 設計**

```scss
background: rgba(49, 54, 56, 0.5);
border: 3px solid #313638;
border-radius: 0;
padding: $spacing-2xl;

&__spinner {
  border-radius: 0; // 方形
  border: 3px solid rgba(41, 173, 255, 0.3);
  border-top-color: #29adff;
  border-right-color: #29adff;
  animation: spin 0.8s linear infinite;

  &--small {
    width: 24px;
    height: 24px;
  }
  &--medium {
    width: 40px;
    height: 40px;
  }
  &--large {
    width: 60px;
    height: 60px;
  }
}

&__text {
  color: #f8b700;
  font-weight: bold;
}
```

#### 日期選擇器 (Datepicker)

**jQuery UI Datepicker 自訂樣式**

```scss
.ui-datepicker {
  background: #222034;
  border: 3px solid #313638;
  border-radius: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 9999;
}

.ui-datepicker-header {
  background: #313638;
  border: none;
  border-radius: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .ui-datepicker-title {
    color: #f8b700;
    font-weight: bold;
    flex: 1;
    text-align: center;
    order: 2;
  }

  .ui-datepicker-prev,
  .ui-datepicker-next {
    position: relative;
    width: 24px;
    height: 24px;
    border: 3px solid #29adff;
    border-radius: 0;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    .ui-icon {
      display: none; // 隱藏 jQuery UI 原生圖標
    }

    &:after {
      font-family: 'Font Awesome 6 Free';
      font-weight: 900;
      color: #29adff;
      font-size: 12px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    &:hover {
      background: rgba(41, 173, 255, 0.2);
      border-color: #f8b700;
    }
  }

  .ui-datepicker-prev {
    order: 1;
    &:after {
      content: '\f053';
    } // fa-chevron-left
  }

  .ui-datepicker-next {
    order: 3;
    &:after {
      content: '\f054';
    } // fa-chevron-right
  }
}

.ui-datepicker-calendar {
  thead th {
    color: #29adff;
    font-weight: bold;
  }

  tbody td a {
    background: #1a1a2e;
    border: 3px solid #313638;
    border-radius: 0;
    color: #ffffff;

    &:hover {
      background: #29adff;
      border-color: #29adff;
    }
  }

  .ui-state-highlight {
    background: #f8b700;
    color: #1a1a2e;
    font-weight: bold;
  }

  .ui-state-active {
    background: #29adff;
    color: #1a1a2e;
  }
}
```

**技術重點**:

- 使用 Flexbox 實現左箭頭、標題、右箭頭同行排列
- 圖標使用 `:after` 偽元素配合 Font Awesome
- 絕對定位 + `transform: translate(-50%, -50%)` 實現完美置中
- 按鈕使用 `position: relative` 作為定位基準

---

### 🎯 佈局與響應式設計

#### 版面配置

**桌面版 (768px 以上)**

```scss
&__container {
  display: flex;
  gap: $spacing-2xl;

  &__form-section {
    flex: 0 0 45%;
  }

  &__preview-section {
    flex: 1;
  }
}
```

- 左右並排布局
- 左側表單: 45% 固定寬度
- 右側預覽: 自動填充剩餘空間
- 間距: `$spacing-2xl`

**手機版 (767px 以下)**

```scss
&__container {
  flex-direction: column;
  gap: $spacing-xl;

  &__form-section,
  &__preview-section {
    flex: 1 1 100%;
  }
}
```

- 上下堆疊布局
- 表單與預覽各佔 100% 寬度
- 縮小間距與 padding

**預覽網格**

```scss
// 桌面版: 2 欄顯示
grid-template-columns: repeat(2, 1fr);
gap: $spacing-lg;

// 手機版: 1 欄顯示
@include mobile {
  grid-template-columns: 1fr;
}
```

#### 響應式斷點

```scss
// 手機版
@mixin mobile {
  @media (max-width: 767px) {
    @content;
  }
}

// 桌面版
@media (min-width: 768px) {
  // 維持並排布局
}
```

---

### 🎬 動畫與過渡效果

#### 保留的動畫

**Spinner 旋轉**

```scss
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

- 用於: Loading spinner
- 速度: 0.8s

**按鈕過渡**

```scss
transition: all 0.3s ease;
```

- 懸停: 顏色、位移、邊框變化
- 點擊: 向下按壓效果

#### 移除的效果

- ❌ 霓虹發光 (glow/text-shadow with blur)
- ❌ 背景網格動畫 (gridFloat)
- ❌ 旋轉邊框動畫 (rotateBorder)
- ❌ 光澤動畫 (shine)
- ❌ 按鈕掃描線效果
- ❌ 脈衝動畫 (pulse)
- ❌ Logo 旋轉效果

---

### 🎨 主題元素

#### 標題樣式

**Header 主標題**

```scss
color: #f8b700;
font-size: $font-size-2xl;
font-weight: 700;
text-shadow: 3px 3px 0 #ff004d;
```

**Header 副標題**

```scss
color: #29adff;
font-size: $font-size-sm;
```

**表單標題**

```scss
color: #f8b700;
font-size: $font-size-2xl;
font-weight: 700;
border-bottom: 3px solid #29adff;
```

#### 背景設計

**主背景**

```scss
background: #1a1a2e;
background-image: repeating-linear-gradient(
  0deg,
  transparent,
  transparent 2px,
  rgba(78, 205, 196, 0.03) 2px,
  rgba(78, 205, 196, 0.03) 4px
);
```

- 底色: 深海軍藍
- 圖案: 細微的青綠色格線，創造復古像素網格感
- 無動畫: 保持靜態背景

**裝飾元素**

- ❌ 不使用發光效果 (glow)
- ❌ 不使用霓虹色彩
- ❌ 移除動態漸層動畫
- ✅ 保持簡潔的靜態背景

#### Logo 與品牌

**Logo 樣式**

```scss
width: 80px;
height: 80px;
background: rgba(255, 255, 255, 0.95);
border: 3px solid #f8b700;
border-radius: 0; // 直角
box-shadow: 0 0 0 3px #313638, 0 0 0 6px #f8b700; // 雙層邊框

&:hover {
  transform: scale(1.1); // 僅放大，無旋轉
}
```

**Footer**

```scss
color: #29adff;
border-top: 3px solid #f8b700;
background: rgba(26, 26, 46, 0.5);
```

---

### ♿ 無障礙設計

#### Focus 狀態

```scss
&:focus {
  outline: none;
  border-color: #f8b700;
  box-shadow: 0 0 0 3px rgba(248, 183, 0, 0.1);
}
```

#### 顏色對比

- 文字與背景對比度 ≥ 4.5:1 (WCAG AA)
- 主要操作按鈕使用高對比色
- 錯誤訊息使用明顯的紅色標示

#### 互動提示

- 按鈕 disabled 狀態有視覺反饋
- Loading 狀態保持視覺一致性
- Hover 狀態有明確變化

---

### 📱 用戶體驗設計原則

#### 表單設計原則

**單欄佈局**

- 採用單欄設計，提供自然的上下閱讀流程
- 降低認知負擔

**即時驗證**

- 當使用者完成欄位輸入或移動到下一欄位時，立即提供驗證回饋
- 避免過早驗證（使用者開始輸入時就顯示錯誤）
- 錯誤訊息清晰、具體，說明如何修正
- 錯誤訊息顯示在欄位下方，保持可見直到錯誤修正
- 使用紅色邊框標示錯誤欄位

**清晰的標籤**

- 標籤位於輸入框上方，永不消失
- 使用簡潔、無術語的文字
- 必填欄位標示紅色星號（\*）

**輔助說明**

- 在需要時提供範例或格式說明
- 使用 placeholder 顯示輸入範例

**按鈕設計**

- 主要動作按鈕（生成圖片）使用顯眼的顏色和大小
- 按鈕文字描述具體動作（「生成圖片」而非「提交」）
- Loading 狀態明確顯示，防止重複點擊

#### 漸進式揭露

- 採用單頁表單設計（因欄位數量適中，約 5 個主要欄位）
- 進階選項（如參考圖片上傳）設為可選，不強制填寫
- 生成結果後才顯示預覽和發布選項

#### 回饋機制

**Loading 狀態**

- 圖片生成時顯示動畫和進度提示
- 使用「正在生成圖片，請稍候...」等友善文字

**成功/失敗提示**

- 使用 Toast 通知或模態對話框
- 成功：綠色提示，自動消失
- 失敗：紅色提示，提供重試選項

**視覺回饋**

- Hover 效果提示可互動元素
- 點擊後提供視覺回饋（按鈕狀態變化）

#### 圖片生成工具特定 UX

**Prompt 輸入**

- 主要輸入欄位清晰可見，提供範例

**風格選擇**

- 使用下拉選單，選項清晰分類

**預覽展示**

- 4 張圖片以 2x2 網格方式顯示
- 支援點擊放大查看
- 提供選擇框供使用者選擇要發布的圖片

**迭代優化**

- 提供「重新生成」按鈕
- 保留使用者輸入，方便微調後再次生成

#### 行動裝置優化

- 觸控友善：按鈕和輸入框最小尺寸 44x44px
- 避免過多滾動：手機版採用上下佈局，分段呈現
- 使用原生日期選擇器（在行動裝置上）

---

### [4.2.0] - 2025-12-03 (下午)

#### ✨ 新增功能

- **圖片生成進度條**

  - 創建 ProgressBar 組件實時顯示生成進度
  - 顯示當前生成張數 (如 2/4) 和百分比
  - 顯示詳細狀態訊息 (處理參考圖片、構建提示、生成中、壓縮、保存等)
  - 漸層紫色進度條配合 Discord 主題
  - 動態光澤效果和脈衝動畫增強視覺反饋

- **Webhook 預設選項管理**
  - 創建 `webhooks.js` 配置檔管理多個 Discord 頻道
  - 添加 Webhook 預設選項下拉選單
  - 支援快速切換不同頻道
  - 選擇「自訂 Webhook URL」時才顯示輸入框
  - 提供 `getWebhookById()`, `getWebhookByUrl()`, `getDefaultWebhook()` 工具函數

#### 🎨 UI/UX 改進

- **表單視覺優化**

  - Input/TextArea/Select 背景色改為較淺的 $bg-secondary (#313338)
  - 添加明顯的邊框 ($border-color: #3F4147)
  - Focus 時背景色變為 $bg-light,邊框變為 $discord-purple
  - 大幅提升表單可讀性和視覺層次

- **歷史記錄 UI 重構**

  - 從頁面底部改為彈出視窗 (Modal) 設計
  - 在右上角添加「📜 歷史記錄」固定按鈕
  - 彈出視窗背景遮罩支援 backdrop blur 效果
  - 添加淡入淡出 (fadeIn) 和滑動 (slideUp) 動畫
  - 載入歷史記錄後自動關閉視窗
  - 生成或發布過程中禁用歷史記錄按鈕,防止操作衝突

- **進度條動畫效果**
  - 光澤動畫 (shimmer) - 2 秒循環
  - 狀態文字脈衝動畫 - 1.5 秒循環
  - 平滑的寬度過渡效果 (0.3s ease)

#### 🐛 Bug 修復

- **代碼語法錯誤修復**

  - 修復 `dataUrl` 未定義錯誤 (在定義前使用)
  - 移除 WEBHOOKS 陣列尾部多餘逗號
  - 確保 imageData 和 mimeType 正確提取
  - 移除重複的代碼行

- **SCSS 編譯錯誤修復**

  - 添加缺失的 SCSS 變數 ($border-color, $bg-secondary)
  - 修正 $primary 為 $discord-purple (變數不存在)
  - 移除 darken() 函數,直接使用 $discord-purple-dark
  - 修正 rgba() 顏色值為硬編碼

- **Firebase 測試和超時處理**
  - 創建 `test-firebase.html` 用於測試 Firebase 連接
  - historyService 加入 15 秒超時機制
  - 修正測試頁面事件綁定問題 (module 中無法使用 onclick)
  - 改用 addEventListener 綁定事件

#### 🔧 技術改進

- **圖片保存優化**

  - 修復歷史記錄保存超時問題 (Firestore 1MB 限制)
  - 新增 `generateThumbnail()` 函數生成小縮圖 (50KB, 300px)
  - 只保存縮圖而非完整圖片到 Firestore
  - 大幅減少寫入大小,避免超時

- **進度回調機制**
  - nanoBananaService 添加 `onProgress` 回調參數
  - 每生成一張圖片時回調更新進度
  - HomePage 整合進度狀態管理
  - 實時更新 progressCurrent, progressTotal, progressStatus

#### 📝 訊息內容更新

- Discord 預設訊息改為「歡迎大家一起來討論、交流 AI 開發經驗,一起共同成長!」
- 更符合 AI 開發社群的氛圍

#### 📁 新增檔案

- `src/components/common/ProgressBar/ProgressBar.jsx` - 進度條組件
- `src/components/common/ProgressBar/ProgressBar.scss` - 進度條樣式
- `src/components/common/ProgressBar/index.js` - 組件入口
- `src/config/webhooks.js` - Webhook 配置管理
- `test-firebase.html` - Firebase 連接測試工具

#### 🎯 當前功能完整度

**完全測試並穩定運行 ✅**

- 圖片生成 (4 張) + 進度條顯示 ✅
- 參考圖片圖生圖功能 ✅
- Discord Webhook 發布 ✅
- 發布預覽與訊息編輯 ✅
- 歷史記錄 (彈出視窗) ✅
- Webhook 預設選項管理 ✅
- 圖片壓縮與縮圖生成 ✅
- Firebase Firestore 整合 ✅
- 響應式設計 (桌面+手機) ✅

### [4.0.0] - 2025-12-03 (上午)

#### ✅ 測試完成

- **一般生圖功能**: 使用 Gemini 3 Pro Image Preview API 生成圖片 - ✅ 測試通過
- **Discord 發布功能**: 透過 Webhook 發布圖片到 Discord 頻道 - ✅ 測試通過
- **預覽功能**: 在發布前預覽所選圖片和訊息內容 - ✅ 測試通過

#### 🐛 Bug 修復

- 修復參考圖片圖生圖功能

  - 改為直接在瀏覽器中讀取上傳的圖片並轉換為 base64
  - 移除 Firebase Storage 上傳步驟,避免 CORS 問題
  - 簡化圖片處理流程,提升效能

- 修復 SASS 編譯錯誤
  - 解決 @use/@import 混用導致的變數衝突
  - 統一使用 @use 語法並加上命名空間
  - 修復 formData 為 null 時的解構錯誤

#### 🎨 功能改進

- 更新圖片風格選項為 4 種:

  - 賽博龐克 (Cyberpunk) - 霓虹燈光、未來城市
  - Pixel 遊戲 (Pixel Game) - 8 位元復古遊戲風格
  - 高寫實照片 (Photorealistic) - 超高清專業攝影
  - 復古海報 (Retro Poster) - 1960-1980 年代復古設計

- 改進 API 錯誤處理
  - 加入自動重試機制(最多重試 2 次)
  - 使用指數退避策略
  - 針對不同錯誤類型提供友善訊息 (503, 429, 400, 401)

#### 📊 當前功能狀態

**已完成並測試 ✅**

1. 圖片生成功能

   - 純文字提示詞生成圖片 ✅
   - 4 種風格選項 ✅
   - 每次生成 4 張圖片 ✅
   - 載入狀態顯示 ✅

2. Discord 發布功能

   - 選擇要發布的圖片(多選) ✅
   - 預覽發布內容(圖片+訊息) ✅
   - 編輯發布訊息 ✅
   - 直接發布到 Discord 頻道 ✅
   - Webhook URL 驗證 ✅

3. 使用者介面
   - 表單輸入(主題、日期、重點、Webhook URL) ✅
   - 風格選擇器 ✅
   - 圖片預覽網格 ✅
   - 發布預覽 Modal ✅
   - Toast 通知訊息 ✅
   - 響應式設計 ✅

**待測試 ⚠️**

- 參考圖片圖生圖功能 (已修復,待測試)

### [3.7] - 2025-12-02

- 解決 SASS @use/@import 衝突導致的編譯錯誤
- 修復變數在多個模組中重複定義的問題

### [3.6] - 2025-12-02

- 完成文檔更新 (MAIN.md, REPLICATION_GUIDE.md)
- 新增 Discord 預覽與發布功能

---

## 技術需求

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

- React 作為主要框架 ✅
- 移除 jQuery UI Datepicker,改用原生 HTML5 date input ✅
- 所有組件使用 React 原生開發 ✅
- Firebase Storage 僅作為備用方案(目前未使用) ✅

#### 2. 功能需求（按優先級）：

**✅ P0 - 核心功能**

##### **輸入表單**

- 主題輸入欄位（文字）
- 日期選擇器（使用 jQuery UI Datepicker）
- 附加重點輸入欄位（多行文字，支援多個重點項目）
- 參考圖片上傳功能（可選，支援拖放或點擊上傳）

##### **風格選擇器**

- 下拉選單，包含以下預設風格選項：
  1. ✅ 賽博龐克 (Cyberpunk) - 霓虹燈光、未來城市天際線、高科技元素
  2. ✅ Pixel 遊戲 (Pixel Game) - 8 位元復古遊戲美學、像素化圖形
  3. ✅ 高寫實照片 (Photorealistic) - 超高清 8K 解析度、專業攝影、電影級打光
  4. ✅ 復古海報 (Retro Poster) - 1960-1980 年代風格、粗體字、扁平設計
- 使用者可選擇其中一種風格

##### **圖片生成與預覽**

- 點擊「生成」按鈕後，呼叫 Gemini 3 Pro Image Preview API 生成 4 張圖片 ✅
- 即時預覽 4 張生成的圖片 ✅
- 支援自動重試機制(最多 2 次)與錯誤處理 ✅
- 圖片內容包含（透過 AI prompt 控制）：
  - **主標題**：使用者輸入的主題（黑體字，文字過長時自動縮小字體，不換行）
  - **品牌名稱**：Skill Hub
  - **副標題**：Kemie, Ayn, 聖博老師の學習殿堂
  - **活動時間**：[使用者輸入日期] 晚上 9:00-10:00（清晰明確）
  - **說明文字**：使用者輸入的附加重點
  - **文字可讀性保證**：
    - 背景需包含模糊區域或漸層色塊，確保文字清晰可讀
    - 若背景過於複雜，自動加上半透明矩形遮罩（白色或黑色，依明暗度決定）

##### **Discord 發布功能** ✅

- 選擇要發布的圖片（可多選）✅
- 發布前預覽功能（圖片+訊息）✅
- 可編輯發布訊息內容 ✅
- 支援 Discord Webhook URL 驗證 ✅
- 發布時附帶以下格式的文字訊息 ✅：

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

#### 3. 設計要求

- **視覺風格**：現代化、專業的 SaaS 風格（復古遊戲主題）
- **設計語言**：直角設計、像素化質感
- **動畫效果**：
  - 圖片生成時的 Loading 動畫（方形 spinner）
  - Hover 效果
  - 平滑的過渡效果（使用 CSS transitions）

**註**：詳細的 UI/UX 設計規範請參閱本文件開頭的「[UI/UX 設計規範](#uiux-設計規範)」章節。

---

## 圖片生成需求

### 任務目標

- 生成 Discord 社群宣傳圖片
- 應用場景：在 Discord 發布活動宣傳
- **文字可讀性為首要考量**

### 設計需求

#### 風格定義

- **視覺風格**：根據使用者選擇的風格（下拉選單）
  - 賽博龐克 (Cyberpunk)
  - Pixel 遊戲 (Pixel Game)
  - 高寫實照片 (Photorealistic)
  - 復古海報 (Retro Poster)
- **色彩方案**：
  - 主色調：與 Skill Hub 品牌一致（深紫色系）
  - 根據參考圖片調整配色（如有上傳）
- **設計語言**：現代、專業、吸引眼球

#### 內容元素

**文字可讀性保證（重要）**

- **背景處理**：
  - 生成的圖片必須包含模糊區域或漸層色塊，作為文字放置區域
  - 模糊區域可以是：高斯模糊背景、漸層色塊、純色區塊
- **自動遮罩**：
  - 若背景過於複雜或對比度不足，自動加上半透明矩形遮罩
  - 遮罩顏色選擇：深色背景用白色半透明、淺色背景用黑色半透明

**文字內容與排版**

- **主標題**：使用者輸入的主題（黑體字、粗體、醒目）
- **品牌名稱**：Skill Hub
- **副標題**：Kemie, Ayn, 聖博老師の學習殿堂
- **活動時間**：[日期] 晚上 9:00-10:00
- **說明文字**：使用者輸入的附加重點

#### 技術規格

- **尺寸規格**：1080x1080（正方形）
- **圖片格式**：JPG
- **解析度**：72dpi
- **檔案大小限制**：≤ 500KB

### 輸出要求

- **圖片數量**：每次生成 4 張
- **變化版本**：4 張圖片保持風格一致，提供細微變化
- **命名規則**：`[主題slug]_[活動日期時間].jpg`

---

## 技術整合需求

### Gemini API 整合

- **API**：Google Gemini 3 Pro Image Preview
- **整合方式**：在前端直接呼叫 REST API（使用 axios）
- **功能需求**：
  - 支援 text-to-image 生成
  - 支援 image-to-image（根據參考圖片生成）
  - 透過 prompt 控制風格和文字內容
  - 每次生成 4 張圖片
  - 輸出格式：base64 Data URL

### Discord Webhook 整合

- **方式**：直接使用 Webhook API（無需 Bot）
- **功能**：發送訊息和上傳圖片
- **URL 格式**：`https://discord.com/api/webhooks/{id}/{token}`
- **發布訊息格式**：

  ```
  @everyone
  【活動通知】{主題} - {日期} 晚上9:00-10:00

  本次重點項目：
  {重點1}
  {重點2}
  ...

  歡迎大家一起來討論、交流 AI 開發經驗，一起共同成長！
  ```

### Firebase 整合

- **Firestore**：儲存歷史記錄（生成記錄、表單資料、時間戳）
- **Storage**：儲存縮圖（300px, 50KB）
- **注意事項**：
  - Firestore 有 1MB 單筆限制
  - 僅儲存縮圖而非完整圖片
  - 使用 15 秒超時機制

---

## 環境設定

### 環境變數（.env）

```env
# Gemini API
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

### Discord Webhook 設定

**設定步驟**：

1. 打開 Discord 伺服器
2. 選擇目標頻道 → 點擊設定 ⚙️
3. 選擇「整合」→「Webhooks」
4. 點擊「建立 Webhook」
5. 複製 Webhook URL

**配置方式**：

- 方式 A：加入環境變數 `.env`（推薦）
- 方式 B：在表單中手動輸入

---

## 開發歷史詳細記錄

### 2025-12-02 - Discord 發布功能與預覽系統完成（版本 3.0-3.5）

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

## 開發歷史詳細記錄

### 2025-12-02 - Discord 發布功能與預覽系統完成（版本 3.0-3.5）

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

## 版本更新記錄

### [4.3.0] - 2025-12-04

#### 🎨 UI 設計最終版

- **完整 UI 設計規範文檔**
  - 新增「UI/UX 設計規範」章節到 MAIN.md
  - 記錄最終版復古遊戲風格設計
  - 詳細記載色彩系統、字體、按鈕、表單、動畫規範
  - 整合所有 UI/UX 相關內容

#### ✨ 按鈕系統改進

- **統一按鈕設計**
  - 所有按鈕改為直角設計 (border-radius: 0)
  - 所有按鈕文字統一為白色 (#ffffff)
  - 生成按鈕: 黃到紅漸層，白色文字
  - 歷史記錄按鈕: 統一樣式，天藍邊框
  - 載入/刪除按鈕: 統一直角白字設計

#### 🔧 版面修正

- **響應式布局優化**
  - 修正 768px 以上解析度並排顯示問題
  - 改為僅在手機版 (< 768px) 才堆疊
  - 桌面和平板 (>= 768px) 保持左右並排
  - form-section: 固定 45% 寬度
  - preview-section: 彈性填滿剩餘空間

#### 📝 文檔重組

- **MAIN.md 結構優化**
  - 專案概述移至文件最上方
  - 移除重複的專案概述區塊
  - 整合所有版本更新記錄
  - 保留重點資訊，移除冗餘內容

### [4.2.0] - 2025-12-03 (下午)

#### ✨ 新增功能

- **圖片生成進度條**

  - 創建 ProgressBar 組件實時顯示生成進度
  - 顯示當前生成張數 (如 2/4) 和百分比
  - 顯示詳細狀態訊息
  - 動態光澤效果和脈衝動畫

- **Webhook 預設選項管理**
  - 創建 `webhooks.js` 配置檔管理多個 Discord 頻道
  - 添加 Webhook 預設選項下拉選單
  - 支援快速切換不同頻道

#### 🎨 UI/UX 改進

- **表單視覺優化**

  - Input/TextArea/Select 背景色改為較淺的 #313338
  - 添加明顯的邊框
  - Focus 時背景色和邊框顏色變化

- **歷史記錄 UI 重構**
  - 從頁面底部改為彈出視窗 (Modal) 設計
  - 在右上角添加「📜 歷史記錄」固定按鈕
  - 彈出視窗背景遮罩支援 backdrop blur 效果

#### 🔧 技術改進

- **圖片保存優化**
  - 修復歷史記錄保存超時問題
  - 新增 `generateThumbnail()` 函數生成小縮圖 (50KB, 300px)
  - 只保存縮圖而非完整圖片到 Firestore

### [4.0.0] - 2025-12-03 (上午)

#### ✅ 測試完成

- 一般生圖功能: 使用 Gemini API 生成圖片 ✅
- Discord 發布功能: 透過 Webhook 發布圖片 ✅
- 預覽功能: 在發布前預覽所選圖片和訊息 ✅

#### 🐛 Bug 修復

- 修復參考圖片圖生圖功能
- 修復 SASS 編譯錯誤
- 改進 API 錯誤處理（自動重試機制）

#### 🎨 功能改進

- 更新圖片風格選項為 4 種
- 加入指數退避策略
- 針對不同錯誤類型提供友善訊息

### [3.7] - 2025-12-02

- 解決 SASS @use/@import 衝突導致的編譯錯誤
- 修復變數在多個模組中重複定義的問題

### [3.6] - 2025-12-02

- 完成文檔更新 (MAIN.md, REPLICATION_GUIDE.md)
- 新增 Discord 預覽與發布功能

---

## 開發歷史詳細記錄

### 2025-12-02 - Discord 發布功能與預覽系統完成（版本 3.0-3.5）

#### 完成功能總覽

**✅ 核心功能（P0）全部完成**

- 圖片生成（4 張）- 使用 Gemini API
- 參考圖片上傳與 image-to-image 生成
- Discord Webhook 發布
- 發布前預覽與訊息編輯
- 環境變數配置管理

#### 版本演進歷史

**版本 2.4-2.5：瀏覽器相容性修復**

- 問題：@google/genai SDK 依賴 Node.js Buffer，無法在瀏覽器運行
- 解決方案：改用 axios + REST API 直接調用 Gemini API
- 實作：使用 Uint8Array + btoa() 進行瀏覽器原生 base64 轉換
- 移除依賴：@google/genai（53 個套件）
- 新增依賴：axios 1.7.9

**版本 2.6：API 金鑰安全性修復**

- 問題：.env.example 包含真實 API Key 推送到 GitHub 導致 403 錯誤
- 解決方案：
  - 重新生成 Gemini API Key
  - 更新 .env.example 使用佔位符
  - 加強 .gitignore 規則

**版本 2.7-2.8：圖片生成優化**

- 實作重點項目選填功能（只在有內容時顯示）
- 修改圖片生成數量：3 張 → 4 張
- 優化 prompt 構建邏輯

**版本 3.0-3.1：Discord Webhook 整合**

- 建立 `src/services/discordService.js`
- 實作功能：
  - `dataUrlToBlob()` - base64 轉 Blob
  - `buildDiscordMessage()` - 格式化訊息
  - `publishToDiscord()` - 發布到 Discord
  - `validateWebhookUrl()` - URL 格式驗證
- 訊息格式優化：
  - 加入 emoji（📅、✨、💬）
  - 重點項目自動編號
  - @everyone 標籤通知
- 修復語法錯誤（缺少分號）

**版本 3.2：環境變數管理**

- InputForm 自動從 `VITE_DISCORD_WEBHOOK_URL` 載入預設值
- 更新 .env.example 加入 Discord Webhook URL 範例

**版本 3.3：發布功能完善**

- 優化訊息格式（更清晰的排版）
- 發布後自動清空選取狀態
- 建立 `TESTING_DISCORD.md` 測試指南

**版本 3.4-3.5：發布預覽系統**

- 建立 Modal 通用組件
- 建立 PublishPreview 組件
- 實作功能：
  - 發布前預覽選擇的圖片
  - 即時編輯訊息內容
  - 確認後才發布到 Discord
  - 成功發布後自動清空選取
- 使用 forwardRef 優化組件通訊

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

**核心服務**

- `src/services/nanoBananaService.js` - Gemini API REST 服務（使用 axios）
- `src/services/discordService.js` - Discord Webhook 發布服務
- `src/services/firebaseStorage.js` - Firebase Storage 服務
- `src/utils/promptBuilder.js` - Prompt 構建工具

**React 組件**

- `src/components/HomePage/HomePage.jsx` - 主頁面（整合生成與發布流程）
- `src/components/InputForm/InputForm.jsx` - 表單組件（含 Webhook URL）
- `src/components/PreviewGrid/PreviewGrid.jsx` - 圖片預覽網格（支援多選）
- `src/components/PublishPreview/PublishPreview.jsx` - 發布預覽彈窗（NEW）
- `src/components/common/Modal/Modal.jsx` - 通用 Modal 組件（NEW）
- `src/components/common/Button/Button.jsx` - 支援 loading 狀態
- `src/components/common/TextArea/TextArea.jsx` - 多行文字輸入

**樣式文件**

- `src/components/PublishPreview/PublishPreview.scss` - 預覽彈窗樣式
- `src/components/common/Modal/Modal.scss` - Modal 樣式（動畫效果）

**配置與文檔**

- `package.json` - 依賴：axios, react-hot-toast, sass
- `.env.example` - 環境變數範例（含 Discord Webhook URL）
- `TESTING_DISCORD.md` - Discord 發布測試指南
- `SPEC/MAIN.md` - 專案規格書（本文件）

**移除文件**

- 移除 @google/genai SDK（改用 REST API）
- 清理所有測試腳本（test-_.js, test-_.mjs）

#### 測試結果

**圖片生成測試**

- ✅ text-to-image（無參考圖片）- 成功
- ✅ image-to-image（有參考圖片）- 成功
- ✅ 4 張圖片生成 - 成功
- ✅ 重點項目選填 - 成功
- ✅ 瀏覽器相容性 - 成功（Chrome, Firefox, Safari, Edge）

**Discord 發布測試**

- ✅ Webhook URL 驗證 - 成功
- ✅ 單張圖片發布 - 成功
- ✅ 多張圖片發布 - 成功
- ✅ @everyone 通知 - 成功
- ✅ 自訂訊息編輯 - 成功
- ✅ 發布預覽功能 - 成功

**效能測試**

- 圖片生成時間：30-60 秒（4 張）
- 圖片上傳時間：2-5 秒
- 首次載入時間：< 2 秒
- 圖片大小：約 1 MB/張

**瀏覽器相容性**

- ✅ Chrome 120+
- ✅ Firefox 120+
- ✅ Safari 17+
- ✅ Edge 120+

#### 環境變數配置

**必要的環境變數（.env）**

```env
# Gemini API（nano-banana pro）
VITE_NANO_BANANA_API_KEY=your_api_key_here

# Firebase 配置
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Discord Webhook URL（選填，可在表單中輸入）
VITE_DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your_webhook_id/your_webhook_token
```

#### Discord Webhook 設定指南

**步驟 1：建立 Webhook**

1. 打開 Discord 伺服器
2. 選擇目標頻道 → 點擊設定 ⚙️
3. 選擇「整合」→「Webhooks」
4. 點擊「建立 Webhook」
5. 自訂 Webhook 名稱和頭像（選填）
6. 複製 Webhook URL

**步驟 2：配置應用程式**

- 方式 A：加入環境變數（推薦）
  - 編輯 `.env` 檔案
  - 設定 `VITE_DISCORD_WEBHOOK_URL=<你的URL>`
  - 重新啟動開發伺服器
- 方式 B：手動輸入
  - 在表單的「Discord Webhook URL」欄位輸入
  - 系統會自動驗證格式

**Webhook URL 格式**

```
https://discord.com/api/webhooks/{webhook_id}/{webhook_token}
```

**權限需求**

- Webhook 自動擁有發送訊息和上傳檔案的權限
- 無需額外設定 Bot 或權限

#### 技術實作細節

**API 整合方式**

```javascript
// Gemini API REST 調用（瀏覽器相容）
import axios from 'axios'

const generateImages = async (prompt, referenceImageUrl) => {
  const apiKey = import.meta.env.VITE_NANO_BANANA_API_KEY
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${apiKey}`

  // 構建請求內容
  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt },
          // 如有參考圖片，加入 image-to-image
          ...(referenceImageUrl
            ? [
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: base64Data
                  }
                }
              ]
            : [])
        ]
      }
    ],
    generationConfig: {
      temperature: 1,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
      responseMimeType: 'text/plain'
    }
  }

  // 使用 axios 發送 POST 請求
  const response = await axios.post(endpoint, requestBody)

  // 從回應中提取圖片（base64 Data URL）
  return extractImagesFromResponse(response.data)
}
```

**Discord Webhook 發布**

```javascript
// 發布圖片和訊息到 Discord
const publishToDiscord = async (
  imageUrls,
  formData,
  webhookUrl,
  customMessage
) => {
  // 構建 FormData
  const formDataToSend = new FormData()

  // 添加訊息內容
  formDataToSend.append(
    'content',
    customMessage || buildDiscordMessage(formData)
  )

  // 添加圖片（轉換為 Blob）
  imageUrls.forEach((imageUrl, index) => {
    const blob = dataUrlToBlob(imageUrl)
    const fileName = `${formData.topic.replace(/\s+/g, '_')}_${index + 1}.png`
    formDataToSend.append(`file${index}`, blob, fileName)
  })

  // 發送到 Discord Webhook
  await axios.post(webhookUrl, formDataToSend, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
```

**發布預覽彈窗**

```javascript
// PublishPreview 組件
<Modal isOpen={showPreview} onClose={onClose} size='xlarge'>
  <div className='publish-preview'>
    {/* 圖片預覽網格 */}
    <div className='publish-preview__images'>
      {images.map((imageUrl, index) => (
        <img src={imageUrl} alt={`圖片 ${index + 1}`} />
      ))}
    </div>

    {/* 可編輯訊息 */}
    <TextArea
      value={message}
      onChange={e => setMessage(e.target.value)}
      rows={12}
    />

    {/* 確認按鈕 */}
    <Button onClick={() => onConfirm(message)}>確認發布到 Discord</Button>
  </div>
</Modal>
```

**使用的技術棧**

- React 18.3.1 + Vite 6.0.5
- axios 1.7.9（HTTP 客戶端）
- Firebase 11.0.2（Storage, Firestore）
- SASS 1.83.0（樣式系統）
- React Hot Toast 2.6.0（通知系統）
- jQuery UI（僅 Datepicker）

**API 配置**

- 服務：Google Gemini API（直接 REST 調用）
- 模型：`gemini-3-pro-image-preview`
- 每次生成：4 張圖片
- 輸出格式：base64 Data URL
- 圖片規格：1080x1080px 正方形
- 平均大小：1038 KB（JPEG 格式）

**Discord 整合**

- 方式：Webhook API（無需 Bot）
- 支援：多圖片上傳 + 自訂訊息
- 格式：FormData multipart/form-data
- 通知：@everyone 標籤
- URL 驗證：正則表達式驗證格式

#### 後續開發任務

**✅ 已完成（P0 核心功能）**

- ✅ 圖片生成（text-to-image 和 image-to-image）
- ✅ 參考圖片上傳功能
- ✅ Discord Webhook 發布功能
- ✅ 發布前預覽與訊息編輯
- ✅ 環境變數管理
- ✅ 瀏覽器相容性修復
- ✅ 表單驗證和錯誤處理
- ✅ Loading 狀態和通知系統
- ✅ 響應式設計（桌面和手機）

**🔄 待完成（P1 進階功能）**

- [ ] 歷史記錄功能（Firestore）
  - 儲存生成記錄（圖片 URL、表單資料、時間戳）
  - 顯示歷史記錄列表
  - 重新生成先前的設定
- [ ] 多 Discord 伺服器管理
  - 儲存多組 Webhook URL
  - 伺服器選擇下拉選單
  - CRUD 操作介面
- [ ] 批次下載功能
  - 下載所有生成的圖片為 ZIP
  - 自訂檔名格式
- [ ] 圖片編輯功能（選填）
  - 裁切、調整大小
  - 濾鏡效果

**📋 優化建議**

- [ ] 圖片壓縮（減少檔案大小）
- [ ] 快取機制（減少 API 調用）
- [ ] PWA 支援（離線功能）
- [ ] 深色模式切換
- [ ] 多語言支援（i18n）
- [ ] SEO 優化
- [ ] 單元測試和 E2E 測試

### 2025-12-05 - 部署優化與品牌整合 (v5.1.0)

**新增功能**

1. **Skill Hub Logo 整合**
   - 將 logo 圖檔移至 `public/` 資料夾統一管理
   - 移除首頁 logo 的 padding，圖片填滿容器
   - 設定 favicon 為 `favicon.ico`
   - 新增 Open Graph 和 Twitter Card meta 標籤供社群分享使用

2. **Logo 參考圖片自動載入**
   - 生成圖片時自動從 `/skill_hub_icon.svg` 載入 logo
   - 將 logo 作為參考圖片傳給 Gemini API
   - 修改 Prompt 要求在 "Skill Hub" 文字前顯示 logo 圖示

3. **Discord 訊息優化**
   - 根據活動主題智能生成 2 行吸引人的描述
   - 採用親切對話式語氣（「這週我們來聊聊」、「有興趣的同學別忘了」）
   - 支援 AI、設計、職涯、創意思考、程式開發等主題分類
   - 移除過度行銷化的用語，保持輕鬆互動風格

4. **進度訊息顯示優化**
   - 將 toast 通知改為在進度條上方顯示訊息
   - 新增 7 個生成階段的進度訊息：
     - 正在生成圖片，請稍候...
     - 正在處理參考圖片...
     - 正在構建生成提示詞...
     - 正在生成圖片（可能需要 30-60 秒）...
     - 正在壓縮圖片...
     - 正在保存歷史記錄...
     - ✅ 圖片生成成功！/ ❌ 生成失敗
   - 訊息框採用復古遊戲風格（方形邊框、漸入動畫）

**技術改進**

1. **靜態資源管理**
   - 統一將 SVG logo 放置於 `public/` 資料夾
   - 使用絕對路徑 `/skill_hub_icon.svg` 確保開發和生產環境一致
   - 修正 App.jsx 中的 logo import 路徑問題

2. **SEO 與社群分享優化**
   - 新增完整的 Open Graph meta 標籤（Facebook/LinkedIn）
   - 新增 Twitter Card meta 標籤
   - 設定網站完整 URL：`https://discord-ad.skillhub365.com/`
   - 使用 logo 作為分享縮圖（1200x630）

3. **API 整合優化**
   - nanoBananaService 支援傳入 logo 圖片參數
   - 按順序加入圖片：Logo → 參考圖片 → Prompt
   - HomePage 自動從公開 URL 載入 logo 並轉換為 base64

**檔案結構變更**

```
public/
├── favicon.ico          # 網站圖示
├── skill_hub_icon.svg   # Skill Hub 圖示（用於生成）
└── skill_hub_logo.svg   # Skill Hub Logo（用於首頁）
```

**部署檢查項目**

- ✅ `dist/` 資料夾包含所有 SVG 檔案
- ✅ favicon 正確顯示
- ✅ 社群分享預覽顯示 logo
- ✅ 圖片生成時可載入 logo（需部署後測試）
- ✅ 進度訊息正確顯示在進度條上方
- ✅ Discord 訊息採用新的描述風格

---

### 2025-11-25 - Gemini API 整合與測試
