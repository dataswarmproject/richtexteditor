import { Extension } from '@digitaltrendz/core'
import { PluginKey } from '@digitaltrendz/pm/state'

import {
  AIAssistantPlugin,
  AIAssistantPluginKey,
  type AIAssistantPluginProps,
  AIAssistantView,
} from './ai-assistant-plugin.js'
import type {
  AIAction,
  AIAssistantState,
  AIProviderInterface,
  AITool,
  ChatMessage,
} from './types.js'
import {
  expandTextTool,
  fixGrammarTool,
  formatTextTool,
  generateTextTool,
  insertContentTool,
  replaceSelectionTool,
  rewriteTextTool,
  simplifyTextTool,
  summarizeTool,
  translateTool,
} from './tools/index.js'

export interface AIAssistantOptions {
  /**
   * The plugin key for the AI assistant.
   * @default 'aiAssistant'
   */
  pluginKey: PluginKey | string

  /**
   * The DOM element for the AI chat panel.
   * @default null
   */
  element: HTMLElement | null

  /**
   * AI provider implementation (OpenAI, Anthropic, or custom)
   */
  provider?: AIProviderInterface

  /**
   * Additional AI tools to register
   * @default []
   */
  tools: AITool[]

  /**
   * Quick actions for the AI menu
   * @default []
   */
  actions: AIAction[]

  /**
   * Enable default built-in tools
   * @default true
   */
  enableDefaultTools: boolean

  /**
   * Enable default quick actions
   * @default true
   */
  enableDefaultActions: boolean

  /**
   * Callback when the assistant state changes
   */
  onStateChange?: (state: AIAssistantState) => void

  /**
   * Callback when a message is sent/received
   */
  onMessage?: (message: ChatMessage) => void

  /**
   * DOM element to append the floating panel to
   */
  appendTo?: HTMLElement | (() => HTMLElement)

  /**
   * Keyboard shortcut to open the AI assistant
   * @default 'Mod-j'
   */
  shortcut: string

  /**
   * Keyboard shortcut to open inline AI mode
   * @default 'Mod-k'
   */
  inlineShortcut: string
}

/**
 * Default AI tools
 */
const defaultTools: AITool[] = [
  generateTextTool,
  rewriteTextTool,
  summarizeTool,
  translateTool,
  fixGrammarTool,
  expandTextTool,
  simplifyTextTool,
  formatTextTool,
  insertContentTool,
  replaceSelectionTool,
]

/**
 * Default quick actions
 */
const defaultActions: AIAction[] = [
  {
    id: 'improve-writing',
    label: 'Improve writing',
    description: 'Enhance clarity and style',
    shortcut: 'Mod-Shift-I',
    execute: async context => {
      if (context.selection.isEmpty) return
      await rewriteTextTool.execute({ tone: 'professional', style: 'concise' }, context)
    },
  },
  {
    id: 'fix-grammar',
    label: 'Fix grammar & spelling',
    description: 'Correct errors in text',
    shortcut: 'Mod-Shift-G',
    execute: async context => {
      await fixGrammarTool.execute({ scope: 'selection' }, context)
    },
  },
  {
    id: 'make-shorter',
    label: 'Make shorter',
    description: 'Condense the text',
    execute: async context => {
      if (context.selection.isEmpty) return
      await rewriteTextTool.execute({ style: 'concise' }, context)
    },
  },
  {
    id: 'make-longer',
    label: 'Make longer',
    description: 'Expand with more details',
    execute: async context => {
      if (context.selection.isEmpty) return
      await expandTextTool.execute({ expansionType: 'elaborate', targetLength: 'moderately' }, context)
    },
  },
  {
    id: 'simplify',
    label: 'Simplify language',
    description: 'Make easier to understand',
    execute: async context => {
      if (context.selection.isEmpty) return
      await simplifyTextTool.execute({ targetAudience: 'general' }, context)
    },
  },
  {
    id: 'summarize',
    label: 'Summarize',
    description: 'Create a brief summary',
    execute: async context => {
      await summarizeTool.execute({ length: 'brief', format: 'paragraph' }, context)
    },
  },
  {
    id: 'translate',
    label: 'Translate',
    description: 'Translate to another language',
    execute: async context => {
      // This would typically show a language picker
      await translateTool.execute({ targetLanguage: 'spanish' }, context)
    },
  },
  {
    id: 'to-bullet-list',
    label: 'Convert to bullet list',
    description: 'Format as bullet points',
    execute: async context => {
      if (context.selection.isEmpty) return
      await formatTextTool.execute({ format: 'bullet-list' }, context)
    },
  },
]

declare module '@digitaltrendz/core' {
  interface Commands<ReturnType> {
    aiAssistant: {
      /**
       * Open the AI assistant panel
       * @example editor.commands.openAIAssistant()
       */
      openAIAssistant: (mode?: 'chat' | 'inline' | 'command') => ReturnType
      /**
       * Close the AI assistant panel
       * @example editor.commands.closeAIAssistant()
       */
      closeAIAssistant: () => ReturnType
      /**
       * Toggle the AI assistant panel
       * @example editor.commands.toggleAIAssistant()
       */
      toggleAIAssistant: (mode?: 'chat' | 'inline' | 'command') => ReturnType
      /**
       * Send a message to the AI assistant
       * @example editor.commands.sendAIMessage('Help me write a summary')
       */
      sendAIMessage: (message: string) => ReturnType
      /**
       * Execute an AI action
       * @example editor.commands.executeAIAction('improve-writing')
       */
      executeAIAction: (actionId: string) => ReturnType
      /**
       * Execute an AI tool
       * @example editor.commands.executeAITool('generate_text', { prompt: 'Write a poem' })
       */
      executeAITool: (toolName: string, params: Record<string, unknown>) => ReturnType
      /**
       * Clear AI chat history
       * @example editor.commands.clearAIMessages()
       */
      clearAIMessages: () => ReturnType
    }
  }
}

/**
 * AI Assistant extension for tiptap
 * Provides a floating chat interface with agentic AI capabilities for document editing.
 */
export const AIAssistant = Extension.create<AIAssistantOptions>({
  name: 'aiAssistant',

  addOptions() {
    return {
      pluginKey: AIAssistantPluginKey,
      element: null,
      provider: undefined,
      tools: [],
      actions: [],
      enableDefaultTools: true,
      enableDefaultActions: true,
      onStateChange: undefined,
      onMessage: undefined,
      appendTo: undefined,
      shortcut: 'Mod-j',
      inlineShortcut: 'Mod-k',
    }
  },

  addStorage() {
    return {
      view: null as AIAssistantView | null,
    }
  },

  addCommands() {
    return {
      openAIAssistant:
        (mode = 'chat') =>
        ({ editor }) => {
          const plugin = editor.state.plugins.find(
            p => p.spec.key === this.options.pluginKey || p.spec.key?.key === 'aiAssistant',
          )

          if (plugin) {
            const view = (plugin as unknown as { spec: { view: () => AIAssistantView } }).spec.view
            if (view && typeof view === 'object' && 'open' in view) {
              ;(view as AIAssistantView).open(mode)
            }
          }

          return true
        },

      closeAIAssistant:
        () =>
        ({ editor }) => {
          const plugin = editor.state.plugins.find(
            p => p.spec.key === this.options.pluginKey || p.spec.key?.key === 'aiAssistant',
          )

          if (plugin) {
            const view = (plugin as unknown as { spec: { view: () => AIAssistantView } }).spec.view
            if (view && typeof view === 'object' && 'close' in view) {
              ;(view as AIAssistantView).close()
            }
          }

          return true
        },

      toggleAIAssistant:
        mode =>
        ({ editor }) => {
          const plugin = editor.state.plugins.find(
            p => p.spec.key === this.options.pluginKey || p.spec.key?.key === 'aiAssistant',
          )

          if (plugin) {
            const view = (plugin as unknown as { spec: { view: () => AIAssistantView } }).spec.view
            if (view && typeof view === 'object' && 'toggle' in view) {
              ;(view as AIAssistantView).toggle(mode)
            }
          }

          return true
        },

      sendAIMessage:
        message =>
        ({ editor }) => {
          const plugin = editor.state.plugins.find(
            p => p.spec.key === this.options.pluginKey || p.spec.key?.key === 'aiAssistant',
          )

          if (plugin) {
            const view = (plugin as unknown as { spec: { view: () => AIAssistantView } }).spec.view
            if (view && typeof view === 'object' && 'sendMessage' in view) {
              ;(view as AIAssistantView).sendMessage(message)
            }
          }

          return true
        },

      executeAIAction:
        actionId =>
        ({ editor }) => {
          const plugin = editor.state.plugins.find(
            p => p.spec.key === this.options.pluginKey || p.spec.key?.key === 'aiAssistant',
          )

          if (plugin) {
            const view = (plugin as unknown as { spec: { view: () => AIAssistantView } }).spec.view
            if (view && typeof view === 'object' && 'executeAction' in view) {
              ;(view as AIAssistantView).executeAction(actionId)
            }
          }

          return true
        },

      executeAITool:
        (toolName, params) =>
        ({ editor }) => {
          const plugin = editor.state.plugins.find(
            p => p.spec.key === this.options.pluginKey || p.spec.key?.key === 'aiAssistant',
          )

          if (plugin) {
            const view = (plugin as unknown as { spec: { view: () => AIAssistantView } }).spec.view
            if (view && typeof view === 'object' && 'executeTool' in view) {
              ;(view as AIAssistantView).executeTool(toolName, params)
            }
          }

          return true
        },

      clearAIMessages:
        () =>
        ({ editor }) => {
          const plugin = editor.state.plugins.find(
            p => p.spec.key === this.options.pluginKey || p.spec.key?.key === 'aiAssistant',
          )

          if (plugin) {
            const view = (plugin as unknown as { spec: { view: () => AIAssistantView } }).spec.view
            if (view && typeof view === 'object' && 'clearMessages' in view) {
              ;(view as AIAssistantView).clearMessages()
            }
          }

          return true
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      [this.options.shortcut]: () => this.editor.commands.toggleAIAssistant('chat'),
      [this.options.inlineShortcut]: () => this.editor.commands.toggleAIAssistant('inline'),
    }
  },

  addProseMirrorPlugins() {
    const { enableDefaultTools, enableDefaultActions } = this.options

    const tools = [
      ...(enableDefaultTools ? defaultTools : []),
      ...this.options.tools,
    ]

    const actions = [
      ...(enableDefaultActions ? defaultActions : []),
      ...this.options.actions,
    ]

    if (!this.options.element) {
      return []
    }

    return [
      AIAssistantPlugin({
        pluginKey: this.options.pluginKey,
        editor: this.editor,
        element: this.options.element,
        provider: this.options.provider,
        tools,
        actions,
        onStateChange: this.options.onStateChange,
        onMessage: this.options.onMessage,
        appendTo: this.options.appendTo,
      }),
    ]
  },
})
