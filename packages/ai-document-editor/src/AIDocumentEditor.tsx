import React, { useCallback, useRef, useState, type CSSProperties } from 'react'
import { EditorContent } from '@digitaltrendz/react'
import type { Content } from '@digitaltrendz/core'
import type { AIProviderInterface, AIAssistantState } from '@digitaltrendz/extension-ai-assistant'
import { AIAssistantPanel, useAIAssistant } from '@digitaltrendz/extension-ai-assistant/react'
import { useAIDocumentEditor, type UseAIDocumentEditorOptions } from './useAIDocumentEditor.js'
import { AIDocumentEditorProvider } from './AIDocumentEditorProvider.js'

export interface AIDocumentEditorProps extends Omit<UseAIDocumentEditorOptions, 'content'> {
  /**
   * Initial content for the editor
   */
  initialContent?: Content

  /**
   * Container className
   */
  className?: string

  /**
   * Container style
   */
  style?: CSSProperties

  /**
   * Editor className
   */
  editorClassName?: string

  /**
   * Editor style
   */
  editorStyle?: CSSProperties

  /**
   * Show toolbar
   * @default true
   */
  showToolbar?: boolean

  /**
   * Show status bar
   * @default true
   */
  showStatusBar?: boolean

  /**
   * Show AI panel
   * @default true
   */
  showAIPanel?: boolean

  /**
   * Toolbar component
   */
  toolbar?: React.ReactNode

  /**
   * Status bar component
   */
  statusBar?: React.ReactNode

  /**
   * Children to render (for custom layouts)
   */
  children?: React.ReactNode
}

/**
 * AI Document Editor - A complete Google Docs-like editor with AI capabilities
 */
export function AIDocumentEditor({
  initialContent = '',
  className = '',
  style,
  editorClassName = '',
  editorStyle,
  showToolbar = true,
  showStatusBar = true,
  showAIPanel = true,
  toolbar,
  statusBar,
  children,
  aiProvider,
  extensions,
  additionalExtensions,
  editable = true,
  autofocus = false,
  onReady,
  onUpdate,
  onSelectionUpdate,
  onAIStateChange,
}: AIDocumentEditorProps) {
  const {
    editor,
    isReady,
    wordCount,
    characterCount,
    canUndo,
    canRedo,
    undo,
    redo,
    toggleAI,
    sendAIMessage,
    executeAIAction,
    print,
    setPaperSize,
    setOrientation,
    insertPageBreak,
  } = useAIDocumentEditor({
    content: initialContent,
    aiProvider,
    extensions,
    additionalExtensions,
    editable,
    autofocus,
    onReady,
    onUpdate,
    onSelectionUpdate,
    onAIStateChange,
  })

  const { state: aiState, close: closeAI } = useAIAssistant({ editor })

  return (
    <AIDocumentEditorProvider editor={editor} aiProvider={aiProvider}>
      <div
        className={`ai-document-editor ${className}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: '#f3f4f6',
          ...style,
        }}
      >
        {/* Toolbar */}
        {showToolbar && (
          <div className="ai-document-editor-toolbar">
            {toolbar || <DefaultToolbar editor={editor} />}
          </div>
        )}

        {/* Editor Container */}
        <div
          className="ai-document-editor-container"
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '24px',
          }}
        >
          <EditorContent
            editor={editor}
            className={`ai-document-editor-content ${editorClassName}`}
            style={{
              ...editorStyle,
            }}
          />

          {children}
        </div>

        {/* Status Bar */}
        {showStatusBar && (
          <div className="ai-document-editor-statusbar">
            {statusBar || (
              <DefaultStatusBar
                wordCount={wordCount}
                characterCount={characterCount}
                isReady={isReady}
              />
            )}
          </div>
        )}

        {/* AI Assistant Panel */}
        {showAIPanel && (
          <AIAssistantPanel
            editor={editor}
            state={aiState}
            onSendMessage={sendAIMessage}
            onExecuteAction={executeAIAction}
            onClose={closeAI}
          />
        )}
      </div>
    </AIDocumentEditorProvider>
  )
}

/**
 * Default toolbar component
 */
function DefaultToolbar({ editor }: { editor: ReturnType<typeof useAIDocumentEditor>['editor'] }) {
  if (!editor) return null

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '8px 16px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        flexWrap: 'wrap',
      }}
    >
      {/* History */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo (Ctrl+Z)"
      >
        ↩
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo (Ctrl+Y)"
      >
        ↪
      </ToolbarButton>

      <ToolbarDivider />

      {/* Text formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Bold (Ctrl+B)"
      >
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italic (Ctrl+I)"
      >
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        title="Underline (Ctrl+U)"
      >
        <u>U</u>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title="Strikethrough"
      >
        <s>S</s>
      </ToolbarButton>

      <ToolbarDivider />

      {/* Headings */}
      <select
        value={
          editor.isActive('heading', { level: 1 })
            ? '1'
            : editor.isActive('heading', { level: 2 })
              ? '2'
              : editor.isActive('heading', { level: 3 })
                ? '3'
                : '0'
        }
        onChange={e => {
          const level = parseInt(e.target.value, 10)
          if (level === 0) {
            editor.chain().focus().setParagraph().run()
          } else {
            editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run()
          }
        }}
        style={{
          padding: '4px 8px',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          fontSize: '13px',
          backgroundColor: '#ffffff',
        }}
      >
        <option value="0">Paragraph</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
      </select>

      <ToolbarDivider />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Bullet List"
      >
        •
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Numbered List"
      >
        1.
      </ToolbarButton>

      <ToolbarDivider />

      {/* Alignment */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
        title="Align Left"
      >
        ⬅
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
        title="Align Center"
      >
        ⬌
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
        title="Align Right"
      >
        ➡
      </ToolbarButton>

      <ToolbarDivider />

      {/* AI */}
      <ToolbarButton
        onClick={() => editor.commands.toggleAIAssistant('chat')}
        title="AI Assistant (Ctrl+J)"
        style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}
      >
        ✨ AI
      </ToolbarButton>

      <div style={{ flex: 1 }} />

      {/* Page controls */}
      <ToolbarButton
        onClick={() => editor.commands.insertPageBreak()}
        title="Insert Page Break (Ctrl+Enter)"
      >
        📄
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.commands.printDocument()}
        title="Print (Ctrl+P)"
      >
        🖨
      </ToolbarButton>
    </div>
  )
}

/**
 * Toolbar button component
 */
function ToolbarButton({
  onClick,
  disabled,
  isActive,
  title,
  style,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  isActive?: boolean
  title?: string
  style?: CSSProperties
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        padding: '6px 10px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: isActive ? '#e5e7eb' : 'transparent',
        color: disabled ? '#9ca3af' : '#374151',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        transition: 'background-color 0.15s',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

/**
 * Toolbar divider component
 */
function ToolbarDivider() {
  return (
    <div
      style={{
        width: '1px',
        height: '24px',
        backgroundColor: '#e5e7eb',
        margin: '0 4px',
      }}
    />
  )
}

/**
 * Default status bar component
 */
function DefaultStatusBar({
  wordCount,
  characterCount,
  isReady,
}: {
  wordCount: number
  characterCount: number
  isReady: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 16px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        fontSize: '12px',
        color: '#6b7280',
      }}
    >
      <div style={{ display: 'flex', gap: '16px' }}>
        <span>{wordCount} words</span>
        <span>{characterCount} characters</span>
      </div>
      <div>
        {isReady ? (
          <span style={{ color: '#10b981' }}>● Ready</span>
        ) : (
          <span style={{ color: '#f59e0b' }}>● Loading...</span>
        )}
      </div>
    </div>
  )
}

export default AIDocumentEditor
