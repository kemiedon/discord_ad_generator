/**
 * 構建 nano-banana pro API 的 Prompt
 * @param {Object} data - 表單資料
 * @param {boolean} hasReferenceImage - 是否有參考圖片
 * @returns {string} - 構建好的 Prompt
 */
export const buildPrompt = (data, hasReferenceImage = false) => {
  const { topic, date, points, style } = data;

  // 風格關鍵字映射
  const styleKeywords = {
    'cyberpunk': 'cyberpunk style, neon lights, futuristic city skyline, high tech, glowing elements, dark background with bright accents',
    'pixel-game': 'pixel art style, 8-bit retro game aesthetic, pixelated graphics, vibrant colors, nostalgic gaming vibe',
    'photorealistic': 'photorealistic, ultra high definition 8k resolution, professional photography, cinematic lighting, depth of field, sharp details',
    'retro-poster': 'vintage retro poster design, 1960s-1980s style, bold typography, limited color palette, flat design, classic advertisement aesthetic'
  };

  const selectedStyle = styleKeywords[style] || style;

  // 如果有參考圖片，添加風格參考說明
  const styleReferenceNote = hasReferenceImage 
    ? '\n\nSTYLE REFERENCE NOTE:\n- A reference image is provided for style inspiration\n- Use the reference image to inspire the overall visual style, color palette, composition, and artistic direction\n- DO NOT copy or composite elements from the reference image\n- Instead, learn from its aesthetic qualities: lighting, mood, color harmony, artistic treatment\n- Create an original design that captures the essence and feeling of the reference style'
    : '';

  // 構建重點項目區塊（只有當有重點項目時才顯示）
  const keyPointsSection = points && points.length > 0 
    ? `- Key Points:
${points.map(p => `  * ${p}`).join('\n')}`
    : '';

  // 核心 Prompt 結構
  const prompt = `
Create a Discord event promotional image in ${selectedStyle}.

Content Requirements:
- Main Title: "${topic}" (bold, prominent, sans-serif font, centered or top-aligned)
- Brand: "Skill Hub" text with logo icon (the logo image is provided separately). Position the logo to the left of "Skill Hub" text. The logo should be small and proportional to the text size.
- Subtitle: "Kemie, Ayn, 聖博老師の學習殿堂" (smaller font, below brand)
- Event Time: "${date} 晚上9:00-10:00" (clear, bold, easy to read)
${keyPointsSection}

CRITICAL - Text Readability Requirements:
1. Background Design:
   - MUST include dedicated text area with solid or gradient background
   - Create a semi-transparent panel/card for text overlay
   - Use blur effect or vignette to create contrast

2. Text Overlay Strategy:
   - For dark backgrounds: Add white/light semi-transparent panel (rgba(255,255,255,0.85))
   - For light backgrounds: Add dark semi-transparent panel (rgba(0,0,0,0.75))
   - Ensure minimum contrast ratio of 4.5:1 between text and background

3. Typography:
   - Title: Bold, high contrast, shadow effect if needed
   - All text must be sharp and clearly legible
   - Use drop shadows or outlines for text if background is complex

4. Layout:
   - Reserve 30-40% of image space for text content
   - Text should be on a stable, readable background
   - Avoid placing text over busy patterns or complex images

Image Specifications:
- Dimensions: 1080x1080px (square format)
- Format: High quality PNG/JPEG
- Style: ${selectedStyle}
- Target Platform: Discord, optimized for social media display
- Ensure professional, clean, and readable design
${styleReferenceNote}
  `.trim();

  return prompt;
};
