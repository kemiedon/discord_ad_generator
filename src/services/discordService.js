import axios from 'axios'

/**
 * 將 base64 Data URL 轉換為 Blob
 * @param {string} dataUrl - base64 Data URL
 * @returns {Blob} - 圖片 Blob
 */
const dataUrlToBlob = (dataUrl) => {
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

/**
 * 構建 Discord 訊息內容
 * @param {Object} formData - 表單資料
 * @returns {string} - 格式化的訊息內容
 */
const buildDiscordMessage = (formData) => {
  // 防止 formData 為 null 或 undefined
  if (!formData) {
    return '@everyone\n\n【活動通知】\n📅 晚上9:00-10:00\n\n💬 歡迎大家一起來討論、交流經驗，一起進步！'
  }

  const { topic = '', date = '', points = [] } = formData

  let message = `@everyone\n\n【活動通知】${topic}\n📅 ${date} 晚上9:00-10:00\n`

  // 只有當有重點項目時才加入
  if (points && Array.isArray(points) && points.length > 0) {
    message += `\n✨ 本次重點項目：\n`
    points.forEach((point, index) => {
      message += `${index + 1}. ${point}\n`
    })
  }

  message += `\n💬 歡迎大家一起來討論、交流經驗，一起進步！`

  return message
}

/**
 * 發布圖片到 Discord
 * @param {string[]} imageUrls - 圖片 Data URL 陣列
 * @param {Object} formData - 表單資料
 * @param {string} webhookUrl - Discord Webhook URL
 * @param {string} customMessage - 自訂訊息內容（選填）
 * @returns {Promise<Object>} - 發布結果
 */
export const publishToDiscord = async (imageUrls, formData, webhookUrl, customMessage = null) => {
  console.log('開始發布到 Discord...')
  console.log('圖片數量:', imageUrls.length)
  console.log('Webhook URL:', webhookUrl ? '已設定' : '未設定')

  if (!webhookUrl) {
    throw new Error('請先設定 Discord Webhook URL')
  }

  if (!imageUrls || imageUrls.length === 0) {
    throw new Error('沒有選擇要發布的圖片')
  }

  try {
    // 使用自訂訊息或構建預設訊息
    const messageContent = customMessage || buildDiscordMessage(formData)
    console.log('訊息內容:', messageContent)

    // 準備 FormData
    const formDataToSend = new FormData()
    
    // 添加訊息內容
    formDataToSend.append('content', messageContent)

    // 將所有圖片轉換為 Blob 並添加到 FormData
    imageUrls.forEach((imageUrl, index) => {
      const blob = dataUrlToBlob(imageUrl)
      const fileName = `${formData.topic.replace(/\s+/g, '_')}_${index + 1}.png`
      formDataToSend.append(`file${index}`, blob, fileName)
    })

    console.log('發送請求到 Discord Webhook...')

    // 發送到 Discord Webhook
    const response = await axios.post(webhookUrl, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    console.log('✅ 發布成功！', response.status)

    return {
      success: true,
      message: '成功發布到 Discord！',
      imageCount: imageUrls.length
    }

  } catch (error) {
    console.error('Discord 發布失敗:', error)
    
    if (error.response) {
      console.error('HTTP 狀態碼:', error.response.status)
      console.error('錯誤詳情:', error.response.data)
      
      if (error.response.status === 404) {
        throw new Error('Discord Webhook URL 無效，請檢查設定')
      } else if (error.response.status === 401) {
        throw new Error('Discord Webhook 權限錯誤')
      }
    }

    throw new Error(`發布失敗: ${error.message}`)
  }
}

/**
 * 驗證 Discord Webhook URL 格式
 * @param {string} url - Webhook URL
 * @returns {boolean} - 是否有效
 */
export const validateWebhookUrl = (url) => {
  if (!url) return false
  
  // Discord Webhook URL 格式: https://discord.com/api/webhooks/{webhook.id}/{webhook.token}
  const webhookPattern = /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+$/
  return webhookPattern.test(url)
}
