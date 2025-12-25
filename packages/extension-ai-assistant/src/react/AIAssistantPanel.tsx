import React, { useCallback, useRef, useState, useEffect, type KeyboardEvent, type FormEvent } from 'react'
import type { Editor } from '@inkflow/core'
import type { AIAssistantState, ChatMessage, AIAction } from '../types.js'

export interface AIAssistantPanelProps {
  editor: Editor | null
  state: AIAssistantState
  actions?: AIAction[]
  onSendMessage: (message: string) => void
  onExecuteAction: (actionId: string) => void
  onClose: () => void
  className?: string
  style?: React.CSSProperties
}

/**
 * AI Assistant floating chat panel component
 */
export function AIAssistantPanel({
  editor,
  state,
  actions = [],
  onSendMessage,
  onExecuteAction,
  onClose,
  className = '',
  style,
}: AIAssistantPanelProps) {
  const [input, setInput] = useState('')
  const [showActions, setShowActions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [state.messages])

  // Focus input when panel opens
  useEffect(() => {
    if (state.isOpen) {
      inputRef.current?.focus()
    }
  }, [state.isOpen])

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      if (!input.trim() || state.isLoading) return

      onSendMessage(input.trim())
      setInput('')
      setShowActions(false)
    },
    [input, state.isLoading, onSendMessage],
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit(e as unknown as FormEvent)
      }
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [handleSubmit, onClose],
  )

  const handleActionClick = useCallback(
    (actionId: string) => {
      onExecuteAction(actionId)
      setShowActions(false)
    },
    [onExecuteAction],
  )

  if (!state.isOpen) return null

  return (
    <div
      className={`ai-assistant-panel ${className}`}
      style={{
        position: 'fixed',
        width: '380px',
        maxHeight: '500px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        border: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 9999,
        ...style,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f9fafb',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>✨</span>
          <span style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>
            AI Assistant
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            color: '#6b7280',
            fontSize: '18px',
            lineHeight: 1,
          }}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* Selected text preview */}
      {state.selectedText && (
        <div
          style={{
            padding: '8px 16px',
            backgroundColor: '#f3f4f6',
            borderBottom: '1px solid #e5e7eb',
            fontSize: '12px',
            color: '#6b7280',
          }}
        >
          <span style={{ fontWeight: 500 }}>Selected: </span>
          <span style={{ fontStyle: 'italic' }}>
            {state.selectedText.length > 50
              ? `${state.selectedText.substring(0, 50)}...`
              : state.selectedText}
          </span>
        </div>
      )}

      {/* Quick actions */}
      {showActions && actions.length > 0 && state.messages.length === 0 && (
        <div
          style={{
            padding: '12px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          {actions.slice(0, 6).map(action => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action.id)}
              disabled={state.isLoading}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                cursor: state.isLoading ? 'not-allowed' : 'pointer',
                color: '#374151',
                transition: 'all 0.15s',
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          minHeight: '150px',
          maxHeight: '300px',
        }}
      >
        {state.messages.map(message => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {state.isLoading && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#6b7280',
              fontSize: '13px',
            }}
          >
            <LoadingSpinner />
            <span>AI is thinking...</span>
          </div>
        )}

        {state.error && (
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '13px',
            }}
          >
            {state.error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '12px 16px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI anything..."
            disabled={state.isLoading}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              resize: 'none',
              minHeight: '40px',
              maxHeight: '100px',
              fontFamily: 'inherit',
            }}
            rows={1}
          />
          <button
            type="submit"
            disabled={!input.trim() || state.isLoading}
            style={{
              padding: '8px 16px',
              backgroundColor: input.trim() && !state.isLoading ? '#3b82f6' : '#9ca3af',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: input.trim() && !state.isLoading ? 'pointer' : 'not-allowed',
              fontWeight: 500,
              fontSize: '14px',
            }}
          >
            Send
          </button>
        </div>
        <div
          style={{
            marginTop: '8px',
            fontSize: '11px',
            color: '#9ca3af',
            textAlign: 'center',
          }}
        >
          Press Enter to send, Shift+Enter for new line
        </div>
      </form>
    </div>
  )
}

/**
 * Individual message bubble component
 */
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
      }}
    >
      <div
        style={{
          maxWidth: '85%',
          padding: '8px 12px',
          borderRadius: '12px',
          backgroundColor: isUser ? '#3b82f6' : '#f3f4f6',
          color: isUser ? '#ffffff' : '#111827',
          fontSize: '14px',
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {message.content}
      </div>
    </div>
  )
}

/**
 * Loading spinner component
 */
function LoadingSpinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: 'spin 1s linear infinite' }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="32"
        strokeDashoffset="12"
      />
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </svg>
  )
}

export default AIAssistantPanel
