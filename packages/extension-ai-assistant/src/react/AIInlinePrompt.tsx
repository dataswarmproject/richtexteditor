import React, { useCallback, useRef, useState, useEffect, type KeyboardEvent, type FormEvent } from 'react'
import type { AIAssistantState } from '../types.js'

export interface AIInlinePromptProps {
  state: AIAssistantState
  onSubmit: (prompt: string) => void
  onClose: () => void
  placeholder?: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Inline AI prompt component that appears at the cursor position
 */
export function AIInlinePrompt({
  state,
  onSubmit,
  onClose,
  placeholder = 'Ask AI to edit or generate...',
  className = '',
  style,
}: AIInlinePromptProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when panel opens
  useEffect(() => {
    if (state.isOpen && state.mode === 'inline') {
      inputRef.current?.focus()
    }
  }, [state.isOpen, state.mode])

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      if (!input.trim() || state.isLoading) return

      onSubmit(input.trim())
      setInput('')
    },
    [input, state.isLoading, onSubmit],
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSubmit(e as unknown as FormEvent)
      }
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [handleSubmit, onClose],
  )

  if (!state.isOpen || state.mode !== 'inline') return null

  return (
    <div
      className={`ai-inline-prompt ${className}`}
      style={{
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        border: '1px solid #e5e7eb',
        zIndex: 9999,
        ...style,
      }}
    >
      <span style={{ fontSize: '14px' }}>✨</span>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flex: 1, gap: '8px' }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={state.isLoading}
          style={{
            flex: 1,
            minWidth: '300px',
            padding: '6px 10px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        {state.isLoading ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              color: '#6b7280',
              fontSize: '13px',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              style={{ animation: 'spin 1s linear infinite', marginRight: '6px' }}
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
            </svg>
            Generating...
          </div>
        ) : (
          <>
            <button
              type="submit"
              disabled={!input.trim()}
              style={{
                padding: '6px 14px',
                backgroundColor: input.trim() ? '#3b82f6' : '#e5e7eb',
                color: input.trim() ? '#ffffff' : '#9ca3af',
                border: 'none',
                borderRadius: '6px',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                fontWeight: 500,
                fontSize: '13px',
              }}
            >
              Generate
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '6px 10px',
                backgroundColor: 'transparent',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              Cancel
            </button>
          </>
        )}
      </form>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}

export default AIInlinePrompt
