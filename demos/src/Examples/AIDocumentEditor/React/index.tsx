import React, { useCallback, useState } from 'react'
import {
  AIDocumentEditor,
  useAIDocumentEditor,
  AIDocumentEditorKit,
  EditorContent,
} from '@tiptap/ai-document-editor'
import type { AIAssistantState, AIProviderInterface } from '@tiptap/extension-ai-assistant'
import '@tiptap/ai-document-editor/styles'

// Sample initial content
const initialContent = `
<h1>Welcome to the AI Document Editor</h1>

<p>This is a <strong>Google Docs-like</strong> rich text editor powered by <em>TipTap</em> with built-in AI capabilities.</p>

<h2>Features</h2>

<ul>
  <li><strong>Rich text editing</strong> - Full formatting support including bold, italic, underline, and more</li>
  <li><strong>AI Assistant</strong> - Press <code>Ctrl+J</code> to open the AI chat panel</li>
  <li><strong>Pagination</strong> - Google Docs-like page view with print-ready documents</li>
  <li><strong>Tables</strong> - Create and edit tables with full support for merging cells</li>
  <li><strong>Task lists</strong> - Interactive checkboxes for todo items</li>
</ul>

<h2>AI-Powered Tools</h2>

<p>Select any text and use the AI assistant to:</p>

<ol>
  <li>Rewrite with different tone or style</li>
  <li>Fix grammar and spelling</li>
  <li>Translate to another language</li>
  <li>Summarize long content</li>
  <li>Expand with more details</li>
  <li>Simplify complex text</li>
</ol>

<blockquote>
  <p>"The best way to predict the future is to create it." - Peter Drucker</p>
</blockquote>

<h2>Getting Started</h2>

<p>Start typing below or use the AI assistant to generate content. Press <code>/</code> for quick commands or <code>Ctrl+K</code> for inline AI prompts.</p>

<hr>

<h3>Try the Task List</h3>

<ul data-type="taskList">
  <li data-type="taskItem" data-checked="true">Set up the AI Document Editor</li>
  <li data-type="taskItem" data-checked="false">Connect an AI provider (OpenAI, Anthropic)</li>
  <li data-type="taskItem" data-checked="false">Customize the toolbar</li>
  <li data-type="taskItem" data-checked="false">Add collaboration features</li>
</ul>

<h3>Sample Table</h3>

<table>
  <tr>
    <th>Feature</th>
    <th>Status</th>
    <th>Priority</th>
  </tr>
  <tr>
    <td>Rich Text Editing</td>
    <td>✅ Complete</td>
    <td>High</td>
  </tr>
  <tr>
    <td>AI Assistant</td>
    <td>✅ Complete</td>
    <td>High</td>
  </tr>
  <tr>
    <td>Pagination</td>
    <td>✅ Complete</td>
    <td>Medium</td>
  </tr>
  <tr>
    <td>Collaboration</td>
    <td>🔄 In Progress</td>
    <td>Medium</td>
  </tr>
</table>

<p>Happy writing! ✨</p>
`

/**
 * Demo: Full-featured AI Document Editor
 */
export default function AIDocumentEditorDemo() {
  const [aiState, setAIState] = useState<AIAssistantState | null>(null)

  const handleAIStateChange = useCallback((state: AIAssistantState) => {
    setAIState(state)
    console.log('AI State:', state)
  }, [])

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          padding: '12px 24px',
          backgroundColor: '#1f2937',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>📄</span>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>
              AI Document Editor
            </h1>
            <p style={{ fontSize: '12px', margin: 0, opacity: 0.7 }}>
              Powered by TipTap
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '13px', opacity: 0.7 }}>
            Press <kbd style={{
              padding: '2px 6px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '4px'
            }}>Ctrl+J</kbd> for AI
          </span>
        </div>
      </header>

      <AIDocumentEditor
        initialContent={initialContent}
        editable={true}
        autofocus="end"
        showToolbar={true}
        showStatusBar={true}
        showAIPanel={true}
        onAIStateChange={handleAIStateChange}
        extensions={{
          pagination: {
            paperSize: 'letter',
            orientation: 'portrait',
            pageView: true,
          },
          aiAssistant: {
            enableDefaultTools: true,
            enableDefaultActions: true,
          },
        }}
        style={{ flex: 1 }}
      />
    </div>
  )
}
