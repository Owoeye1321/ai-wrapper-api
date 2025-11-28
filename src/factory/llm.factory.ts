import ChatGPTWrapper from '../providers/llm/chat-gpt.provider'
import GeminiWrapper from '../providers/llm/gemini.provider'
import GroqWrapper from '../providers/llm/groq.provider'
import { LLMInterface } from '../providers/llm/provider-interface'

class AIFactory {
  private static instance: AIFactory

  public static get getInstance(): AIFactory {
    if (!this.instance) {
      this.instance = new AIFactory()
    }
    return this.instance
  }

  public getWrapper(provider: string = 'groq'): LLMInterface {
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
