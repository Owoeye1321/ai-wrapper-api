import { GEMINI_URL } from '../../config/environment-variable.config'
import { LLMInterface } from './provider-interface'

class GeminiWrapper implements LLMInterface {
  private static instance: LLMInterface
  private static readonly maxTries: number = 5

  public static get getInstance(): LLMInterface {
    if (!this.instance) {
      this.instance = new GeminiWrapper()
    }
    return this.instance
  }

  private constructor() {}

  async prompt(prompt: string): Promise<string> {
    // System instructions to guide the model's behavior and persona.
    let answer: string
    let attempt = 0
    const payload = await this.getPayload(prompt)

    console.log('Gemini: Querying the model...')

    while (attempt < GeminiWrapper.maxTries) {
      try {
        const response = await fetch(GEMINI_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        if (!response.ok) {
          const errorBody = await response.text()
          throw new Error(`API Error: ${response.status} - ${errorBody}`)
        }

        const result = await response.json()
        const candidate = result.candidates?.[0]

        if (candidate && candidate.content?.parts?.[0]?.text) {
          answer = candidate.content.parts[0].text as string
        } else {
          console.error('Warning: Model response was empty or malformed.', result)
          answer = "I'm sorry, I couldn't generate a response. Please try again."
        }
      } catch (error) {
        attempt++
        console.error(`Attempt ${attempt} failed: ${(error as Error)?.message}`)
        if (attempt >= GeminiWrapper.maxTries) {
          throw new Error('Failed to connect to the Gemini API after multiple retries.')
        }
        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
    return answer!
  }

  private async getPayload(question: string): Promise<any> {
    const systemInstruction = {
      parts: [
        {
          text: 'You are a friendly, conversational, and highly knowledgeable AI assistant. Keep your responses concise and helpful, and use markdown for formatting.'
        }
      ]
    }

    // Structure the query as a single-turn conversation history
    const history = [
      {
        role: 'user',
        parts: [{ text: question }]
      }
    ]

    // Construct the payload for the API call
    return {
      contents: history,
      // Optional: Add system instructions to guide the model's behavior
      systemInstruction: systemInstruction,
      // Optional: Enable Google Search grounding for up-to-date information
      tools: [{ google_search: {} }]
    }
  }
}

export default GeminiWrapper.getInstance
