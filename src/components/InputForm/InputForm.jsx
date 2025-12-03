import { useState, useEffect, useRef } from 'react'
import Input from '../common/Input'
import TextArea from '../common/TextArea'
import Select from '../common/Select'
import FileUpload from '../common/FileUpload'
import Button from '../common/Button'
import { WEBHOOKS, getWebhookByUrl } from '../../config/webhooks'
import './InputForm.scss'

// 風格選項
const STYLE_OPTIONS = [
    { value: 'cyberpunk', label: '賽博龐克' },
    { value: 'pixel-game', label: 'Pixel遊戲' },
    { value: 'photorealistic', label: '高寫實照片' },
    { value: 'retro-poster', label: '復古海報' }
]

function InputForm({ onGenerate, isGenerating, initialData }) {
    const [formData, setFormData] = useState({
        topic: '',
        date: '',
        points: '',
        style: '',
        referenceImage: null,
        webhookUrl: import.meta.env.VITE_DISCORD_WEBHOOK_URL || '',
        webhookPreset: 'custom' // 新增: 預設選項
    })

    const [errors, setErrors] = useState({})
    const dateInputRef = useRef(null)

    // 當 initialData 改變時更新表單
    useEffect(() => {
        if (initialData) {
            const currentWebhook = getWebhookByUrl(initialData.webhookUrl)
            setFormData({
                topic: initialData.topic || '',
                date: initialData.date || '',
                points: Array.isArray(initialData.points) 
                    ? initialData.points.join('\n') 
                    : (initialData.points || ''),
                style: initialData.style || '',
                referenceImage: null, // 不載入參考圖片
                webhookUrl: initialData.webhookUrl || import.meta.env.VITE_DISCORD_WEBHOOK_URL || '',
                webhookPreset: currentWebhook ? currentWebhook.id : 'custom'
            })
            setErrors({}) // 清空錯誤
        }
    }, [initialData])

    // 初始化 jQuery UI Datepicker
    useEffect(() => {
        const $ = window.jQuery
        if ($ && dateInputRef.current) {
            $(dateInputRef.current).datepicker({
                dateFormat: 'yy-mm-dd',
                onSelect: (dateText) => {
                    handleChange('date', dateText)
                }
            })
        }

        // 清理函數
        return () => {
            if ($ && dateInputRef.current) {
                // 檢查 datepicker 是否已初始化，避免銷毀錯誤
                try {
                    if ($(dateInputRef.current).hasClass('hasDatepicker')) {
                        $(dateInputRef.current).datepicker('destroy');
                    }
                } catch (e) {
                    console.warn('Datepicker destroy failed', e);
                }
            }
        }
    }, [])

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

    // 處理 Webhook 預設選項變更
    const handleWebhookPresetChange = (presetId) => {
        if (presetId === 'custom') {
            setFormData(prev => ({
                ...prev,
                webhookPreset: 'custom',
                webhookUrl: ''
            }))
        } else {
            const webhook = WEBHOOKS.find(w => w.id === presetId)
            if (webhook) {
                setFormData(prev => ({
                    ...prev,
                    webhookPreset: presetId,
                    webhookUrl: webhook.url
                }))
            }
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

        // 重點項目改為非必填
        // if (!formData.points.trim()) {
        //     newErrors.points = '請輸入至少一個重點項目'
        // }

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

            <div className="input-group">
                <label className="input-group__label">
                    活動日期
                    <span className="input-group__required">*</span>
                </label>
                <input
                    ref={dateInputRef}
                    type="text"
                    className={`input ${errors.date ? 'input--error' : ''} `}
                    placeholder="請選擇日期"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    disabled={isGenerating}
                    autoComplete="off"
                />
                {errors.date && <span className="input-group__error">{errors.date}</span>}
            </div>

            <TextArea
                label="重點項目（可選）"
                placeholder="每行一個重點項目&#10;例如：&#10;學習 AI 基礎知識&#10;實作圖片生成&#10;分享經驗交流"
                value={formData.points}
                onChange={(e) => handleChange('points', e.target.value)}
                error={errors.points}
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

            <Select
                label="Discord 頻道"
                value={formData.webhookPreset}
                onChange={(e) => handleWebhookPresetChange(e.target.value)}
                options={[
                    ...WEBHOOKS.map(webhook => ({
                        value: webhook.id,
                        label: webhook.name
                    })),
                    { value: 'custom', label: '自訂 Webhook URL' }
                ]}
                disabled={isGenerating}
            />

            {formData.webhookPreset === 'custom' && (
                <Input
                    label="自訂 Webhook URL"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={formData.webhookUrl}
                    onChange={(e) => handleChange('webhookUrl', e.target.value)}
                    error={errors.webhookUrl}
                    disabled={isGenerating}
                    type="url"
                />
            )}

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
