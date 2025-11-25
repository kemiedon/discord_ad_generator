import './TextArea.scss'

function TextArea({
    label,
    placeholder,
    value,
    onChange,
    error,
    required = false,
    disabled = false,
    rows = 4,
    ...props
}) {
    return (
        <div className="textarea-group">
            {label && (
                <label className="textarea-group__label">
                    {label}
                    {required && <span className="textarea-group__required">*</span>}
                </label>
            )}
            <textarea
                className={`textarea ${error ? 'textarea--error' : ''}`}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                rows={rows}
                {...props}
            />
            {error && <span className="textarea-group__error">{error}</span>}
        </div>
    )
}

export default TextArea
