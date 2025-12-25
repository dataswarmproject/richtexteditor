# @tiptap/ai-document-editor

A complete AI-powered Google Docs-like document editor built on TipTap. Features pagination, AI assistant with agentic tools, and seamless Next.js/React integration.

## Features

- **Google Docs-like Pagination** - Page view with headers, footers, and page numbers
- **AI Assistant** - Floating chat interface with agentic document editing tools
- **Rich Text Editing** - Full formatting, tables, task lists, images, and more
- **Print-Ready Documents** - Export to PDF with proper page breaks
- **Next.js Compatible** - Works with SSR and React Server Components
- **Fully Customizable** - Extend with your own tools and UI components

## Installation

```bash
npm install @tiptap/ai-document-editor
# or
pnpm add @tiptap/ai-document-editor
# or
yarn add @tiptap/ai-document-editor
```

## Quick Start

### Basic Usage

```tsx
import { AIDocumentEditor } from '@tiptap/ai-document-editor'
import '@tiptap/ai-document-editor/styles'

export default function DocumentPage() {
  return (
    <AIDocumentEditor
      initialContent="<p>Start writing...</p>"
      showToolbar={true}
      showStatusBar={true}
      showAIPanel={true}
    />
  )
}
```

### With AI Provider

```tsx
import { AIDocumentEditor } from '@tiptap/ai-document-editor'
import type { AIProviderInterface } from '@tiptap/extension-ai-assistant'

// Create your AI provider (OpenAI, Anthropic, or custom)
const myAIProvider: AIProviderInterface = {
  async complete(request) {
    const response = await fetch('/api/ai/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
    return response.json()
  },
  async *stream(request) {
    // Implement streaming...
  },
  isReady() {
    return true
  },
}

export default function DocumentPage() {
  return (
    <AIDocumentEditor
      initialContent="<p>Start writing...</p>"
      aiProvider={myAIProvider}
    />
  )
}
```

### Using the Hook

```tsx
import { useAIDocumentEditor, EditorContent } from '@tiptap/ai-document-editor'

export default function CustomEditor() {
  const {
    editor,
    isReady,
    wordCount,
    characterCount,
    toggleAI,
    sendAIMessage,
    print,
    setPaperSize,
  } = useAIDocumentEditor({
    content: '<p>Hello world</p>',
    onUpdate: (editor) => {
      console.log('Content updated:', editor.getHTML())
    },
  })

  if (!editor) return <div>Loading...</div>

  return (
    <div>
      <button onClick={() => toggleAI('chat')}>Open AI</button>
      <button onClick={() => print()}>Print</button>
      <EditorContent editor={editor} />
      <p>{wordCount} words, {characterCount} characters</p>
    </div>
  )
}
```

## Configuration

### Extension Options

```tsx
<AIDocumentEditor
  extensions={{
    // Pagination options
    pagination: {
      paperSize: 'letter', // 'letter' | 'a4' | 'legal' | 'tabloid'
      orientation: 'portrait', // 'portrait' | 'landscape'
      pageView: true,
    },

    // AI Assistant options
    aiAssistant: {
      enableDefaultTools: true,
      enableDefaultActions: true,
      shortcut: 'Mod-j',
      inlineShortcut: 'Mod-k',
    },

    // Disable specific extensions
    table: false,
    taskList: false,
  }}
/>
```

### Custom AI Tools

```tsx
import type { AITool } from '@tiptap/extension-ai-assistant'

const customTool: AITool = {
  name: 'my_custom_tool',
  description: 'Does something custom',
  parameters: {
    type: 'object',
    properties: {
      input: { type: 'string', description: 'The input text' },
    },
    required: ['input'],
  },
  async execute(params, context) {
    // Access the editor via context.editor
    context.editor.commands.insertContent('Custom content!')
    return { success: true, message: 'Done!' }
  },
}

<AIDocumentEditor
  extensions={{
    aiAssistant: {
      tools: [customTool],
    },
  }}
/>
```

## Built-in AI Tools

The AI assistant includes these tools out of the box:

| Tool | Description |
|------|-------------|
| `generate_text` | Generate new content from a prompt |
| `rewrite_text` | Rewrite selected text with different tone/style |
| `summarize` | Create summaries of selected text or document |
| `translate` | Translate text to another language |
| `fix_grammar` | Fix grammar and spelling errors |
| `expand_text` | Expand text with more details |
| `simplify_text` | Simplify complex text |
| `format_text` | Convert text to lists, tables, etc. |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+J` | Toggle AI Assistant (chat mode) |
| `Ctrl+K` | Toggle AI Assistant (inline mode) |
| `Ctrl+Enter` | Insert page break |
| `Ctrl+P` | Print document |
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+U` | Underline |

## Components

### AIDocumentEditor

The main editor component with built-in toolbar and status bar.

### AIAssistantPanel

Floating AI chat panel component.

### AIQuickActions

Quick actions menu for common AI operations.

### AIInlinePrompt

Inline AI prompt that appears at cursor position.

## CSS Customization

Import the base styles and override as needed:

```css
@import '@tiptap/ai-document-editor/styles';

.ai-document-editor {
  /* Your custom styles */
}

.ai-document-editor .tiptap-page {
  /* Customize page appearance */
}

.ai-assistant-panel {
  /* Customize AI panel */
}
```

## Next.js App Router

For Next.js 13+ with App Router:

```tsx
'use client'

import dynamic from 'next/dynamic'

const AIDocumentEditor = dynamic(
  () => import('@tiptap/ai-document-editor').then(mod => mod.AIDocumentEditor),
  { ssr: false }
)

export default function Page() {
  return <AIDocumentEditor />
}
```

## License

MIT
