import { useState } from 'react'
import './FileUpload.scss'

function FileUpload({
    label,
    onFileSelect,
    accept = 'image/*',
    error,
    required = false,
    disabled = false
}) {
    const [isDragging, setIsDragging] = useState(false)
    const [preview, setPreview] = useState(null)
    const [fileName, setFileName] = useState('')

    const handleDragOver = (e) => {
        e.preventDefault()
        if (!disabled) {
            setIsDragging(true)
        }
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)

        if (disabled) return

        const files = e.dataTransfer.files
        if (files.length > 0) {
            handleFile(files[0])
        }
    }

    const handleFileChange = (e) => {
        const files = e.target.files
        if (files.length > 0) {
            handleFile(files[0])
        }
    }

    const handleFile = (file) => {
        if (!file.type.startsWith('image/')) {
            return
        }

        setFileName(file.name)

        // 建立預覽
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result)
        }
        reader.readAsDataURL(file)

        // 回傳檔案給父組件
        if (onFileSelect) {
            onFileSelect(file)
        }
    }

    const handleClear = () => {
        setPreview(null)
        setFileName('')
        if (onFileSelect) {
            onFileSelect(null)
        }
    }

    return (
        <div className="file-upload-group">
            {label && (
                <label className="file-upload-group__label">
                    {label}
                    {required && <span className="file-upload-group__required">*</span>}
                </label>
            )}

            {preview ? (
                <div className="file-upload__preview">
                    <img src={preview} alt="預覽" />
                    <div className="file-upload__preview-overlay">
                        <span className="file-upload__file-name">{fileName}</span>
                        <button
                            type="button"
                            className="file-upload__clear-btn"
                            onClick={handleClear}
                            disabled={disabled}
                        >
                            ✕ 移除
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    className={`file-upload ${isDragging ? 'file-upload--dragging' : ''} ${error ? 'file-upload--error' : ''} ${disabled ? 'file-upload--disabled' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        accept={accept}
                        onChange={handleFileChange}
                        disabled={disabled}
                        className="file-upload__input"
                        id="file-input"
                    />
                    <label htmlFor="file-input" className="file-upload__label">
                        <div className="file-upload__icon"><i className="fas fa-folder-open"></i></div>
                        <p className="file-upload__text">
                            拖放圖片到這裡，或點擊選擇檔案
                        </p>
                        <p className="file-upload__hint">支援 JPG、PNG 格式</p>
                    </label>
                </div>
            )}

            {error && <span className="file-upload-group__error">{error}</span>}
        </div>
    )
}

export default FileUpload
