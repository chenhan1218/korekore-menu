/**
 * Gemini Adapter (Infrastructure Layer)
 *
 * Implements the GeminiPort interface by actually calling Gemini API.
 * This is where framework-specific dependencies (Firebase, Google AI) live.
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import { GeminiPort } from '@/domain/ports'
import { MenuItem, createMenuItem } from '@/domain/entities'
import { AppError, ErrorCode } from '@/shared/types'

/**
 * Configuration for Gemini API calls
 */
interface GeminiAdapterConfig {
  maxRetries?: number
  timeoutMs?: number
}

/**
 * Gemini API adapter implementation
 *
 * Converts Gemini API responses into Domain entities
 */
export class GeminiAdapter implements GeminiPort {
  private apiKey: string
  private genAI: GoogleGenerativeAI
  private maxRetries: number
  private timeoutMs: number
  private model: string = 'gemini-1.5-flash'

  constructor(apiKey?: string, config?: GeminiAdapterConfig) {
    this.apiKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY

    if (!this.apiKey) {
      throw new Error('Gemini API Key is required')
    }

    this.genAI = new GoogleGenerativeAI(this.apiKey)
    this.maxRetries = config?.maxRetries ?? 3
    this.timeoutMs = config?.timeoutMs ?? 30000
  }

  async parseImage(
    imageBase64: string,
    language: 'zh_TW' | 'en' = 'zh_TW'
  ): Promise<MenuItem[]> {
    // Input validation
    if (!imageBase64 || imageBase64.trim().length === 0) {
      throw new AppError(
        ErrorCode.INVALID_IMAGE_FORMAT,
        'Image data is empty',
        '圖片數據無效',
        false
      )
    }

    return this.parseImageWithRetry(imageBase64, language, 0)
  }

  /**
   * Parse image with retry logic and timeout
   */
  private async parseImageWithRetry(
    imageBase64: string,
    language: 'zh_TW' | 'en',
    attempt: number
  ): Promise<MenuItem[]> {
    try {
      const result = await this.callGeminiAPI(imageBase64, language)
      return result
    } catch (error) {
      // Check if error is retryable
      const isRetryable =
        error instanceof AppError && error.retry && attempt < this.maxRetries

      if (isRetryable) {
        // Exponential backoff: 1s, 2s, 4s
        const delayMs = Math.pow(2, attempt) * 1000
        await this.delay(delayMs)
        return this.parseImageWithRetry(imageBase64, language, attempt + 1)
      }

      throw error
    }
  }

  /**
   * Call Gemini API with timeout
   */
  private async callGeminiAPI(
    imageBase64: string,
    language: 'zh_TW' | 'en'
  ): Promise<MenuItem[]> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.model })

      const prompt = this.buildPrompt(language)

      // Extract MIME type from base64 (default to jpeg if not specified)
      const mimeType = this.extractMimeType(imageBase64) || 'image/jpeg'

      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(
            new AppError(
              ErrorCode.NETWORK_ERROR,
              'Gemini API request timeout',
              'AI 服務回應超時，請稍後重試',
              true
            )
          )
        }, this.timeoutMs)
      })

      // Race between API call and timeout
      const response = await Promise.race([
        model.generateContent([
          {
            inlineData: {
              mimeType,
              data: this.cleanBase64(imageBase64),
            },
          },
          prompt,
        ]),
        timeoutPromise,
      ])

      const responseText = response.response.text()

      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new AppError(
          ErrorCode.PARSE_ERROR,
          'No JSON found in Gemini response',
          'AI 無法識別菜單，請嘗試其他圖片',
          true
        )
      }

      const parsedJson = JSON.parse(jsonMatch[0])
      this.validateResponse(parsedJson)

      return parsedJson.items.map((item: any) =>
        createMenuItem(
          item.id || this.generateId(),
          item.name,
          item.name_zh_TW,
          item.price || '',
          item.description,
          item.image
        )
      )
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

      // Wrap other errors
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new AppError(
        ErrorCode.GEMINI_API_ERROR,
        `Gemini API error: ${message}`,
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
3. price 必須是字符串格式
4. 如果菜單有分類，請在 name_zh_TW 中適當說明
`
    }

    return `
Please analyze this menu image and return menu data in JSON format:

{
  "items": [
    {
      "id": "unique_id",
      "name": "Original name",
      "name_zh_TW": "Traditional Chinese translation and brief description",
      "price": "Price"
    }
  ]
}

Requirements:
1. Each item must include: id, name, name_zh_TW, price
2. Return all found menu items
3. price must be a string format
4. If menu has categories, mention them in name_zh_TW
`
  }

  /**
   * Validate Gemini response schema
   */
  private validateResponse(data: any): asserts data is { items: MenuItem[] } {
    if (!data.items || !Array.isArray(data.items)) {
      throw new Error('Response missing items array')
    }

    if (data.items.length === 0) {
      throw new Error('No items found in response')
    }

    data.items.forEach((item: any, index: number) => {
      if (!item.name || !item.name_zh_TW) {
        throw new Error(`Invalid item at index ${index}: missing required fields (name, name_zh_TW)`)
      }
    })
  }

  /**
   * Extract MIME type from base64 string
   * Looks for data URL prefix like: data:image/jpeg;base64,
   */
  private extractMimeType(imageBase64: string): string | null {
    const match = imageBase64.match(/^data:([^;]+);base64,/)
    return (match && match[1]) ?? null
  }

  /**
   * Clean base64 string by removing data URL prefix if present
   */
  private cleanBase64(imageBase64: string): string {
    return imageBase64.replace(/^data:[^;]+;base64,/, '')
  }

  /**
   * Generate unique ID for menu items
   */
  private generateId(): string {
    return `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  /**
   * Delay utility for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
