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
 * 根據主題生成吸引人的描述
 * @param {string} topic - 活動主題
 * @returns {string} - 2行描述文字
 */
const generateAttractionDescription = (topic) => {
  // 根據主題關鍵字生成相應的描述
  const topicLower = topic.toLowerCase()
  
  // AI相關主題
  if (topicLower.includes('ai') || topicLower.includes('人工智慧') || topicLower.includes('機器學習') || topicLower.includes('gemini') || topicLower.includes('chatgpt')) {
    return `這週的直播，要跟大家深入探討 AI 技術的應用與趨勢。\n有興趣的同學別忘了一起來討論喔！`
  } 
  // 設計相關主題
  else if (topicLower.includes('設計') || topicLower.includes('ui') || topicLower.includes('ux') || topicLower.includes('視覺') || topicLower.includes('品牌')) {
    return `這週的直播，我要分享如何提升設計思維與實戰技巧。\n有空的同學歡迎來聊聊！`
  } 
  // 職涯/履歷相關
  else if (topicLower.includes('履歷') || topicLower.includes('職涯') || topicLower.includes('求職') || topicLower.includes('面試') || topicLower.includes('作品集')) {
    return `這週我們來聊聊職涯規劃與個人定位的實戰經驗分享。\n一樣開放大家提問喔，有空的同學歡迎來聽聽！`
  }
  // 創意思考
  else if (topicLower.includes('創意') || topicLower.includes('思考') || topicLower.includes('發想')) {
    return `這禮拜的直播，要跟大家分享創意思考這一塊。\n有興趣的同學別忘了這週日一起來討論喔！`
  }
  // 程式開發
  else if (topicLower.includes('python') || topicLower.includes('程式') || topicLower.includes('coding') || topicLower.includes('開發')) {
    return `這週直播要跟大家分享程式開發的實用技巧與心得。\n歡迎有興趣的同學一起來交流！`
  } 
  // Web/網站
  else if (topicLower.includes('web') || topicLower.includes('網站') || topicLower.includes('前端') || topicLower.includes('後端')) {
    return `這週要來聊聊 Web 開發的最新趨勢與實戰經驗。\n有空的同學歡迎來一起討論！`
  } 
  // 通用描述（保持親切、邀請的語氣）
  else {
    return `這週的直播要跟大家分享一些實用的經驗與技巧。\n有興趣的同學歡迎一起來交流討論喔！`
  }
}

/**
 * 構建 Discord 訊息內容
 * @param {Object} formData - 表單資料
 * @returns {string} - 格式化的訊息內容
 */
const buildDiscordMessage = (formData) => {
  // 防止 formData 為 null 或 undefined
  if (!formData) {
    const today = new Date().toISOString().split('T')[0]
    return `@everyone\n\n【活動通知】\n📅 ${today} 21:00-22:00\n\n💬 歡迎大家一起來討論、交流AI開發經驗，一起共同成長！`
  }

  const { topic = '', date = '', startTime = '21:00', endTime = '22:00', points = [] } = formData

  let message = `@everyone\n\n【活動通知】${topic}\n📅 ${date} ${startTime}-${endTime}\n`

  // 只有當有重點項目時才加入
  if (points && Array.isArray(points) && points.length > 0) {
    message += `\n✨ 本次重點項目：\n`
    points.forEach((point, index) => {
      message += `${index + 1}. ${point}\n`
    })
  }

  // 加入根據主題生成的吸引人描述
  const attractionDesc = generateAttractionDescription(topic)
  message += `\n${attractionDesc}\n`

  message += `\n💬 歡迎大家一起來討論、交流AI開發經驗，一起共同成長！`

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
  if (!webhookUrl) {
    throw new Error('請先設定 Discord Webhook URL')
  }

  if (!imageUrls || imageUrls.length === 0) {
    throw new Error('沒有選擇要發布的圖片')
  }

  try {
    // 使用自訂訊息或構建預設訊息
    const messageContent = customMessage || buildDiscordMessage(formData)

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

    // 發送到 Discord Webhook
    const response = await axios.post(webhookUrl, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return {
      success: true,
      message: '成功發布到 Discord！',
      imageCount: imageUrls.length
    }

  } catch (error) {
    console.error('Discord 發布失敗:', error)
    
    if (error.response) {
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
