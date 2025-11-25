import './Loading.scss'

function Loading({ text = '載入中...', size = 'medium' }) {
    return (
        <div className="loading">
            <div className={`loading__spinner loading__spinner--${size}`}></div>
            {text && <p className="loading__text">{text}</p>}
        </div>
    )
}

export default Loading
