import './Select.scss'

function Select({
    label,
    value,
    onChange,
    options = [],
    error,
    required = false,
    disabled = false,
    placeholder = '請選擇...',
    ...props
}) {
    return (
        <div className="select-group">
            {label && (
                <label className="select-group__label">
                    {label}
                    {required && <span className="select-group__required">*</span>}
                </label>
            )}
            <select
                className={`select ${error ? 'select--error' : ''}`}
                value={value}
                onChange={onChange}
                disabled={disabled}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <span className="select-group__error">{error}</span>}
        </div>
    )
}

export default Select
