export interface LLMInterface {
  prompt(prompt: string): Promise<string>
}
