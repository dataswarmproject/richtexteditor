import React from 'react'
import type { AIAction, AIAssistantState } from '../types.js'

export interface AIQuickActionsProps {
  actions: AIAction[]
  state: AIAssistantState
  onExecuteAction: (actionId: string) => void
  className?: string
  style?: React.CSSProperties
}

/**
 * Quick actions menu component for common AI operations
 */
export function AIQuickActions({
  actions,
  state,
  onExecuteAction,
  className = '',
  style,
}: AIQuickActionsProps) {
  if (!state.isOpen || state.mode !== 'command') return null

  return (
    <div
      className={`ai-quick-actions ${className}`}
      style={{
        position: 'fixed',
        width: '280px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        zIndex: 9999,
        ...style,
      }}
    >
      <div
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid #e5e7eb',
          fontSize: '11px',
          fontWeight: 600,
          color: '#6b7280',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        AI Actions
      </div>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {actions.map((action, index) => (
          <button
            key={action.id}
            onClick={() => onExecuteAction(action.id)}
            disabled={state.isLoading}
            style={{
              width: '100%',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: state.isLoading ? 'not-allowed' : 'pointer',
              textAlign: 'left',
              borderBottom: index < actions.length - 1 ? '1px solid #f3f4f6' : 'none',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={e => {
              if (!state.isLoading) {
                e.currentTarget.style.backgroundColor = '#f3f4f6'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#111827',
                }}
              >
                {action.icon && <span style={{ marginRight: '8px' }}>{action.icon}</span>}
                {action.label}
              </div>
              {action.description && (
                <div
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    marginTop: '2px',
                  }}
                >
                  {action.description}
                </div>
              )}
            </div>
            {action.shortcut && (
              <kbd
                style={{
                  fontSize: '11px',
                  padding: '2px 6px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '4px',
                  color: '#6b7280',
                  fontFamily: 'monospace',
                }}
              >
                {action.shortcut}
              </kbd>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default AIQuickActions
