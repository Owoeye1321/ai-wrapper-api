import ChatGPTWrapper from '../providers/chat-gpt.provider'
import GeminiWrapper from '../providers/gemini.provider'
import GroqWrapper from '../providers/groq.provider'
import { AIWrapperInterface } from '../providers/provider-interface'

class AIFactory {
  private static instance: AIFactory

  public static get getInstance(): AIFactory {
    if (!this.instance) {
      this.instance = new AIFactory()
    }
    return this.instance
  }

  public getWrapper(provider: string = 'groq'): AIWrapperInterface {
    switch (provider) {
      case 'openai':
        return ChatGPTWrapper
      case 'anthropic':
        return GeminiWrapper
      case 'groq':
        return GroqWrapper
      default:
        throw new Error(`Unknown AI wrapper type: ${provider}`)
    }
  }
}

export default AIFactory.getInstance
