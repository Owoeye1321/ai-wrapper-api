import { PineconeStore } from '@langchain/pinecone'
import { Pinecone as PineconeClient } from '@pinecone-database/pinecone'
import GeminiEmbedding from '@/providers/embeddings/gemini'
import type { EmbeddingsInterface } from '@langchain/core/embeddings'
import { PINECONE_API_KEY } from '@/config/environment-variable.config'
import LangChain from '../agent/langchain'
import logger from '@/config/logger'

class Pinecoin {
  private static instance: Pinecoin
  public static get getInstance(): Pinecoin {
    if (!this.instance) {
      this.instance = new Pinecoin()
    }
    return this.instance
  }

  getClient(): PineconeStore {
    const pinecone = new PineconeClient({
      apiKey: PINECONE_API_KEY
    })
    const pineconeIndex = pinecone.Index('design-pattern-vector')
    const embedding = GeminiEmbedding.getClient()
    const vectorStore = new PineconeStore(embedding as EmbeddingsInterface<number[]>, {
      pineconeIndex,
      maxConcurrency: 5
    })
    return vectorStore
  }

  async storeVector(): Promise<unknown> {
    logger.info('Pinecone: Storing documents in the vector store...')
    const documents = await new LangChain().loadKnowledgeBase()
    return this.getClient().addDocuments(documents)
  }
}

export default Pinecoin.getInstance
