import { useState } from 'react'
import Modal from '../common/Modal'
import Button from '../common/Button'
import TextArea from '../common/TextArea'
import './PublishPreview.scss'

function PublishPreview({ isOpen, onClose, images, formData, onConfirm, isPublishing }) {
    const [message, setMessage] = useState(() => {
        return buildInitialMessage(formData)
    })

    const handleConfirm = () => {
        onConfirm(message)
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="發布預覽"
            size="xlarge"
        >
            <div className="publish-preview">
                <div className="publish-preview__images">
                    <h3 className="publish-preview__section-title">
                        選擇的圖片 ({images.length} 張)
                    </h3>
                    <div className="publish-preview__image-grid">
                        {images.map((imageUrl, index) => (
                            <div key={index} className="publish-preview__image-item">
                                <img
                                    src={imageUrl}
                                    alt={`圖片 ${index + 1}`}
                                    className="publish-preview__image"
                                />
                                <span className="publish-preview__image-number">
                                    {index + 1}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="publish-preview__message">
                    <h3 className="publish-preview__section-title">
                        活動通知訊息
                    </h3>
                    <TextArea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={12}
                        placeholder="編輯發布訊息..."
                    />
                    <div className="publish-preview__message-hint">
                        💡 提示：訊息會發送到 Discord 頻道並標註 @everyone
                    </div>
                </div>

                <div className="publish-preview__actions">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isPublishing}
                    >
                        取消
                    </Button>
                    <Button
                        variant="success"
                        onClick={handleConfirm}
                        loading={isPublishing}
                        disabled={isPublishing}
                    >
                        確認發布到 Discord
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

/**
 * 構建初始訊息
 */
function buildInitialMessage(formData) {
    // 防止 formData 為 null 或 undefined
    if (!formData) {
        return '@everyone\n\n【活動通知】\n📅 晚上9:00-10:00\n\n💬 歡迎大家一起來討論、交流經驗，一起進步！'
    }

    const { topic = '', date = '', points = [] } = formData

    let message = `@everyone\n\n【活動通知】${topic}\n📅 ${date} 晚上9:00-10:00\n`

    if (points && Array.isArray(points) && points.length > 0) {
        message += `\n✨ 本次重點項目：\n`
        points.forEach((point, index) => {
            message += `${index + 1}. ${point}\n`
        })
    }

    message += `\n💬 歡迎大家一起來討論、交流經驗，一起進步！`

    return message
}

export default PublishPreview
