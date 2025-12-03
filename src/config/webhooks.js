/**
 * Discord Webhook 配置
 * 可以在這裡管理多個 Discord 頻道的 Webhook URL
 */

export const WEBHOOKS = [
  {
    id: 'main',
    name: 'AI 開發交流主頻道',
    url: 'https://discord.com/api/webhooks/1445363165465677885/mLeixRIomd5ZXHsr54N6cKim-IfRmoMUO-a3KjpwSWbu2e0FXwA0x6V7HqOfaH58HNZx',
    description: '主要的 AI 開發討論頻道'
  },
  // 可以添加更多 webhook
  // {
  //   id: 'test',
  //   name: '測試頻道',
  //   url: 'https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN',
  //   description: '用於測試的頻道'
  // },
]

/**
 * 根據 ID 獲取 Webhook
 * @param {string} id - Webhook ID
 * @returns {Object|undefined} - Webhook 配置
 */
export const getWebhookById = (id) => {
  return WEBHOOKS.find(webhook => webhook.id === id)
}

/**
 * 根據 URL 獲取 Webhook
 * @param {string} url - Webhook URL
 * @returns {Object|undefined} - Webhook 配置
 */
export const getWebhookByUrl = (url) => {
  return WEBHOOKS.find(webhook => webhook.url === url)
}

/**
 * 獲取預設 Webhook (第一個)
 * @returns {Object} - 預設 Webhook 配置
 */
export const getDefaultWebhook = () => {
  return WEBHOOKS[0]
}
