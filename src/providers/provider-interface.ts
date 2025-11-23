export interface AIWrapperInterface { 
    prompt (prompt: string): Promise<string>;
}