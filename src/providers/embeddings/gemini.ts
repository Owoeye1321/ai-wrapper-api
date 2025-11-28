import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { EmbeddingInterface } from './embedding-interface'
import { GEMINI_API_KEY } from '@/config/environment-variable.config'

class Gemini implements EmbeddingInterface {
  private static instance: EmbeddingInterface
  public static get getInstance(): EmbeddingInterface {
    if (!this.instance) {
      this.instance = new Gemini()
    }
    return this.instance
  }
  getClient(): unknown {
    // Implementation for Gemini embeddings client
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: 'text-embedding-004',
      apiKey: GEMINI_API_KEY
    })

    return embeddings
  }
}

export default Gemini.getInstance
