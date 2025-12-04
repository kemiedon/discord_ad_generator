import axios from 'axios'

/**
 * 呼叫 Gemini (nano-banana pro) API 生成圖片
 * @param {string} prompt - 圖片生成提示詞
 * @param {Object} [referenceImage] - 參考圖片物件 { data: base64字串, mimeType: MIME類型 } (可選)
 * @param {Object} [logoImage] - Logo 圖片物件 { data: base64字串, mimeType: MIME類型 } (可選)
 * @param {Function} [onProgress] - 進度回調函數 (current, total, status)
 * @returns {Promise<string[]>} - 生成的圖片 base64 Data URL 陣列
 */
export const generateImages = async (prompt, referenceImage, logoImage, onProgress) => {
  console.log('開始生成圖片...')
  console.log('Prompt:', prompt)
  if (referenceImage) {
    console.log('✅ 使用參考圖片，MIME類型:', referenceImage.mimeType)
  }
  if (logoImage) {
    console.log('✅ 使用 Logo 圖片，MIME類型:', logoImage.mimeType)
  }

  try {
    const apiKey = import.meta.env.VITE_NANO_BANANA_API_KEY

    if (!apiKey) {
      throw new Error('缺少 VITE_NANO_BANANA_API_KEY 環境變數')
    }

    console.log('呼叫 Gemini 圖片生成 API...')
    console.log('模型: gemini-3-pro-image-preview')

    // 呼叫 API 生成 4 張圖片
    const imageUrls = []
    const numberOfImages = 4
    const maxRetries = 2 // 每張圖片最多重試 2 次

    for (let i = 0; i < numberOfImages; i++) {
      console.log(`正在生成第 ${i + 1} 張圖片...`)
      
      // 更新進度
      if (onProgress) {
        onProgress(i, numberOfImages, `正在生成第 ${i + 1} 張圖片...`)
      }

      let retryCount = 0
      let success = false

      while (retryCount <= maxRetries && !success) {
        try {
          if (retryCount > 0) {
            console.log(`重試第 ${retryCount} 次...`)
            // 等待一段時間後重試 (指數退避)
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount))
          }

          // 構建請求內容 - 正確的格式
          const parts = []
          
          // 如果有 Logo 圖片，先加入 Logo
          if (logoImage) {
            console.log('加入 Logo 圖片到請求中...')
            parts.push({
              inlineData: {
                mimeType: logoImage.mimeType,
                data: logoImage.data
              }
            })
            console.log('✅ Logo 圖片已加入請求')
          }
          
          // 如果有參考圖片，再加入參考圖片
          if (referenceImage) {
            console.log('加入參考圖片到請求中...')
            parts.push({
              inlineData: {
                mimeType: referenceImage.mimeType,
                data: referenceImage.data
              }
            })
            console.log('✅ 參考圖片已加入請求')
          }
          
          // 加入文字提示詞
          parts.push({ text: prompt })

          // 構建請求體
          const requestBody = {
            contents: [{
              parts: parts
            }]
          }

          console.log('發送 API 請求...')

          // 呼叫 REST API
          const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${apiKey}`,
            requestBody,
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
                
                // 更新進度
                if (onProgress) {
                  onProgress(i + 1, numberOfImages, `✅ 第 ${i + 1} 張圖片生成成功`)
                }
                
                success = true
                break
              }
            }
          }

          if (!success) {
            throw new Error('API 回應中沒有找到圖片數據')
          }

        } catch (error) {
          retryCount++
          
          if (error.response?.status === 503) {
            console.warn(`⚠️ API 服務暫時無法使用 (503)`)
            if (retryCount <= maxRetries) {
              console.log(`將在 ${retryCount} 秒後重試...`)
            }
          } else if (error.response?.status === 429) {
            console.warn(`⚠️ API 請求頻率過高 (429)`)
            if (retryCount <= maxRetries) {
              console.log(`將在 ${retryCount * 2} 秒後重試...`)
              await new Promise(resolve => setTimeout(resolve, 1000 * retryCount))
            }
          } else {
            console.error(`生成第 ${i + 1} 張圖片時發生錯誤:`, error.message)
          }
          
          // 如果已經用完所有重試次數，拋出錯誤
          if (retryCount > maxRetries) {
            throw error
          }
        }
      }

      if (!success) {
        throw new Error(`無法生成第 ${i + 1} 張圖片，已重試 ${maxRetries} 次`)
      }
    }

    if (imageUrls.length === 0) {
      throw new Error('API 沒有返回任何圖片')
    }

    console.log(`🎉 圖片生成完成，共 ${imageUrls.length} 張`)
    return imageUrls

  } catch (error) {
    console.error('圖片生成失敗:', error.message)
    
    let errorMessage = '圖片生成失敗'
    
    if (error.response) {
      console.error('API 錯誤詳情:', error.response.data)
      console.error('HTTP 狀態碼:', error.response.status)
      
      switch (error.response.status) {
        case 503:
          errorMessage = 'API 服務暫時無法使用，請稍後再試'
          break
        case 429:
          errorMessage = 'API 請求頻率過高，請稍後再試'
          break
        case 400:
          errorMessage = 'API 請求格式錯誤'
          break
        case 401:
          errorMessage = 'API 金鑰無效或已過期'
          break
        default:
          errorMessage = `API 錯誤 (${error.response.status})`
      }
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'API 請求超時，請檢查網路連線'
    }
    
    throw new Error(errorMessage)
  }
}
