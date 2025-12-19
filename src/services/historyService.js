import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../config/firebase'

const COLLECTION_NAME = 'generation_history'

/**
 * 保存生成記錄到 Firestore
 * @param {Object} record - 生成記錄
 * @param {string} record.topic - 主題
 * @param {string} record.date - 日期
 * @param {string} record.startTime - 開始時間
 * @param {string} record.endTime - 結束時間
 * @param {string[]} record.points - 重點項目
 * @param {string} record.style - 風格
 * @param {string} record.thumbnail - 縮圖 Data URL
 * @param {number} record.imageCount - 圖片數量
 * @param {string} record.webhookUrl - Discord Webhook URL
 * @returns {Promise<string>} - 文檔 ID
 */
export const saveHistory = async (record) => {
  try {
    const historyData = {
      topic: record.topic || '',
      date: record.date || '',
      startTime: record.startTime || '',
      endTime: record.endTime || '',
      points: record.points || [],
      style: record.style || '',
      thumbnail: record.thumbnail || '',
      imageCount: record.imageCount || 0,
      webhookUrl: record.webhookUrl || '',
      createdAt: new Date().toISOString(),
      timestamp: Date.now()
    }

    // 加入超時機制 (15秒)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Firestore 寫入超時 (15秒)')), 15000)
    )
    
    const writePromise = addDoc(collection(db, COLLECTION_NAME), historyData)
    
    const docRef = await Promise.race([writePromise, timeoutPromise])
    
    return docRef.id
  } catch (error) {
    console.error('保存記錄失敗:', error)
    
    // 提供更友好的錯誤訊息
    if (error.code === 'permission-denied') {
      throw new Error('Firebase 權限不足,請檢查 Firestore 安全規則')
    } else if (error.message.includes('超時')) {
      throw new Error('連接 Firebase 超時,請檢查網路連接')
    } else if (error.code === 'unavailable') {
      throw new Error('Firebase 服務暫時無法使用')
    }
    
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
    await deleteDoc(doc(db, COLLECTION_NAME, recordId))
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
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
    const deletePromises = []
    
    querySnapshot.forEach((document) => {
      deletePromises.push(deleteDoc(doc(db, COLLECTION_NAME, document.id)))
    })
    
    await Promise.all(deletePromises)
    
    return deletePromises.length
  } catch (error) {
    console.error('清空記錄失敗:', error)
    throw new Error(`清空失敗: ${error.message}`)
  }
}
