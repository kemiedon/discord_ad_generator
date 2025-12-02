import { useState, useRef } from 'react'
import InputForm from '../InputForm'
import PreviewGrid from '../PreviewGrid'
import PublishPreview from '../PublishPreview'
import './HomePage.scss'
import { uploadFile } from '../../services/firebaseStorage'
import { buildPrompt } from '../../utils/promptBuilder'
import { generateImages } from '../../services/nanoBananaService'
import { publishToDiscord, validateWebhookUrl } from '../../services/discordService'
import toast from 'react-hot-toast'

function HomePage() {
    const [generatedImages, setGeneratedImages] = useState([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)
    const [currentFormData, setCurrentFormData] = useState(null) // 儲存當前表單資料
    const [showPreview, setShowPreview] = useState(false)
    const [previewImages, setPreviewImages] = useState([])
    const previewGridRef = useRef(null)

    const handleGenerate = async (formData) => {
        console.log('開始生成流程，表單資料：', formData)
        setIsGenerating(true)
        setGeneratedImages([]) // 清空之前的圖片
        setCurrentFormData(formData) // 儲存表單資料

        const toastId = toast.loading('正在生成圖片，請稍候...')

        try {
            let referenceImageUrl = null

            // 1. 上傳參考圖片（如果有）
            if (formData.referenceImage) {
                toast.loading('正在上傳參考圖片...', { id: toastId })
                console.log('正在上傳參考圖片...')
                referenceImageUrl = await uploadFile(formData.referenceImage, 'reference_images')
                console.log('參考圖片上傳成功：', referenceImageUrl)
            }

            // 2. 構建 Prompt
            const prompt = buildPrompt(formData)
            console.log('構建的 Prompt：', prompt)

            // 3. 呼叫圖片生成 API
            toast.loading('正在生成圖片，請稍候（可能需要 30-60 秒）...', { id: toastId })
            console.log('正在生成圖片...')
            const images = await generateImages(prompt, referenceImageUrl)
            console.log('圖片生成成功：', images)

            setGeneratedImages(images)
            toast.success('圖片生成成功！', { id: toastId })
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

    return (
        <div className="home-page">
            <div className="home-page__container">
                <div className="home-page__form-section">
                    <InputForm
                        onGenerate={handleGenerate}
                        isGenerating={isGenerating}
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
