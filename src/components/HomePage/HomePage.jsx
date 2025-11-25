import { useState } from 'react'
import InputForm from '../InputForm'
import PreviewGrid from '../PreviewGrid'
import './HomePage.scss'
import { uploadFile } from '../../services/firebaseStorage'
import { buildPrompt } from '../../utils/promptBuilder'
import { generateImages } from '../../services/nanoBananaService'
import toast from 'react-hot-toast'

function HomePage() {
    const [generatedImages, setGeneratedImages] = useState([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)

    const handleGenerate = async (formData) => {
        console.log('開始生成流程，表單資料：', formData)
        setIsGenerating(true)
        setGeneratedImages([]) // 清空之前的圖片

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

    const handlePublish = async (selectedImages) => {
        console.log('發布圖片到 Discord：', selectedImages)
        setIsPublishing(true)

        const toastId = toast.loading('正在發布到 Discord...')

        try {
            // TODO: 實作 Discord 發布邏輯
            await new Promise(resolve => setTimeout(resolve, 1500))

            toast.success(`成功發布 ${selectedImages.length} 張圖片到 Discord！`, { id: toastId })
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
                        images={generatedImages}
                        isGenerating={isGenerating}
                        onPublish={handlePublish}
                        isPublishing={isPublishing}
                    />
                </div>
            </div>
        </div>
    )
}

export default HomePage
