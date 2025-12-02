import { useEffect } from 'react'
import './Modal.scss'

function Modal({ isOpen, onClose, children, title, size = 'medium' }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className={`modal modal--${size}`}>
                <div className="modal__header">
                    <h2 className="modal__title">{title}</h2>
                    <button
                        className="modal__close"
                        onClick={onClose}
                        aria-label="關閉"
                    >
                        ✕
                    </button>
                </div>
                <div className="modal__content">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal
