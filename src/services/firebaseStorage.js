import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * 上傳檔案到 Firebase Storage
 * @param {File} file - 要上傳的檔案
 * @param {string} path - 儲存路徑 (預設為 'uploads')
 * @returns {Promise<string>} - 上傳後的檔案下載 URL
 */
export const uploadFile = async (file, path = 'uploads') => {
  if (!file) return null;

  try {
    // 建立唯一的檔案名稱
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `${path}/${fileName}`);

    // 上傳檔案
    const snapshot = await uploadBytes(storageRef, file);
    
    // 取得下載 URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
