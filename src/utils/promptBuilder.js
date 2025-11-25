/**
 * 構建 nano-banana pro API 的 Prompt
 * @param {Object} data - 表單資料
 * @returns {string} - 構建好的 Prompt
 */
export const buildPrompt = (data) => {
  const { topic, date, points, style } = data;

  // 風格關鍵字映射
  const styleKeywords = {
    'cyberpunk': 'cyberpunk style, neon lights, futuristic city, high tech',
    '90s-anime': '90s anime style, retro anime, cel shading, vintage aesthetic',
    'hand-drawn-japanese': 'hand-drawn Japanese illustration, soft lines, warm colors, artistic',
    'watercolor': 'watercolor painting, artistic, soft edges, blending colors',
    'photorealistic': 'photorealistic, 8k resolution, highly detailed, cinematic lighting',
    'retro-poster': 'retro poster design, vintage typography, bold colors, flat design',
    'neon': 'neon style, glowing lines, dark background, vibrant colors'
  };

  const selectedStyle = styleKeywords[style] || style;

  // 核心 Prompt 結構
  const prompt = `
Create a Discord event promotional image in ${selectedStyle}.

Content Requirements:
- Main Title: "${topic}" (bold, sans-serif font, adjust size if text is long, no line breaks)
- Brand: "Skill Hub"
- Subtitle: "Kemie, Ayn, 聖博老師の學習殿堂"
- Event Time: "${date} 晚上9:00-10:00" (clear and prominent)
- Key Points:
${points.map(p => `- ${p}`).join('\n')}

CRITICAL - Text Readability:
- Background MUST include blurred areas or gradient color blocks for text placement
- If background is complex, add a semi-transparent rectangular overlay:
  * Use white overlay (rgba(255,255,255,0.8)) for dark backgrounds
  * Use black overlay (rgba(0,0,0,0.7)) for light backgrounds
- Text color must contrast well with background (white on dark, black on light)
- Ensure all text is clearly readable

Image Specifications:
- Size: 1080x1080px
- Format: Square, suitable for Discord and social media
- Style: ${selectedStyle}
  `.trim();

  return prompt;
};
