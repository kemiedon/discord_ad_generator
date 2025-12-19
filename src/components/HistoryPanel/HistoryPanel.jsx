import { useState, useEffect } from 'react'
import Button from '../common/Button'
import './HistoryPanel.scss'
import { getHistory, deleteHistory, clearAllHistory } from '../../services/historyService'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

function HistoryPanel({ isOpen, onClose, onLoadHistory }) {
    const [history, setHistory] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    // 載入歷史記錄
    const loadHistory = async () => {
        setIsLoading(true)
        try {
            const records = await getHistory()
            setHistory(records)
        } catch (error) {
            console.error('載入歷史記錄失敗:', error)
            toast.error('載入歷史記錄失敗')
        } finally {
            setIsLoading(false)
        }
    }

    // 組件載入時自動載入歷史
    useEffect(() => {
        if (isOpen) {
            loadHistory()
        }
    }, [isOpen])

    // 載入指定記錄
    const handleLoad = (record) => {
        // 重建表單資料
        const formData = {
            topic: record.topic,
            date: record.date,
            startTime: record.startTime || '21:00',
            endTime: record.endTime || '22:00',
            points: record.points,
            style: record.style,
            webhookUrl: record.webhookUrl
        }
        
        onLoadHistory(formData)
        toast.success('已載入歷史記錄')
        onClose() // 載入後關閉 modal
    }

    // 刪除指定記錄
    const handleDelete = async (recordId, e) => {
        e.stopPropagation() // 防止觸發載入事件
        
        if (!confirm('確定要刪除這筆記錄嗎？')) {
            return
        }
        
        try {
            await deleteHistory(recordId)
            setHistory(history.filter(r => r.id !== recordId))
            toast.success('記錄已刪除')
        } catch (error) {
            console.error('刪除記錄失敗:', error)
            toast.error('刪除失敗')
        }
    }

    // 清空所有記錄
    const handleClearAll = async () => {
        if (!confirm('確定要清空所有歷史記錄嗎？此操作無法復原！')) {
            return
        }
        
        setIsLoading(true)
        try {
            const deletedCount = await clearAllHistory()
            setHistory([])
            toast.success(`已清空 ${deletedCount} 筆記錄`)
        } catch (error) {
            console.error('清空記錄失敗:', error)
            toast.error('清空失敗')
        } finally {
            setIsLoading(false)
        }
    }

    // 格式化時間
    const formatDate = (timestamp) => {
        try {
            return format(new Date(timestamp), 'yyyy/MM/dd HH:mm')
        } catch {
            return '未知時間'
        }
    }

    // 風格標籤映射
    const styleLabels = {
        'cyberpunk': '賽博龐克',
        'pixel-game': 'Pixel遊戲',
        'photorealistic': '高寫實照片',
        'retro-poster': '復古海報'
    }

    if (!isOpen) return null

    return (
        <div className="history-panel" onClick={onClose}>
            <div className="history-panel__modal" onClick={(e) => e.stopPropagation()}>
                <div className="history-panel__header">
                    <h2>生成歷史</h2>
                    <div className="history-panel__actions">
                        <Button
                            variant="secondary"
                            size="small"
                            onClick={loadHistory}
                            disabled={isLoading}
                        >
                            <i className="fas fa-sync-alt"></i> 重新載入
                        </Button>
                        <Button
                            variant="danger"
                            size="small"
                            onClick={handleClearAll}
                            disabled={isLoading || history.length === 0}
                        >
                            <i className="fas fa-trash-alt"></i> 清空全部
                        </Button>
                        <button
                            className="history-panel__close-btn"
                            onClick={onClose}
                            aria-label="關閉"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>

            {isLoading ? (
                <div className="history-panel__empty">
                    <div className="icon">⏳</div>
                    <p>載入中...</p>
                </div>
            ) : history.length === 0 ? (
                <div className="history-panel__empty">
                    <div className="icon"><i className="fas fa-clipboard"></i></div>
                    <p>尚無歷史記錄</p>
                </div>
            ) : (
                <div className="history-panel__list">
                    {history.map((record) => (
                        <div
                            key={record.id}
                            className="history-item"
                            onClick={() => handleLoad(record)}
                        >
                            <div className="history-item__thumbnail">
                                {record.thumbnail ? (
                                    <img src={record.thumbnail} alt={record.topic} />
                                ) : (
                                    <div className="history-item__no-image"><i className="fas fa-image"></i></div>
                                )}
                            </div>

                            <div className="history-item__content">
                                <h3 className="history-item__title">{record.topic || '未命名'}</h3>
                                <div className="history-item__meta">
                                    <span className="history-item__date">
                                        📅 {record.date}
                                        {record.startTime && record.endTime && (
                                            <> {record.startTime}-{record.endTime}</>
                                        )}
                                    </span>
                                    <span className="history-item__style">
                                        {styleLabels[record.style] || record.style}
                                    </span>
                                    <span>
                                        🖼️ {record.imageCount} 張圖片
                                    </span>
                                </div>
                                <div className="history-item__meta">
                                    <span>
                                        🕒 {formatDate(record.timestamp)}
                                    </span>
                                </div>
                            </div>

                            <div className="history-item__actions">
                                <button
                                    className="history-item__button history-item__button--delete"
                                    title="刪除此記錄"
                                    onClick={(e) => handleDelete(record.id, e)}
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            </div>
        </div>
    )
}

export default HistoryPanel
