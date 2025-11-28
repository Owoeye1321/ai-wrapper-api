import BaseAgent from './base-agent'
import * as path from 'path'
import fs from 'fs/promises'
import { WebPDFLoader } from '@langchain/community/document_loaders/web/pdf'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { Document } from '@langchain/core/documents'

export default class LangChain extends BaseAgent {
  private async getKnowledgeBaseSource(): Promise<Blob> {
    try {
      console.log('loading knowledge base source from local file system')
      const filePath = path.resolve(__dirname, '../../data/knowledge-base/system-design.pdf')
      // Read the file to ensure it exists
      const buffer = await fs.readFile(filePath)

      // Create a Blob from the buffer
      const blob = new Blob([buffer], { type: 'application/pdf' })
      return blob
    } catch (error) {
      console.log(error)
    }
  }

  async loadKnowledgeBase(): Promise<Document[]> {
    // For demonstration purposes, we create a simple knowledge base with static documents.
    try {
      const blobContent = await this.getKnowledgeBaseSource()

      const loader = new WebPDFLoader(blobContent)
      const documents = await loader.load()

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200
      })

      const allSplits = await textSplitter.splitDocuments(documents)

      return allSplits
    } catch (error) {
      console.log(error)
    }
  }
}
