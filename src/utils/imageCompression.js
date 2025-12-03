import imageCompression from 'browser-image-compression'

/**
 * 將 base64 Data URL 轉換為 File 物件
 * @param {string} dataUrl - base64 Data URL
 * @param {string} fileName - 檔案名稱
 * @returns {File} - File 物件
 */
const dataUrlToFile = (dataUrl, fileName = 'image.png') => {
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], fileName, { type: mime })
}

/**
 * 將 File 物件轉換為 base64 Data URL
 * @param {File} file - File 物件
 * @returns {Promise<string>} - base64 Data URL
 */
const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * 壓縮圖片 (base64 Data URL)
 * @param {string} dataUrl - 原始圖片的 base64 Data URL
 * @param {Object} options - 壓縮選項
 * @param {number} options.maxSizeMB - 最大檔案大小 (MB)，預設 0.8
 * @param {number} options.maxWidthOrHeight - 最大寬度或高度，預設 1920
 * @param {boolean} options.useWebWorker - 是否使用 Web Worker，預設 true
 * @returns {Promise<string>} - 壓縮後的 base64 Data URL
 */
export const compressImage = async (dataUrl, options = {}) => {
  try {
    const {
      maxSizeMB = 0.8,
      maxWidthOrHeight = 1920,
      useWebWorker = true
    } = options

    console.log('開始壓縮圖片...')
    
    // 將 Data URL 轉換為 File
    const file = dataUrlToFile(dataUrl)
    const originalSizeKB = (file.size / 1024).toFixed(2)
    console.log(`原始檔案大小: ${originalSizeKB} KB`)

    // 壓縮圖片
    const compressedFile = await imageCompression(file, {
      maxSizeMB,
      maxWidthOrHeight,
      useWebWorker,
      initialQuality: 0.8
    })

    const compressedSizeKB = (compressedFile.size / 1024).toFixed(2)
    console.log(`壓縮後大小: ${compressedSizeKB} KB`)
    console.log(`壓縮率: ${((1 - compressedFile.size / file.size) * 100).toFixed(1)}%`)

    // 轉回 Data URL
    const compressedDataUrl = await fileToDataUrl(compressedFile)
    
    return compressedDataUrl
  } catch (error) {
    console.error('圖片壓縮失敗:', error)
    // 如果壓縮失敗，返回原始圖片
    return dataUrl
  }
}

/**
 * 批次壓縮多張圖片
 * @param {string[]} dataUrls - 圖片 Data URL 陣列
 * @param {Object} options - 壓縮選項
 * @returns {Promise<string[]>} - 壓縮後的圖片 Data URL 陣列
 */
export const compressImages = async (dataUrls, options = {}) => {
  console.log(`開始批次壓縮 ${dataUrls.length} 張圖片...`)
  
  const compressedImages = await Promise.all(
    dataUrls.map((dataUrl, index) => 
      compressImage(dataUrl, options).catch(error => {
        console.error(`圖片 ${index + 1} 壓縮失敗:`, error)
        return dataUrl // 失敗時返回原圖
      })
    )
  )
  
  console.log('批次壓縮完成')
  return compressedImages
}

/**
 * 生成小縮圖 (用於歷史記錄)
 * @param {string} dataUrl - 原始圖片的 base64 Data URL
 * @returns {Promise<string>} - 縮圖 Data URL
 */
export const generateThumbnail = async (dataUrl) => {
  try {
    console.log('生成縮圖...')
    
    // 將 Data URL 轉換為 File
    const file = dataUrlToFile(dataUrl)
    
    // 生成非常小的縮圖 (100KB 以下)
    const thumbnailFile = await imageCompression(file, {
      maxSizeMB: 0.05, // 50KB
      maxWidthOrHeight: 300, // 小尺寸
      useWebWorker: true,
      initialQuality: 0.6
    })

    const thumbnailSizeKB = (thumbnailFile.size / 1024).toFixed(2)
    console.log(`縮圖大小: ${thumbnailSizeKB} KB`)

    // 轉回 Data URL
    const thumbnailDataUrl = await fileToDataUrl(thumbnailFile)
    
    return thumbnailDataUrl
  } catch (error) {
    console.error('生成縮圖失敗:', error)
    // 如果失敗，返回 null
    return null
  }
}

