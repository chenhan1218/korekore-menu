/**
 * Gemini Adapter (Infrastructure Layer)
 *
 * Implements the GeminiPort interface by actually calling Gemini API.
 * This is where framework-specific dependencies (Firebase, Google AI) live.
 */

import { GeminiPort } from '@/domain/ports'
import { MenuItem, createMenuItem } from '@/domain/entities'
import { AppError, ErrorCode } from '@/shared/types'

/**
 * Gemini API adapter implementation
 *
 * Converts Gemini API responses into Domain entities
 */
export class GeminiAdapter implements GeminiPort {
  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env['VITE_GEMINI_API_KEY']

    if (!this.apiKey) {
      throw new Error('Gemini API Key is required')
    }
  }

  async parseImage(
    imageBase64: string,
    language: 'zh_TW' | 'en' = 'zh_TW'
  ): Promise<MenuItem[]> {
    try {
      // TODO: Implement actual Gemini API call
      // This is a placeholder that will be replaced with real implementation
      // when @google/generative-ai is integrated

      // For now, return empty array to match interface
      return []

      /*
      // Example implementation (pseudocode):
      const genAI = new GoogleGenerativeAI(this.apiKey)
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

      const prompt = this.buildPrompt(language)
      const response = await model.generateContent([
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64,
          },
        },
        prompt,
      ])

      const responseText = response.response.text()
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)

      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }

      const parsedJson = JSON.parse(jsonMatch[0])
      this.validateResponse(parsedJson)

      return parsedJson.items.map((item: any) =>
        createMenuItem(
          item.id,
          item.name,
          item.name_zh_TW,
          item.price,
          item.description,
          item.image
        )
      )
      */
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }

      if (error instanceof SyntaxError) {
        throw new AppError(
          ErrorCode.PARSE_ERROR,
          `Failed to parse Gemini response: ${error.message}`,
          'AI 響應解析失敗，請重試',
          true
        )
      }

      throw new AppError(
        ErrorCode.GEMINI_API_ERROR,
        `Gemini API error: ${error instanceof Error ? error.message : 'Unknown'}`,
        'AI 服務暫時不可用，請稍後重試',
        true
      )
    }
  }

  /**
   * Build Gemini prompt based on language
   */
  private buildPrompt(language: 'zh_TW' | 'en'): string {
    if (language === 'zh_TW') {
      return `
請分析這張菜單圖片，並用以下 JSON 格式返回菜單數據：

{
  "items": [
    {
      "id": "unique_id",
      "name": "原文菜名",
      "name_zh_TW": "繁體中文翻譯及簡單口感描述",
      "price": "價格"
    }
  ]
}

要求：
1. 每個菜單項目必須包含：id, name, name_zh_TW, price
2. 返回所有找到的菜單項目
`
    }

    return `
Please analyze this menu image and return menu data in JSON format:

{
  "items": [
    {
      "id": "unique_id",
      "name": "Original name",
      "name_zh_TW": "Traditional Chinese translation",
      "price": "Price"
    }
  ]
}

Requirements:
1. Each item must include: id, name, name_zh_TW, price
2. Return all found menu items
`
  }

  /**
   * Validate Gemini response schema
   */
  private validateResponse(data: any): asserts data is { items: MenuItem[] } {
    if (!data.items || !Array.isArray(data.items)) {
      throw new Error('Response missing items array')
    }

    data.items.forEach((item: any, index: number) => {
      if (!item.id || !item.name || !item.name_zh_TW || item.price === undefined) {
        throw new Error(`Invalid item at index ${index}: missing required fields`)
      }
    })
  }
}
