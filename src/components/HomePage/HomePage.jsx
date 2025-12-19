import { useState, useRef } from 'react'
import InputForm from '../InputForm'
import PreviewGrid from '../PreviewGrid'
import PublishPreview from '../PublishPreview'
import HistoryPanel from '../HistoryPanel'
import ProgressBar from '../common/ProgressBar'
import './HomePage.scss'
import { buildPrompt } from '../../utils/promptBuilder'
import { generateImages } from '../../services/nanoBananaService'
import { publishToDiscord, validateWebhookUrl } from '../../services/discordService'
import { compressImages, generateThumbnail } from '../../utils/imageCompression'
import { saveHistory } from '../../services/historyService'
import toast from 'react-hot-toast'

function HomePage() {
    const [generatedImages, setGeneratedImages] = useState([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)
    const [currentFormData, setCurrentFormData] = useState(null) // 儲存當前表單資料
    const [showPreview, setShowPreview] = useState(false)
    const [previewImages, setPreviewImages] = useState([])
    const [loadedFormData, setLoadedFormData] = useState(null) // 從歷史載入的表單資料
    const [showHistory, setShowHistory] = useState(false) // 歷史記錄 modal 開關
    
    // 進度狀態
    const [progressCurrent, setProgressCurrent] = useState(0)
    const [progressTotal, setProgressTotal] = useState(4)
    const [progressStatus, setProgressStatus] = useState('')
    const [progressMessage, setProgressMessage] = useState('') // 進度條上方訊息
    
    const previewGridRef = useRef(null)
    const inputFormRef = useRef(null)

    const handleGenerate = async (formData) => {
        setIsGenerating(true)
        setGeneratedImages([]) // 清空之前的圖片
        setCurrentFormData(formData) // 儲存表單資料
        
        // 重置進度
        setProgressCurrent(0)
        setProgressTotal(4)
        setProgressStatus('準備開始生成...')
        setProgressMessage('正在生成圖片，請稍候...')

        try {
            let referenceImageBase64 = null

            // 1. 處理參考圖片（如果有用戶上傳的參考圖片）
            if (formData.referenceImage) {
                setProgressStatus('正在處理參考圖片...')
                setProgressMessage('正在處理參考圖片...')
                
                // 直接在瀏覽器中讀取檔案並轉換為 base64
                referenceImageBase64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onload = (e) => {
                        // 取得 base64 字串（不含 data:image/xxx;base64, 前綴）
                        const base64 = e.target.result.split(',')[1]
                        resolve({
                            data: base64,
                            mimeType: formData.referenceImage.type
                        })
                    }
                    reader.onerror = reject
                    reader.readAsDataURL(formData.referenceImage)
                })
            }
            
            // 1.5. 載入 Logo 圖片 (logo.png)
            let logoImageBase64 = null
            try {
                const logoUrl = '/logo.png'
                
                const logoResponse = await fetch(logoUrl)
                if (logoResponse.ok) {
                    const logoBlob = await logoResponse.blob()
                    logoImageBase64 = await new Promise((resolve, reject) => {
                        const reader = new FileReader()
                        reader.onload = (e) => {
                            const base64 = e.target.result.split(',')[1]
                            resolve({
                                data: base64,
                                mimeType: logoBlob.type
                            })
                        }
                        reader.onerror = reject
                        reader.readAsDataURL(logoBlob)
                    })
                }
            } catch (error) {
                // Logo 載入失敗不影響生成流程
            }

            // 2. 構建 Prompt
            setProgressStatus('正在構建生成提示詞...')
            setProgressMessage('正在構建生成提示詞...')
            const prompt = buildPrompt(formData, !!referenceImageBase64)

            // 3. 呼叫圖片生成 API (附帶進度回調)
            setProgressStatus('正在生成圖片...')
            setProgressMessage('正在生成圖片，請稍候（可能需要 30-60 秒）...')
            
            const images = await generateImages(prompt, referenceImageBase64, logoImageBase64, (current, total, status) => {
                setProgressCurrent(current)
                setProgressTotal(total)
                setProgressStatus(status)
            })

            // 4. 壓縮圖片
            setProgressStatus('正在壓縮圖片...')
            setProgressMessage('正在壓縮圖片...')
            const compressedImages = await compressImages(images, {
                maxSizeMB: 0.8,
                maxWidthOrHeight: 1920
            })

            setGeneratedImages(compressedImages)
            setProgressMessage('✅ 圖片生成成功！')
            setProgressStatus('✅ 生成完成！')
            toast.success('圖片生成成功！')

            // 5. 自動保存到歷史記錄
            try {
                setProgressStatus('正在保存歷史記錄...')
                setProgressMessage('正在保存歷史記錄...')
                // 生成小縮圖
                const thumbnail = await generateThumbnail(compressedImages[0])
                
                await saveHistory({
                    topic: formData.topic,
                    date: formData.date,
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                    points: formData.points,
                    style: formData.style,
                    thumbnail: thumbnail, // 只保存縮圖
                    imageCount: compressedImages.length,
                    webhookUrl: formData.webhookUrl
                })
                setProgressStatus('✅ 已保存到歷史記錄')
                setProgressMessage('✅ 已保存到歷史記錄')
            } catch (error) {
                // 保存歷史記錄失敗不影響主流程
            }
        } catch (error) {
            console.error('生成流程失敗：', error)
            setProgressMessage(`❌ 生成失敗: ${error.message}`)
            toast.error(`生成失敗: ${error.message}`)
        } finally {
            setIsGenerating(false)
        }
    }

    const handlePublish = (selectedImages) => {
        if (!currentFormData) {
            toast.error('找不到表單資料，請重新生成圖片')
            return
        }

        const webhookUrl = currentFormData.webhookUrl

        // 驗證 Webhook URL
        if (!webhookUrl) {
            toast.error('請先在表單中輸入 Discord Webhook URL')
            return
        }

        if (!validateWebhookUrl(webhookUrl)) {
            toast.error('Discord Webhook URL 格式不正確，請檢查')
            return
        }

        // 開啟預覽 Modal
        setPreviewImages(selectedImages)
        setShowPreview(true)
    }

    const handleConfirmPublish = async (customMessage) => {
        setIsPublishing(true)
        const toastId = toast.loading('正在發布到 Discord...')

        try {
            const result = await publishToDiscord(
                previewImages,
                currentFormData,
                currentFormData.webhookUrl,
                customMessage
            )
            toast.success(`成功發布 ${result.imageCount} 張圖片到 Discord！`, { id: toastId })
            setShowPreview(false)
            // 清空選取狀態
            if (previewGridRef.current) {
                previewGridRef.current.clearSelection()
            }
        } catch (error) {
            console.error('發布失敗：', error)
            toast.error(`發布失敗: ${error.message}`, { id: toastId })
        } finally {
            setIsPublishing(false)
        }
    }

    // 從歷史記錄載入資料
    const handleLoadHistory = (formData) => {
        setLoadedFormData(formData)
        // 清空之前生成的圖片
        setGeneratedImages([])
        // 滾動到表單區域
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="home-page">
            <button
                className="home-page__history-btn"
                onClick={() => setShowHistory(true)}
                title="查看生成歷史"
                disabled={isGenerating || isPublishing}
            >
                <i className="fas fa-history"></i> 歷史記錄
            </button>

            <div className="home-page__container">
                <div className="home-page__form-section">
                    <InputForm
                        ref={inputFormRef}
                        onGenerate={handleGenerate}
                        isGenerating={isGenerating}
                        initialData={loadedFormData}
                    />
                </div>

                <div className="home-page__preview-section">
                    {isGenerating && (
                        <div className="home-page__progress-container">
                            {progressMessage && (
                                <div className="home-page__progress-message">
                                    {progressMessage}
                                </div>
                            )}
                            <ProgressBar
                                current={progressCurrent}
                                total={progressTotal}
                                label="圖片生成進度"
                                status={progressStatus}
                            />
                        </div>
                    )}
                    
                    <PreviewGrid
                        ref={previewGridRef}
                        images={generatedImages}
                        isGenerating={isGenerating}
                        onPublish={handlePublish}
                        isPublishing={isPublishing}
                    />
                </div>
            </div>

            <HistoryPanel
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                onLoadHistory={handleLoadHistory}
            />

            <PublishPreview
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                images={previewImages}
                formData={currentFormData}
                onConfirm={handleConfirmPublish}
                isPublishing={isPublishing}
            />
        </div>
    )
}

export default HomePage
