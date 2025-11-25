import { useState } from 'react'
import Input from '../common/Input'
import TextArea from '../common/TextArea'
import Select from '../common/Select'
import FileUpload from '../common/FileUpload'
import Button from '../common/Button'
import './InputForm.scss'

// 風格選項
const STYLE_OPTIONS = [
    { value: 'cyberpunk', label: '賽博龐克' },
    { value: '90s-anime', label: '90年代動畫' },
    { value: 'hand-drawn-japanese', label: '手繪日系' },
    { value: 'watercolor', label: '水彩' },
    { value: 'photorealistic', label: '高寫實' },
    { value: 'retro-poster', label: '復古海報' },
    { value: 'neon', label: '霓虹風' }
]

function InputForm({ onGenerate, isGenerating }) {
    const [formData, setFormData] = useState({
        topic: '',
        date: '',
        points: '',
        style: '',
        referenceImage: null
    })

    const [errors, setErrors] = useState({})

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        // 清除該欄位的錯誤
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }))
        }
    }

    const validate = () => {
        const newErrors = {}

        if (!formData.topic.trim()) {
            newErrors.topic = '請輸入活動主題'
        }

        if (!formData.date) {
            newErrors.date = '請選擇活動日期'
        }

        if (!formData.points.trim()) {
            newErrors.points = '請輸入至少一個重點項目'
        }

        if (!formData.style) {
            newErrors.style = '請選擇圖片風格'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (validate()) {
            // 將重點文字分割成陣列
            const pointsArray = formData.points
                .split('\n')
                .map(p => p.trim())
                .filter(p => p.length > 0)

            onGenerate({
                ...formData,
                points: pointsArray
            })
        }
    }

    return (
        <form className="input-form" onSubmit={handleSubmit}>
            <h2 className="input-form__title">活動資訊</h2>

            <Input
                label="活動主題"
                placeholder="例如：AI 工作坊"
                value={formData.topic}
                onChange={(e) => handleChange('topic', e.target.value)}
                error={errors.topic}
                required
                disabled={isGenerating}
            />

            <Input
                label="活動日期"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                error={errors.date}
                required
                disabled={isGenerating}
            />

            <TextArea
                label="重點項目"
                placeholder="每行一個重點項目&#10;例如：&#10;學習 AI 基礎知識&#10;實作圖片生成&#10;分享經驗交流"
                value={formData.points}
                onChange={(e) => handleChange('points', e.target.value)}
                error={errors.points}
                required
                rows={6}
                disabled={isGenerating}
            />

            <Select
                label="圖片風格"
                value={formData.style}
                onChange={(e) => handleChange('style', e.target.value)}
                options={STYLE_OPTIONS}
                error={errors.style}
                required
                disabled={isGenerating}
            />

            <FileUpload
                label="參考圖片（可選）"
                onFileSelect={(file) => handleChange('referenceImage', file)}
                error={errors.referenceImage}
                disabled={isGenerating}
            />

            <Button
                type="submit"
                variant="primary"
                size="large"
                loading={isGenerating}
                disabled={isGenerating}
            >
                {isGenerating ? '生成中...' : '生成圖片'}
            </Button>
        </form>
    )
}

export default InputForm
