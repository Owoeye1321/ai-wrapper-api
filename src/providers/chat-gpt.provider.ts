import OpenAI from 'openai/index.js'
import { AIWrapperInterface } from './provider-interface'
import { OPENAI_API_KEY } from '../config/environment-variable.config'
import httpStatus from 'http-status'
import ApiError from '../utility/errors/api.error'

class ChatGPTWrapper implements AIWrapperInterface {
  private static instance: AIWrapperInterface
  private readonly model: string
  private readonly client: OpenAI

  private constructor() {
    this.model = 'gpt-3.5-turbo'
    this.client = new OpenAI({
      apiKey: OPENAI_API_KEY
    })
  }

  public static get getInstance(): AIWrapperInterface {
    if (!this.instance) {
      this.instance = new ChatGPTWrapper()
    }
    return this.instance
  }

  async prompt(prompt: string): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
      console.log(response)

      return response.choices[0].message.content as string
    } catch (err) {
      console.error('ChatGPT Error:', (err as any)?.error || err)
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "I'm sorry, I couldn't generate a response. Please try again."
      )
    }
  }
}

export default ChatGPTWrapper.getInstance
