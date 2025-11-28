import { Groq } from 'groq-sdk'
import { LLMInterface } from './provider-interface'
import Pinecoin from '../vector-handler/pinecoin'
import logger from '@/config/logger'

class GroqWrapper implements LLMInterface {
  private static instance: LLMInterface
  private readonly client: Groq

  private constructor() {
    this.client = new Groq()
  }

  public static get getInstance(): LLMInterface {
    if (!this.instance) {
      this.instance = new GroqWrapper()
    }
    return this.instance
  }

  async prompt(prompt: string): Promise<string> {
    try {
      const vectorStore = await Pinecoin.getClient()
      const knowledgeBaseResult = await vectorStore.similaritySearch(prompt)
      if (knowledgeBaseResult.length === 0) {
        logger.info('Pinecone: No relevant documents found, updating vector store...')
        await Pinecoin.storeVector()
        await this.prompt(prompt)
      }

      const context = knowledgeBaseResult.map((r) => r.pageContent).join('\n\n')

      // 2. prepare RAG prompt
      const ragPrompt = `
        Use the context to answer the question.
        If the context does not contain the answer, say "I don't know".

        --- CONTEXT ---
        ${context}

        --- QUESTION ---
        ${prompt}
      `

      const llmDeepResult = await this.client.chat.completions.create({
        messages: [{ role: 'user', content: ragPrompt }],
        model: 'openai/gpt-oss-20b',
        temperature: 1,
        max_completion_tokens: 8192,
        top_p: 1,
        stream: true,
        reasoning_effort: 'medium',
        stop: null
      })

      let response: string = ''

      for await (const chunk of llmDeepResult) {
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
