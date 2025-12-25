// Core components
export * from './AIDocumentEditor.js'
export * from './AIDocumentEditorProvider.js'
export * from './useAIDocumentEditor.js'

// Extensions bundle
export * from './extensions.js'

// Re-export AI assistant components
export {
  AIAssistant,
  type AIAssistantOptions,
  type AIAction,
  type AITool,
  type AIToolContext,
  type AIToolResult,
  type AIProviderInterface,
  type ChatMessage,
  type AIAssistantState,
} from '@tiptap/extension-ai-assistant'

export {
  AIAssistantPanel,
  AIQuickActions,
  AIInlinePrompt,
  useAIAssistant,
} from '@tiptap/extension-ai-assistant/react'

// Re-export pagination
export {
  Pagination,
  Page,
  PageBreak,
  PageHeader,
  PageFooter,
  PageNumber,
  type PaginationOptions,
  type PageOptions,
} from '@tiptap/extension-pagination'

// Re-export core tiptap utilities
export { useEditor, EditorContent, type Editor } from '@tiptap/react'
export { Extension, Node, Mark } from '@tiptap/core'
