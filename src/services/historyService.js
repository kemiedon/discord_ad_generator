import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../config/firebase'

const COLLECTION_NAME = 'generation_history'

/**
 * 保存生成記錄到 Firestore
 * @param {Object} record - 生成記錄
 * @param {string} record.topic - 主題
 * @param {string} record.date - 日期
 * @param {string[]} record.points - 重點項目
 * @param {string} record.style - 風格
 * @param {string[]} record.images - 圖片 Data URL 陣列
 * @param {string} record.webhookUrl - Discord Webhook URL
 * @returns {Promise<string>} - 文檔 ID
 */
export const saveHistory = async (record) => {
  try {
    console.log('保存生成記錄...')
    
    const historyData = {
      topic: record.topic || '',
      date: record.date || '',
      points: record.points || [],
      style: record.style || '',
      // 只保存第一張圖片作為縮圖 (減少儲存空間)
      thumbnail: record.images?.[0] || '',
      imageCount: record.images?.length || 0,
      webhookUrl: record.webhookUrl || '',
      createdAt: new Date().toISOString(),
      timestamp: Date.now()
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), historyData)
    console.log('✅ 記錄已保存，ID:', docRef.id)
    
    return docRef.id
  } catch (error) {
    console.error('保存記錄失敗:', error)
    throw new Error(`保存失敗: ${error.message}`)
  }
}

/**
 * 獲取所有歷史記錄
 * @param {number} maxRecords - 最多返回幾筆記錄，預設 50
 * @returns {Promise<Array>} - 歷史記錄陣列
 */
export const getHistory = async (maxRecords = 50) => {
  try {
    console.log('讀取歷史記錄...')
    
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('timestamp', 'desc'),
      limit(maxRecords)
    )
    
    const querySnapshot = await getDocs(q)
    const records = []
    
    querySnapshot.forEach((doc) => {
      records.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    console.log(`✅ 讀取了 ${records.length} 筆記錄`)
    return records
  } catch (error) {
    console.error('讀取記錄失敗:', error)
    throw new Error(`讀取失敗: ${error.message}`)
  }
}

/**
 * 刪除指定的歷史記錄
 * @param {string} recordId - 記錄 ID
 * @returns {Promise<void>}
 */
export const deleteHistory = async (recordId) => {
  try {
    console.log('刪除記錄:', recordId)
    
    await deleteDoc(doc(db, COLLECTION_NAME, recordId))
    
    console.log('✅ 記錄已刪除')
  } catch (error) {
    console.error('刪除記錄失敗:', error)
    throw new Error(`刪除失敗: ${error.message}`)
  }
}

/**
 * 清空所有歷史記錄
 * @returns {Promise<number>} - 刪除的記錄數量
 */
export const clearAllHistory = async () => {
  try {
    console.log('清空所有記錄...')
    
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
    const deletePromises = []
    
    querySnapshot.forEach((document) => {
      deletePromises.push(deleteDoc(doc(db, COLLECTION_NAME, document.id)))
    })
    
    await Promise.all(deletePromises)
    
    console.log(`✅ 已刪除 ${deletePromises.length} 筆記錄`)
    return deletePromises.length
  } catch (error) {
    console.error('清空記錄失敗:', error)
    throw new Error(`清空失敗: ${error.message}`)
  }
}
