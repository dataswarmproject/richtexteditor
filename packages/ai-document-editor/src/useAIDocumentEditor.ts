import { useCallback, useMemo, useRef, useEffect } from 'react'
import { useEditor, type Editor } from '@inkflow/react'
import type { Content, Extensions } from '@inkflow/core'
import { AIDocumentEditorKit, type AIDocumentEditorKitOptions } from './extensions.js'
import type { AIProviderInterface, AIAssistantState } from '@inkflow/extension-ai-assistant'

export interface UseAIDocumentEditorOptions {
  /**
   * Initial content for the editor
   */
  content?: Content

  /**
   * AI provider implementation
   */
  aiProvider?: AIProviderInterface

  /**
   * Extension kit options
   */
  extensions?: AIDocumentEditorKitOptions

  /**
   * Additional extensions to include
   */
  additionalExtensions?: Extensions

  /**
   * Whether the editor is editable
   * @default true
   */
  editable?: boolean

  /**
   * Autofocus behavior
   * @default false
   */
  autofocus?: boolean | 'start' | 'end' | 'all' | number

  /**
   * Callback when the editor is ready
   */
  onReady?: (editor: Editor) => void

  /**
   * Callback when content changes
   */
  onUpdate?: (editor: Editor) => void

  /**
   * Callback when selection changes
   */
  onSelectionUpdate?: (editor: Editor) => void

  /**
   * Callback when AI assistant state changes
   */
  onAIStateChange?: (state: AIAssistantState) => void

  /**
   * Enable collaboration
   * @default false
   */
  collaboration?: boolean

  /**
   * Collaboration options
   */
  collaborationOptions?: {
    document: unknown // Y.Doc
    provider: unknown // WebrtcProvider | HocuspocusProvider
    user?: {
      name: string
      color: string
    }
  }
}

export interface UseAIDocumentEditorReturn {
  /**
   * The tiptap editor instance
   */
  editor: Editor | null

  /**
   * Whether the editor is ready
   */
  isReady: boolean

  /**
   * Get document content as HTML
   */
  getHTML: () => string

  /**
   * Get document content as JSON
   */
  getJSON: () => object

  /**
   * Get document content as plain text
   */
  getText: () => string

  /**
   * Set document content
   */
  setContent: (content: Content) => void

  /**
   * Clear the document
   */
  clearContent: () => void

  /**
   * Focus the editor
   */
  focus: (position?: 'start' | 'end' | 'all' | number) => void

  /**
   * Blur the editor
   */
  blur: () => void

  /**
   * Check if the editor is empty
   */
  isEmpty: boolean

  /**
   * Get character count
   */
  characterCount: number

  /**
   * Get word count
   */
  wordCount: number

  /**
   * Undo last action
   */
  undo: () => void

  /**
   * Redo last undone action
   */
  redo: () => void

  /**
   * Can undo
   */
  canUndo: boolean

  /**
   * Can redo
   */
  canRedo: boolean

  /**
   * Toggle AI assistant
   */
  toggleAI: (mode?: 'chat' | 'inline' | 'command') => void

  /**
   * Send message to AI
   */
  sendAIMessage: (message: string) => void

  /**
   * Execute AI action
   */
  executeAIAction: (actionId: string) => void

  /**
   * Print the document
   */
  print: () => void

  /**
   * Set paper size
   */
  setPaperSize: (size: 'letter' | 'a4' | 'legal' | 'tabloid') => void

  /**
   * Set orientation
   */
  setOrientation: (orientation: 'portrait' | 'landscape') => void

  /**
   * Insert page break
   */
  insertPageBreak: () => void
}

/**
 * React hook for creating an AI-powered document editor
 */
export function useAIDocumentEditor({
  content = '',
  aiProvider,
  extensions = {},
  additionalExtensions = [],
  editable = true,
  autofocus = false,
  onReady,
  onUpdate,
  onSelectionUpdate,
  onAIStateChange,
}: UseAIDocumentEditorOptions = {}): UseAIDocumentEditorReturn {
  const isReadyRef = useRef(false)

  // Create AI assistant element for floating panel
  const aiPanelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof document !== 'undefined' && !aiPanelRef.current) {
      aiPanelRef.current = document.createElement('div')
      aiPanelRef.current.id = 'ai-assistant-panel'
      document.body.appendChild(aiPanelRef.current)
    }

    return () => {
      aiPanelRef.current?.remove()
    }
  }, [])

  // Configure extensions with AI provider
  const configuredExtensions = useMemo(() => {
    const kitOptions: AIDocumentEditorKitOptions = {
      ...extensions,
      aiAssistant: extensions.aiAssistant !== false
        ? {
            element: aiPanelRef.current,
            provider: aiProvider,
            onStateChange: onAIStateChange,
            ...(typeof extensions.aiAssistant === 'object' ? extensions.aiAssistant : {}),
          }
        : false,
    }

    return [AIDocumentEditorKit.configure(kitOptions), ...additionalExtensions]
  }, [extensions, additionalExtensions, aiProvider, onAIStateChange])

  const editor = useEditor({
    extensions: configuredExtensions,
    content,
    editable,
    autofocus,
    onCreate: ({ editor: e }) => {
      isReadyRef.current = true
      onReady?.(e)
    },
    onUpdate: ({ editor: e }) => {
      onUpdate?.(e)
    },
    onSelectionUpdate: ({ editor: e }) => {
      onSelectionUpdate?.(e)
    },
  })

  // Document operations
  const getHTML = useCallback(() => editor?.getHTML() ?? '', [editor])
  const getJSON = useCallback(() => editor?.getJSON() ?? {}, [editor])
  const getText = useCallback(() => editor?.getText() ?? '', [editor])

  const setContent = useCallback(
    (newContent: Content) => {
      editor?.commands.setContent(newContent)
    },
    [editor],
  )

  const clearContent = useCallback(() => {
    editor?.commands.clearContent()
  }, [editor])

  const focus = useCallback(
    (position?: 'start' | 'end' | 'all' | number) => {
      editor?.commands.focus(position)
    },
    [editor],
  )

  const blur = useCallback(() => {
    editor?.commands.blur()
  }, [editor])

  // History operations
  const undo = useCallback(() => {
    editor?.commands.undo()
  }, [editor])

  const redo = useCallback(() => {
    editor?.commands.redo()
  }, [editor])

  // AI operations
  const toggleAI = useCallback(
    (mode?: 'chat' | 'inline' | 'command') => {
      editor?.commands.toggleAIAssistant(mode)
    },
    [editor],
  )

  const sendAIMessage = useCallback(
    (message: string) => {
      editor?.commands.sendAIMessage(message)
    },
    [editor],
  )

  const executeAIAction = useCallback(
    (actionId: string) => {
      editor?.commands.executeAIAction(actionId)
    },
    [editor],
  )

  // Pagination operations
  const print = useCallback(() => {
    editor?.commands.printDocument()
  }, [editor])

  const setPaperSize = useCallback(
    (size: 'letter' | 'a4' | 'legal' | 'tabloid') => {
      editor?.commands.setPaperSize(size)
    },
    [editor],
  )

  const setOrientation = useCallback(
    (orientation: 'portrait' | 'landscape') => {
      editor?.commands.setOrientation(orientation)
    },
    [editor],
  )

  const insertPageBreak = useCallback(() => {
    editor?.commands.insertPageBreak()
  }, [editor])

  // Computed values
  const isEmpty = editor?.isEmpty ?? true
  const characterCount = editor?.storage.characterCount?.characters?.() ?? 0
  const wordCount = editor?.storage.characterCount?.words?.() ?? 0
  const canUndo = editor?.can().undo() ?? false
  const canRedo = editor?.can().redo() ?? false

  return {
    editor,
    isReady: isReadyRef.current,
    getHTML,
    getJSON,
    getText,
    setContent,
    clearContent,
    focus,
    blur,
    isEmpty,
    characterCount,
    wordCount,
    undo,
    redo,
    canUndo,
    canRedo,
    toggleAI,
    sendAIMessage,
    executeAIAction,
    print,
    setPaperSize,
    setOrientation,
    insertPageBreak,
  }
}

export default useAIDocumentEditor
