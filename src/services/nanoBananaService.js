import axios from 'axios'

/**
 * 呼叫 Gemini 3 Pro Image Preview API 生成圖片
 * @param {string} prompt - 圖片生成提示詞
 * @param {Object} [referenceImage] - 參考圖片物件 { data: base64字串, mimeType: MIME類型 } (可選)
 * @param {Object} [logoImage] - Logo 圖片物件 { data: base64字串, mimeType: MIME類型 } (可選)
 * @param {Function} [onProgress] - 進度回調函數 (current, total, status)
 * @returns {Promise<string[]>} - 生成的圖片 base64 Data URL 陣列
 */
export const generateImages = async (prompt, referenceImage, logoImage, onProgress) => {
  try {
    const apiKey = import.meta.env.VITE_NANO_BANANA_API_KEY

    if (!apiKey) {
      throw new Error('缺少 VITE_NANO_BANANA_API_KEY 環境變數')
    }

    // 呼叫 API 生成 4 張圖片
    const imageUrls = []
    const numberOfImages = 4
    const maxRetries = 2 // 每張圖片最多重試 2 次

    for (let i = 0; i < numberOfImages; i++) {
      // 更新進度
      if (onProgress) {
        onProgress(i, numberOfImages, `正在生成第 ${i + 1} 張圖片...`)
      }

      let retryCount = 0
      let success = false

      while (retryCount <= maxRetries && !success) {
        try {
          if (retryCount > 0) {
            // 等待一段時間後重試 (指數退避)
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount))
          }

          // 構建請求內容 - Gemini 3 Pro Image Preview 格式
          const contents = []
          
          // 先加入文字 prompt
          contents.push({ text: prompt })
          
          // 如果有 Logo，先加入 Logo（API 只支援 JPEG/PNG，不支援 SVG）
          if (logoImage && logoImage.mimeType !== 'image/svg+xml') {
            contents.push({
              inlineData: {
                mimeType: logoImage.mimeType,
                data: logoImage.data
              }
            })
          }
          
          // 如果有參考圖片，加入參考圖片（注意：API 只支援 JPEG/PNG，不支援 SVG）
          if (referenceImage && referenceImage.mimeType !== 'image/svg+xml') {
            contents.push({
              inlineData: {
                mimeType: referenceImage.mimeType,
                data: referenceImage.data
              }
            })
          }

          // 構建請求體
          const requestBody = {
            contents: [{ parts: contents }],
            generationConfig: {
              responseModalities: ['IMAGE'],
              imageConfig: {
                aspectRatio: '1:1',
                imageSize: '2K'
              }
            }
          }

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
            if (retryCount <= maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 1000 * retryCount))
            }
          } else if (error.response?.status === 429) {
            if (retryCount <= maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 1000 * retryCount * 2))
            }
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

    return imageUrls

  } catch (error) {
    console.error('圖片生成失敗:', error.message)
    
    let errorMessage = '圖片生成失敗'
    
    if (error.response) {
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
