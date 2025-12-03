import { useState, useRef } from 'react'
import InputForm from '../InputForm'
import PreviewGrid from '../PreviewGrid'
import PublishPreview from '../PublishPreview'
import HistoryPanel from '../HistoryPanel'
import './HomePage.scss'
import { buildPrompt } from '../../utils/promptBuilder'
import { generateImages } from '../../services/nanoBananaService'
import { publishToDiscord, validateWebhookUrl } from '../../services/discordService'
import { compressImages } from '../../utils/imageCompression'
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
    const previewGridRef = useRef(null)
    const inputFormRef = useRef(null)

    const handleGenerate = async (formData) => {
        console.log('開始生成流程，表單資料：', formData)
        setIsGenerating(true)
        setGeneratedImages([]) // 清空之前的圖片
        setCurrentFormData(formData) // 儲存表單資料

        const toastId = toast.loading('正在生成圖片，請稍候...')

        try {
            let referenceImageBase64 = null

            // 1. 處理參考圖片（如果有）
            if (formData.referenceImage) {
                toast.loading('正在處理參考圖片...', { id: toastId })
                console.log('正在處理參考圖片...')
                
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
                console.log('✅ 參考圖片處理成功')
            }

            // 2. 構建 Prompt
            const prompt = buildPrompt(formData)
            console.log('構建的 Prompt：', prompt)

            // 3. 呼叫圖片生成 API
            toast.loading('正在生成圖片，請稍候（可能需要 30-60 秒）...', { id: toastId })
            console.log('正在生成圖片...')
            const images = await generateImages(prompt, referenceImageBase64)
            console.log('圖片生成成功：', images)

            // 4. 壓縮圖片
            toast.loading('正在壓縮圖片...', { id: toastId })
            console.log('開始壓縮圖片...')
            const compressedImages = await compressImages(images, {
                maxSizeMB: 0.8,
                maxWidthOrHeight: 1920
            })
            console.log('圖片壓縮完成')

            setGeneratedImages(compressedImages)
            toast.success('圖片生成成功！', { id: toastId })

            // 5. 自動保存到歷史記錄
            try {
                await saveHistory({
                    topic: formData.topic,
                    date: formData.date,
                    points: formData.points,
                    style: formData.style,
                    images: compressedImages,
                    webhookUrl: formData.webhookUrl
                })
                console.log('✅ 已保存到歷史記錄')
            } catch (error) {
                console.warn('保存歷史記錄失敗:', error)
                // 不顯示錯誤,避免打擾使用者
            }
        } catch (error) {
            console.error('生成流程失敗：', error)
            toast.error(`生成失敗: ${error.message}`, { id: toastId })
        } finally {
            setIsGenerating(false)
        }
    }

    const handlePublish = (selectedImages) => {
        console.log('準備發布圖片到 Discord：', selectedImages)
        
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
        console.log('確認發布到 Discord')
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
        console.log('載入歷史記錄:', formData)
        setLoadedFormData(formData)
        // 清空之前生成的圖片
        setGeneratedImages([])
        // 滾動到表單區域
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="home-page">
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
                    <PreviewGrid
                        ref={previewGridRef}
                        images={generatedImages}
                        isGenerating={isGenerating}
                        onPublish={handlePublish}
                        isPublishing={isPublishing}
                    />
                </div>

                <div className="home-page__history-section">
                    <HistoryPanel onLoadHistory={handleLoadHistory} />
                </div>
            </div>

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
