import axios from 'axios'

/**
 * 呼叫 Gemini (nano-banana pro) API 生成圖片
 * @param {string} prompt - 圖片生成提示詞
 * @param {string} [referenceImageUrl] - 參考圖片 URL (可選)
 * @returns {Promise<string[]>} - 生成的圖片 base64 Data URL 陣列
 */
export const generateImages = async (prompt, referenceImageUrl) => {
  console.log('開始生成圖片...')
  console.log('Prompt:', prompt)
  if (referenceImageUrl) {
    console.log('✅ 使用參考圖片:', referenceImageUrl)
  }

  try {
    const apiKey = import.meta.env.VITE_NANO_BANANA_API_KEY

    if (!apiKey) {
      throw new Error('缺少 VITE_NANO_BANANA_API_KEY 環境變數')
    }

    console.log('呼叫 Gemini 圖片生成 API...')
    console.log('模型: gemini-3-pro-image-preview')

    // 呼叫 API 生成 3 張圖片
    const imageUrls = []
    const numberOfImages = 3

    for (let i = 0; i < numberOfImages; i++) {
      console.log(`正在生成第 ${i + 1} 張圖片...`)

      // 構建請求內容
      const contents = []
      
      // 如果有參考圖片，先加入參考圖片
      if (referenceImageUrl) {
        try {
          // 將參考圖片轉換為 base64（瀏覽器相容方式）
          const imageResponse = await axios.get(referenceImageUrl, {
            responseType: 'arraybuffer'
          })
          
          // 使用瀏覽器原生方法轉換為 base64
          const uint8Array = new Uint8Array(imageResponse.data)
          let binaryString = ''
          for (let i = 0; i < uint8Array.length; i++) {
            binaryString += String.fromCharCode(uint8Array[i])
          }
          const base64Image = btoa(binaryString)
          const mimeType = imageResponse.headers['content-type'] || 'image/jpeg'
          
          contents.push({
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Image
                }
              }
            ]
          })
        } catch (error) {
          console.warn('參考圖片載入失敗，將使用純文字生成:', error.message)
        }
      }
      
      // 加入文字提示詞
      contents.push({
        parts: [{ text: prompt }]
      })

      // 呼叫 REST API
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${apiKey}`,
        {
          contents: contents
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 60000 // 60 秒超時
        }
      )

      // 解析回應
      if (response.data?.candidates && response.data.candidates.length > 0) {
        const parts = response.data.candidates[0].content.parts

        for (const part of parts) {
          if (part.inlineData) {
            // 將 base64 圖片數據轉換為 Data URL
            const imageData = part.inlineData.data
            const mimeType = part.inlineData.mimeType || 'image/png'
            const dataUrl = `data:${mimeType};base64,${imageData}`
            
            imageUrls.push(dataUrl)
            console.log(`✅ 第 ${i + 1} 張圖片生成成功`)
            break
          }
        }
      }
    }

    if (imageUrls.length === 0) {
      throw new Error('API 沒有返回任何圖片')
    }

    console.log(`🎉 圖片生成完成，共 ${imageUrls.length} 張`)
    return imageUrls

  } catch (error) {
    console.error('圖片生成失敗:', error.message)
    if (error.response) {
      console.error('API 錯誤詳情:', error.response.data)
      console.error('HTTP 狀態碼:', error.response.status)
    }
    throw new Error(`圖片生成失敗: ${error.message}`)
  }
}
