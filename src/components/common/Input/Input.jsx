import './Input.scss'

function Input({
    label,
    placeholder,
    value,
    onChange,
    error,
    required = false,
    disabled = false,
    type = 'text',
    ...props
}) {
    return (
        <div className="input-group">
            {label && (
                <label className="input-group__label">
                    {label}
                    {required && <span className="input-group__required">*</span>}
                </label>
            )}
            <input
                className={`input ${error ? 'input--error' : ''}`}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                {...props}
            />
            {error && <span className="input-group__error">{error}</span>}
        </div>
    )
}

export default Input
