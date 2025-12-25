import React, { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { Editor } from '@tiptap/react'
import type { AIProviderInterface } from '@tiptap/extension-ai-assistant'

export interface AIDocumentEditorContextValue {
  /**
   * The tiptap editor instance
   */
  editor: Editor | null

  /**
   * AI provider for generating content
   */
  aiProvider?: AIProviderInterface

  /**
   * Whether the editor is in page view mode
   */
  pageView: boolean

  /**
   * Set page view mode
   */
  setPageView: (enabled: boolean) => void

  /**
   * Current paper size
   */
  paperSize: 'letter' | 'a4' | 'legal' | 'tabloid' | 'custom'

  /**
   * Set paper size
   */
  setPaperSize: (size: 'letter' | 'a4' | 'legal' | 'tabloid' | 'custom') => void

  /**
   * Current orientation
   */
  orientation: 'portrait' | 'landscape'

  /**
   * Set orientation
   */
  setOrientation: (orientation: 'portrait' | 'landscape') => void

  /**
   * Print the document
   */
  print: () => void

  /**
   * Export document to various formats
   */
  exportAs: (format: 'html' | 'json' | 'text' | 'markdown') => string | object
}

const AIDocumentEditorContext = createContext<AIDocumentEditorContextValue | null>(null)

export interface AIDocumentEditorProviderProps {
  /**
   * The tiptap editor instance
   */
  editor: Editor | null

  /**
   * AI provider implementation
   */
  aiProvider?: AIProviderInterface

  /**
   * Children components
   */
  children: ReactNode
}

/**
 * Provider component for the AI Document Editor context
 */
export function AIDocumentEditorProvider({
  editor,
  aiProvider,
  children,
}: AIDocumentEditorProviderProps) {
  const [pageView, setPageViewState] = React.useState(true)
  const [paperSize, setPaperSizeState] = React.useState<'letter' | 'a4' | 'legal' | 'tabloid' | 'custom'>('letter')
  const [orientation, setOrientationState] = React.useState<'portrait' | 'landscape'>('portrait')

  const setPageView = React.useCallback(
    (enabled: boolean) => {
      setPageViewState(enabled)
      editor?.commands.togglePageView()
    },
    [editor],
  )

  const setPaperSize = React.useCallback(
    (size: 'letter' | 'a4' | 'legal' | 'tabloid' | 'custom') => {
      setPaperSizeState(size)
      editor?.commands.setPaperSize(size)
    },
    [editor],
  )

  const setOrientation = React.useCallback(
    (orient: 'portrait' | 'landscape') => {
      setOrientationState(orient)
      editor?.commands.setOrientation(orient)
    },
    [editor],
  )

  const print = React.useCallback(() => {
    editor?.commands.printDocument()
  }, [editor])

  const exportAs = React.useCallback(
    (format: 'html' | 'json' | 'text' | 'markdown'): string | object => {
      if (!editor) return format === 'json' ? {} : ''

      switch (format) {
        case 'html':
          return editor.getHTML()
        case 'json':
          return editor.getJSON()
        case 'text':
          return editor.getText()
        case 'markdown':
          // Basic markdown export - would need proper converter
          return editor.getText()
        default:
          return ''
      }
    },
    [editor],
  )

  const contextValue = useMemo<AIDocumentEditorContextValue>(
    () => ({
      editor,
      aiProvider,
      pageView,
      setPageView,
      paperSize,
      setPaperSize,
      orientation,
      setOrientation,
      print,
      exportAs,
    }),
    [editor, aiProvider, pageView, setPageView, paperSize, setPaperSize, orientation, setOrientation, print, exportAs],
  )

  return (
    <AIDocumentEditorContext.Provider value={contextValue}>
      {children}
    </AIDocumentEditorContext.Provider>
  )
}

/**
 * Hook to access the AI Document Editor context
 */
export function useAIDocumentEditorContext(): AIDocumentEditorContextValue {
  const context = useContext(AIDocumentEditorContext)

  if (!context) {
    throw new Error('useAIDocumentEditorContext must be used within an AIDocumentEditorProvider')
  }

  return context
}

export default AIDocumentEditorProvider
