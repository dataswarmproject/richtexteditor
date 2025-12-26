import { useCallback, useEffect, useState } from 'react'
import type { Editor } from '@digitaltrendz/core'
import type { AIAssistantState, ChatMessage } from '../types.js'

export interface UseAIAssistantOptions {
  editor: Editor | null
}

export interface UseAIAssistantReturn {
  state: AIAssistantState
  isOpen: boolean
  isLoading: boolean
  messages: ChatMessage[]
  error: string | null
  selectedText: string
  open: (mode?: 'chat' | 'inline' | 'command') => void
  close: () => void
  toggle: (mode?: 'chat' | 'inline' | 'command') => void
  sendMessage: (message: string) => void
  executeAction: (actionId: string) => void
  executeTool: (toolName: string, params: Record<string, unknown>) => void
  clearMessages: () => void
}

const initialState: AIAssistantState = {
  isOpen: false,
  isLoading: false,
  messages: [],
  error: null,
  selectedText: '',
  mode: 'chat',
}

/**
 * React hook for interacting with the AI Assistant extension
 */
export function useAIAssistant({ editor }: UseAIAssistantOptions): UseAIAssistantReturn {
  const [state, setState] = useState<AIAssistantState>(initialState)

  useEffect(() => {
    if (!editor) return

    // Subscribe to AI assistant state changes via custom events
    const handleStateChange = (event: CustomEvent<AIAssistantState>) => {
      setState(event.detail)
    }

    // Listen for state changes from the extension
    const element = editor.view.dom
    element.addEventListener('ai-assistant-state-change' as keyof HTMLElementEventMap, handleStateChange as EventListener)

    return () => {
      element.removeEventListener('ai-assistant-state-change' as keyof HTMLElementEventMap, handleStateChange as EventListener)
    }
  }, [editor])

  const open = useCallback(
    (mode: 'chat' | 'inline' | 'command' = 'chat') => {
      editor?.commands.openAIAssistant(mode)
    },
    [editor],
  )

  const close = useCallback(() => {
    editor?.commands.closeAIAssistant()
  }, [editor])

  const toggle = useCallback(
    (mode?: 'chat' | 'inline' | 'command') => {
      editor?.commands.toggleAIAssistant(mode)
    },
    [editor],
  )

  const sendMessage = useCallback(
    (message: string) => {
      editor?.commands.sendAIMessage(message)
    },
    [editor],
  )

  const executeAction = useCallback(
    (actionId: string) => {
      editor?.commands.executeAIAction(actionId)
    },
    [editor],
  )

  const executeTool = useCallback(
    (toolName: string, params: Record<string, unknown>) => {
      editor?.commands.executeAITool(toolName, params)
    },
    [editor],
  )

  const clearMessages = useCallback(() => {
    editor?.commands.clearAIMessages()
  }, [editor])

  return {
    state,
    isOpen: state.isOpen,
    isLoading: state.isLoading,
    messages: state.messages,
    error: state.error,
    selectedText: state.selectedText,
    open,
    close,
    toggle,
    sendMessage,
    executeAction,
    executeTool,
    clearMessages,
  }
}
