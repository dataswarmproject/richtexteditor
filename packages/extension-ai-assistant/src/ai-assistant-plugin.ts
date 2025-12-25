import {
  type Middleware,
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom'
import type { Editor } from '@tiptap/core'
import type { EditorState } from '@tiptap/pm/state'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'

import type {
  AIAction,
  AIAssistantState,
  AIProviderInterface,
  AITool,
  AIToolContext,
  ChatMessage,
} from './types.js'

export interface AIAssistantPluginProps {
  /**
   * The plugin key for the AI assistant.
   * @default 'aiAssistant'
   */
  pluginKey: PluginKey | string

  /**
   * The editor instance.
   */
  editor: Editor

  /**
   * The DOM element for the AI chat panel.
   */
  element: HTMLElement | null

  /**
   * AI provider implementation
   */
  provider?: AIProviderInterface

  /**
   * Available AI tools
   */
  tools: AITool[]

  /**
   * Quick actions for the AI menu
   */
  actions: AIAction[]

  /**
   * Callback when the assistant state changes
   */
  onStateChange?: (state: AIAssistantState) => void

  /**
   * Callback when a message is sent
   */
  onMessage?: (message: ChatMessage) => void

  /**
   * DOM element to append the floating panel to
   */
  appendTo?: HTMLElement | (() => HTMLElement)
}

export type AIAssistantViewProps = AIAssistantPluginProps & {
  view: EditorView
}

/**
 * Generate a unique ID for messages
 */
function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * AI Assistant View class that manages the floating chat interface
 */
export class AIAssistantView {
  public editor: Editor

  public element: HTMLElement | null

  public view: EditorView

  public provider?: AIProviderInterface

  public tools: AITool[]

  public actions: AIAction[]

  private state: AIAssistantState

  private cleanup?: () => void

  private appendTo?: HTMLElement | (() => HTMLElement)

  private onStateChange?: (state: AIAssistantState) => void

  private onMessage?: (message: ChatMessage) => void

  constructor({
    editor,
    element,
    view,
    provider,
    tools,
    actions,
    appendTo,
    onStateChange,
    onMessage,
  }: AIAssistantViewProps) {
    this.editor = editor
    this.element = element
    this.view = view
    this.provider = provider
    this.tools = tools
    this.actions = actions
    this.appendTo = appendTo
    this.onStateChange = onStateChange
    this.onMessage = onMessage

    this.state = {
      isOpen: false,
      isLoading: false,
      messages: [],
      error: null,
      selectedText: '',
      mode: 'chat',
    }

    if (this.element) {
      this.setupElement()
    }
  }

  private setupElement() {
    if (!this.element) return

    // Apply base styles
    this.element.style.position = 'fixed'
    this.element.style.zIndex = '9999'
    this.element.style.display = 'none'

    // Append to container
    const container = typeof this.appendTo === 'function'
      ? this.appendTo()
      : this.appendTo ?? document.body

    container.appendChild(this.element)
  }

  /**
   * Get the current tool context
   */
  getToolContext(): AIToolContext {
    const { state } = this.view
    const { selection } = state
    const { from, to } = selection

    const selectedText = state.doc.textBetween(from, to, ' ')

    return {
      editor: this.editor,
      view: this.view,
      state,
      selection: {
        from,
        to,
        text: selectedText,
        isEmpty: selection.empty,
      },
      document: {
        text: state.doc.textContent,
        json: this.editor.getJSON(),
        html: this.editor.getHTML(),
      },
    }
  }

  /**
   * Open the AI assistant panel
   */
  open(mode: AIAssistantState['mode'] = 'chat') {
    if (!this.element) return

    const { selection } = this.view.state
    const selectedText = this.view.state.doc.textBetween(selection.from, selection.to, ' ')

    this.state = {
      ...this.state,
      isOpen: true,
      mode,
      selectedText,
    }

    this.element.style.display = 'block'
    this.updatePosition()
    this.notifyStateChange()
  }

  /**
   * Close the AI assistant panel
   */
  close() {
    if (!this.element) return

    this.state = {
      ...this.state,
      isOpen: false,
    }

    this.element.style.display = 'none'
    this.cleanup?.()
    this.notifyStateChange()
  }

  /**
   * Toggle the AI assistant panel
   */
  toggle(mode?: AIAssistantState['mode']) {
    if (this.state.isOpen) {
      this.close()
    } else {
      this.open(mode)
    }
  }

  /**
   * Update the position of the floating panel
   */
  private updatePosition() {
    if (!this.element) return

    const { selection } = this.view.state
    const coords = this.view.coordsAtPos(selection.from)

    const virtualElement = {
      getBoundingClientRect: () => ({
        x: coords.left,
        y: coords.top,
        top: coords.top,
        left: coords.left,
        bottom: coords.bottom,
        right: coords.right,
        width: 0,
        height: coords.bottom - coords.top,
        toJSON: () => ({}),
      }),
      getClientRects: () => [
        {
          x: coords.left,
          y: coords.top,
          top: coords.top,
          left: coords.left,
          bottom: coords.bottom,
          right: coords.right,
          width: 0,
          height: coords.bottom - coords.top,
          toJSON: () => ({}),
        },
      ] as unknown as DOMRectList,
    }

    const middlewares: Middleware[] = [
      offset(10),
      flip({ fallbackPlacements: ['top', 'bottom', 'right', 'left'] }),
      shift({ padding: 10 }),
    ]

    this.cleanup = autoUpdate(
      virtualElement,
      this.element,
      () => {
        computePosition(virtualElement, this.element!, {
          placement: 'bottom-start',
          strategy: 'fixed',
          middleware: middlewares,
        }).then(({ x, y }) => {
          if (this.element) {
            this.element.style.left = `${x}px`
            this.element.style.top = `${y}px`
          }
        })
      },
    )
  }

  /**
   * Send a message to the AI assistant
   */
  async sendMessage(content: string): Promise<void> {
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    this.state = {
      ...this.state,
      messages: [...this.state.messages, userMessage],
      isLoading: true,
      error: null,
    }

    this.notifyStateChange()
    this.onMessage?.(userMessage)

    if (!this.provider) {
      // No provider - show a placeholder response
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `I received your message: "${content}". To enable AI responses, please configure an AI provider (OpenAI, Anthropic, or custom).`,
        timestamp: new Date(),
      }

      this.state = {
        ...this.state,
        messages: [...this.state.messages, assistantMessage],
        isLoading: false,
      }

      this.notifyStateChange()
      this.onMessage?.(assistantMessage)
      return
    }

    try {
      const response = await this.provider.complete({
        messages: this.state.messages,
        tools: this.tools,
        context: this.getToolContext(),
      })

      // Handle tool calls if any
      if (response.toolCalls && response.toolCalls.length > 0) {
        for (const toolCall of response.toolCalls) {
          const tool = this.tools.find(t => t.name === toolCall.name)
          if (tool) {
            await tool.execute(toolCall.arguments, this.getToolContext())
          }
        }
      }

      this.state = {
        ...this.state,
        messages: [...this.state.messages, response.message],
        isLoading: false,
      }

      this.notifyStateChange()
      this.onMessage?.(response.message)
    } catch (error) {
      this.state = {
        ...this.state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to get AI response',
      }

      this.notifyStateChange()
    }
  }

  /**
   * Execute a quick action
   */
  async executeAction(actionId: string): Promise<void> {
    const action = this.actions.find(a => a.id === actionId)
    if (!action) return

    this.state = {
      ...this.state,
      isLoading: true,
      error: null,
    }

    this.notifyStateChange()

    try {
      await action.execute(this.getToolContext())

      this.state = {
        ...this.state,
        isLoading: false,
      }
    } catch (error) {
      this.state = {
        ...this.state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to execute action',
      }
    }

    this.notifyStateChange()
  }

  /**
   * Execute a tool directly
   */
  async executeTool(toolName: string, params: Record<string, unknown>): Promise<void> {
    const tool = this.tools.find(t => t.name === toolName)
    if (!tool) return

    this.state = {
      ...this.state,
      isLoading: true,
      error: null,
    }

    this.notifyStateChange()

    try {
      const result = await tool.execute(params, this.getToolContext())

      if (!result.success && result.error) {
        this.state = {
          ...this.state,
          error: result.error,
        }
      }
    } catch (error) {
      this.state = {
        ...this.state,
        error: error instanceof Error ? error.message : 'Failed to execute tool',
      }
    }

    this.state = {
      ...this.state,
      isLoading: false,
    }

    this.notifyStateChange()
  }

  /**
   * Clear the chat history
   */
  clearMessages() {
    this.state = {
      ...this.state,
      messages: [],
      error: null,
    }

    this.notifyStateChange()
  }

  /**
   * Get the current state
   */
  getState(): AIAssistantState {
    return { ...this.state }
  }

  /**
   * Notify state change listeners
   */
  private notifyStateChange() {
    this.onStateChange?.(this.state)
  }

  /**
   * Update handler for editor changes
   */
  update(view: EditorView, prevState?: EditorState) {
    this.view = view

    if (this.state.isOpen) {
      // Update selected text if selection changed
      const { selection } = view.state
      const selectedText = view.state.doc.textBetween(selection.from, selection.to, ' ')

      if (selectedText !== this.state.selectedText) {
        this.state = {
          ...this.state,
          selectedText,
        }
        this.notifyStateChange()
      }

      // Update position
      this.updatePosition()
    }
  }

  /**
   * Cleanup on destroy
   */
  destroy() {
    this.cleanup?.()
    this.element?.remove()
  }
}

/**
 * AI Assistant Plugin Key
 */
export const AIAssistantPluginKey = new PluginKey('aiAssistant')

/**
 * Create the AI Assistant plugin
 */
export const AIAssistantPlugin = (options: AIAssistantPluginProps) => {
  return new Plugin({
    key: typeof options.pluginKey === 'string' ? new PluginKey(options.pluginKey) : options.pluginKey,
    view: view => new AIAssistantView({ view, ...options }),
  })
}
