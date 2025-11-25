import { useState } from 'react'
import InputForm from '../InputForm'
import PreviewGrid from '../PreviewGrid'
import './HomePage.scss'

function HomePage() {
    const [generatedImages, setGeneratedImages] = useState([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)

    const handleGenerate = async (formData) => {
        console.log('生成圖片，表單資料：', formData)
        setIsGenerating(true)

        try {
            // TODO: 實作圖片生成邏輯
            // 目前使用模擬資料
            await new Promise(resolve => setTimeout(resolve, 2000))

            // 模擬生成的圖片
            const mockImages = [
                'https://via.placeholder.com/1080x1080/5865F2/FFFFFF?text=Image+1',
                'https://via.placeholder.com/1080x1080/00D9FF/FFFFFF?text=Image+2',
                'https://via.placeholder.com/1080x1080/FF006E/FFFFFF?text=Image+3'
            ]

            setGeneratedImages(mockImages)
        } catch (error) {
            console.error('生成圖片失敗：', error)
            alert('生成圖片失敗，請稍後再試')
        } finally {
            setIsGenerating(false)
        }
    }

    const handlePublish = async (selectedImages) => {
        console.log('發布圖片到 Discord：', selectedImages)
        setIsPublishing(true)

        try {
            // TODO: 實作 Discord 發布邏輯
            await new Promise(resolve => setTimeout(resolve, 1500))

            alert(`成功發布 ${selectedImages.length} 張圖片到 Discord！`)
        } catch (error) {
            console.error('發布失敗：', error)
            alert('發布失敗，請稍後再試')
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
