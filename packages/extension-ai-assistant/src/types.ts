import type { Editor } from '@tiptap/core'
import type { EditorState } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'

/**
 * AI Provider types
 */
export type AIProvider = 'openai' | 'anthropic' | 'custom'

/**
 * Message role in conversation
 */
export type MessageRole = 'user' | 'assistant' | 'system'

/**
 * Chat message structure
 */
export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  metadata?: Record<string, unknown>
}

/**
 * AI Tool definition for agentic capabilities
 */
export interface AITool {
  /**
   * Unique identifier for the tool
   */
  name: string

  /**
   * Human-readable description of what the tool does
   */
  description: string

  /**
   * JSON Schema for tool parameters
   */
  parameters: {
    type: 'object'
    properties: Record<string, {
      type: string
      description: string
      enum?: string[]
      required?: boolean
    }>
    required?: string[]
  }

  /**
   * Execute the tool with given parameters
   */
  execute: (params: Record<string, unknown>, context: AIToolContext) => Promise<AIToolResult>
}

/**
 * Context provided to AI tools during execution
 */
export interface AIToolContext {
  editor: Editor
  view: EditorView
  state: EditorState
  selection: {
    from: number
    to: number
    text: string
    isEmpty: boolean
  }
  document: {
    text: string
    json: unknown
    html: string
  }
}

/**
 * Result returned from AI tool execution
 */
export interface AIToolResult {
  success: boolean
  message?: string
  data?: unknown
  error?: string
}

/**
 * AI completion request
 */
export interface AICompletionRequest {
  messages: ChatMessage[]
  tools?: AITool[]
  context?: Partial<AIToolContext>
  stream?: boolean
  maxTokens?: number
  temperature?: number
}

/**
 * AI completion response
 */
export interface AICompletionResponse {
  message: ChatMessage
  toolCalls?: Array<{
    id: string
    name: string
    arguments: Record<string, unknown>
  }>
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

/**
 * Streaming chunk from AI completion
 */
export interface AIStreamChunk {
  id: string
  delta: string
  done: boolean
  toolCall?: {
    id: string
    name: string
    arguments: string
  }
}

/**
 * AI Provider interface for custom implementations
 */
export interface AIProviderInterface {
  /**
   * Complete a chat conversation
   */
  complete(request: AICompletionRequest): Promise<AICompletionResponse>

  /**
   * Stream a chat completion
   */
  stream(request: AICompletionRequest): AsyncGenerator<AIStreamChunk>

  /**
   * Check if the provider is configured and ready
   */
  isReady(): boolean
}

/**
 * AI Assistant state
 */
export interface AIAssistantState {
  isOpen: boolean
  isLoading: boolean
  messages: ChatMessage[]
  error: string | null
  selectedText: string
  mode: 'chat' | 'inline' | 'command'
}

/**
 * AI Action types for quick actions menu
 */
export interface AIAction {
  id: string
  label: string
  icon?: string
  description?: string
  shortcut?: string
  execute: (context: AIToolContext) => Promise<void>
}

/**
 * Configuration for inline AI suggestions
 */
export interface InlineSuggestionConfig {
  /**
   * Trigger character for inline suggestions (e.g., '/')
   * @default '/'
   */
  trigger: string

  /**
   * Debounce delay for suggestions in ms
   * @default 300
   */
  debounce: number

  /**
   * Maximum number of suggestions to show
   * @default 5
   */
  maxSuggestions: number
}
