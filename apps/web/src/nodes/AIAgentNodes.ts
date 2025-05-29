
/**
 * AI Agent Nodes
 * 
 * Purpose:
 * Nodes for AI-powered automation that leverage large language models and
 * other AI capabilities to perform tasks that require natural language
 * understanding, content generation, and pattern recognition.
 * 
 * Configuration Options:
 * - Name: Identifier for the node
 * - Description: Optional explanation of the AI task
 * - AI Provider: The service providing the AI capability (e.g., OpenAI, Anthropic)
 * - Model: The specific AI model to use
 * - Prompt: Template for instructions to the AI
 * - Input variables: Data to incorporate into the prompt
 * - Output mapping: How to extract and structure AI responses
 * - Parameters: Model-specific settings (temperature, max tokens, etc.)
 * 
 * Usage:
 * - Content generation (text, images, code)
 * - Text classification and sentiment analysis
 * - Data extraction from unstructured content
 * - Question answering and knowledge base queries
 * - Natural language processing tasks
 */

export interface AIAgentNodeConfig {
  name: string;
  description?: string;
  provider: 'openai' | 'anthropic' | 'google';
  model: string;
  prompt: string;
  systemMessage?: string;
  inputVariables: string[]; // Variables to inject into prompt
  outputMapping: {
    destination: string;
    format: 'raw' | 'json' | 'structured';
    extractionRules?: Record<string, string>; // For structured output
  };
  parameters: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    presencePenalty?: number;
    frequencyPenalty?: number;
  };
  caching?: {
    enabled: boolean;
    ttl: number; // Time to live in seconds
  };
}
