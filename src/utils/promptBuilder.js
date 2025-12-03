/**
 * 構建 nano-banana pro API 的 Prompt
 * @param {Object} data - 表單資料
 * @returns {string} - 構建好的 Prompt
 */
export const buildPrompt = (data) => {
  const { topic, date, points, style } = data;

  // 風格關鍵字映射
  const styleKeywords = {
    'cyberpunk': 'cyberpunk style, neon lights, futuristic city skyline, high tech, glowing elements, dark background with bright accents',
    'pixel-game': 'pixel art style, 8-bit retro game aesthetic, pixelated graphics, vibrant colors, nostalgic gaming vibe',
    'photorealistic': 'photorealistic, ultra high definition 8k resolution, professional photography, cinematic lighting, depth of field, sharp details',
    'retro-poster': 'vintage retro poster design, 1960s-1980s style, bold typography, limited color palette, flat design, classic advertisement aesthetic'
  };

  const selectedStyle = styleKeywords[style] || style;

  // 構建重點項目區塊（只有當有重點項目時才顯示）
  const keyPointsSection = points && points.length > 0 
    ? `- Key Points:
${points.map(p => `  * ${p}`).join('\n')}`
    : '';

  // 核心 Prompt 結構
  const prompt = `
Create a Discord event promotional image in ${selectedStyle}.

Content Requirements:
- Main Title: "${topic}" (bold, sans-serif font, adjust size if text is long, no line breaks)
- Brand: "Skill Hub"
- Subtitle: "Kemie, Ayn, 聖博老師の學習殿堂"
- Event Time: "${date} 晚上9:00-10:00" (clear and prominent)
${keyPointsSection}

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
