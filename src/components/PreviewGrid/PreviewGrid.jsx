import { useState, useImperativeHandle, forwardRef } from 'react'
import Card from '../common/Card'
import Button from '../common/Button'
import Loading from '../common/Loading'
import './PreviewGrid.scss'

const PreviewGrid = forwardRef(({ images, isGenerating, onPublish, isPublishing }, ref) => {
    const [selectedImages, setSelectedImages] = useState([])

    // 對外暴露 clearSelection 方法
    useImperativeHandle(ref, () => ({
        clearSelection: () => {
            setSelectedImages([])
        }
    }))

    const handleImageSelect = (index) => {
        setSelectedImages(prev => {
            if (prev.includes(index)) {
                return prev.filter(i => i !== index)
            } else {
                return [...prev, index]
            }
        })
    }

    const handleSelectAll = () => {
        if (selectedImages.length === images.length) {
            setSelectedImages([])
        } else {
            setSelectedImages(images.map((_, index) => index))
        }
    }

    const handlePublish = () => {
        const selectedImageUrls = selectedImages.map(index => images[index])
        onPublish(selectedImageUrls)
    }

    const handleDownload = (imageUrl, index) => {
        const link = document.createElement('a')
        link.href = imageUrl
        link.download = `generated-image-${index + 1}.jpg`
        link.click()
    }

    if (isGenerating) {
        return (
            <Card className="preview-grid preview-grid--loading">
                <Loading text="正在生成圖片，請稍候..." size="large" />
            </Card>
        )
    }

    if (!images || images.length === 0) {
        return (
            <Card className="preview-grid preview-grid--empty">
                <div className="preview-grid__empty-state">
                    <div className="preview-grid__empty-icon"><i className="fas fa-image"></i></div>
                    <h3>尚未生成圖片</h3>
                    <p>填寫左側表單並點擊「生成圖片」按鈕</p>
                </div>
            </Card>
        )
    }

    return (
        <div className="preview-grid">
            <Card className="preview-grid__header">
                <h2 className="preview-grid__title">預覽圖片</h2>
                <div className="preview-grid__actions">
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={handleSelectAll}
                    >
                        {selectedImages.length === images.length ? '取消全選' : '全選'}
                    </Button>
                    <Button
                        variant="success"
                        size="small"
                        onClick={handlePublish}
                        disabled={selectedImages.length === 0 || isPublishing}
                        loading={isPublishing}
                    >
                        發布到 Discord
                    </Button>
                </div>
            </Card>

            <div className="preview-grid__images">
                {images.map((imageUrl, index) => (
                    <Card
                        key={index}
                        className={`preview-grid__image-card ${selectedImages.includes(index) ? 'preview-grid__image-card--selected' : ''
                            }`}
                    >
                        <div className="preview-grid__image-wrapper">
                            <img
                                src={imageUrl}
                                alt={`生成圖片 ${index + 1}`}
                                className="preview-grid__image"
                            />
                            <div className="preview-grid__image-overlay">
                                <input
                                    type="checkbox"
                                    checked={selectedImages.includes(index)}
                                    onChange={() => handleImageSelect(index)}
                                    className="preview-grid__checkbox"
                                />
                                <Button
                                    variant="secondary"
                                    size="small"
                                    onClick={() => handleDownload(imageUrl, index)}
                                >
                                    下載
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
})

PreviewGrid.displayName = 'PreviewGrid'

export default PreviewGrid
