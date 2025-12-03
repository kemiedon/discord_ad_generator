import React from 'react'
import './ProgressBar.scss'

/**
 * 進度條組件
 * @param {number} current - 當前進度 (0-total)
 * @param {number} total - 總數
 * @param {string} label - 顯示的標籤文字
 * @param {string} status - 當前狀態描述
 */
function ProgressBar({ current, total, label, status }) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className="progress-bar">
      <div className="progress-bar__header">
        <span className="progress-bar__label">{label}</span>
        <span className="progress-bar__count">
          {current} / {total}
        </span>
      </div>
      
      <div className="progress-bar__track">
        <div
          className="progress-bar__fill"
          style={{ width: `${percentage}%` }}
        >
          <span className="progress-bar__percentage">{percentage}%</span>
        </div>
      </div>

      {status && (
        <div className="progress-bar__status">{status}</div>
      )}
    </div>
  )
}

export default ProgressBar
