import './Button.scss'

function Button({
    children,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    onClick,
    type = 'button',
    ...props
}) {
    return (
        <button
            className={`btn btn--${variant} btn--${size} ${loading ? 'btn--loading' : ''}`}
            disabled={disabled || loading}
            onClick={onClick}
            type={type}
            {...props}
        >
            {loading ? (
                <>
                    <span className="btn__spinner"></span>
                    <span>{children}</span>
                </>
            ) : (
                children
            )}
        </button>
    )
}

export default Button
