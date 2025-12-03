/**
 * Discord Webhook 配置
 * 可以在這裡管理多個 Discord 頻道的 Webhook URL
 */

export const WEBHOOKS = [
  {
    id: 'main',
    name: 'Skill Hub佈告欄',
    url: 'https://discord.com/api/webhooks/1445601560804724776/K1qyWMoMP-qtM6xsBa7rk2VmL2a3sDjE9JD36MQUvgfwEv4WT59oSx12dpOnw5gRvhGo',
    description: '主要的 AI 開發討論頻道'
  },
  {
    id: 'Mv',
    name: '廣瞻一般頻道',
    url: 'https://discord.com/api/webhooks/1445363165465677885/mLeixRIomd5ZXHsr54N6cKim-IfRmoMUO-a3KjpwSWbu2e0FXwA0x6V7HqOfaH58HNZx',
    description: '用於測試的頻道'
  }
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
