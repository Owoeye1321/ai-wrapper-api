import { Groq } from 'groq-sdk'
import { AIWrapperInterface } from './provider-interface'

class GroqWrapper implements AIWrapperInterface {
  private static instance: AIWrapperInterface
  private readonly client: Groq

  private constructor() {
    this.client = new Groq()
  }

  public static get getInstance(): AIWrapperInterface {
    if (!this.instance) {
      this.instance = new GroqWrapper()
    }
    return this.instance
  }

  async prompt(prompt: string): Promise<string> {
    try {
      const chatCompletion = await this.client.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'openai/gpt-oss-20b',
        temperature: 1,
        max_completion_tokens: 8192,
        top_p: 1,
        stream: true,
        reasoning_effort: 'medium',
        stop: null
      })
      let response: string = ''

      for await (const chunk of chatCompletion) {
        const content = chunk.choices[0]?.delta?.content || ''
        response += ` ${content}`
      }
      return this.moderateResponse(response)
    } catch (err) {
      console.error('Groq Error:', (err as any)?.error || err)
      throw new Error("I'm sorry, I couldn't generate a response. Please try again.")
    }
  }

  private moderateResponse(raw: string): string {
    return raw
      .replace(/\s+/g, ' ') // collapse multiple spaces
      .replace(/ /g, ' ') // replace non-breaking spaces
      .replace(/\s([.,!?;:])/g, '$1') // remove space before punctuation
      .replace(/\n/g, ' ') // replace newlines with space
      .trim()
  }
}

export default GroqWrapper.getInstance
