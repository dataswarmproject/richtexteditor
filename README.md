<p align="center">

  <img src=".github/assets/Gemini_Generated_Image_ytb3yytb3yytb3yy.png" alt="InkFlow" width="240">

</p>

 

<h1 align="center">InkFlow Editor</h1>

 

<p align="center">

  <strong>The AI-Powered Document Editor for Modern Web Applications</strong>

</p>

 

<p align="center">

  Build Google Docs-like editors with AI superpowers. Headless, extensible, and ready for production.

</p>

 

<p align="center">

  <a href="https://digitaltrendz.app">Website</a> •

  <a href="https://digitaltrendz.dev/docs">Documentation</a> •

  <a href="https://digitaltrendz.app/examples">Live Examples</a> •

  <a href="https://digitaltrendz.dev/playground">Playground</a>

</p>

 

<p align="center">

  <a href="https://www.npmjs.com/package/@inkflow/core">

    <img src="https://img.shields.io/npm/v/@inkflow/core.svg?label=version&color=6366f1" alt="Version">

  </a>

  <a href="https://www.npmjs.com/package/@inkflow/core">

    <img src="https://img.shields.io/npm/dm/@inkflow/core.svg?color=8b5cf6" alt="Downloads">

  </a>

  <a href="https://github.com/digital-trendz/inkflow/blob/main/LICENSE.md">

    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">

  </a>

  <a href="https://github.com/digital-trendz/inkflow">

    <img src="https://img.shields.io/badge/TypeScript-Ready-blue.svg" alt="TypeScript">

  </a>

</p>

 

<br>

 

<p align="center">

  <img src=".github/assets/demo-preview.png" alt="InkFlow Editor Demo" width="800">

</p>

 

---

 

## Why InkFlow?

 

**InkFlow** transforms how you build document editors. Forget complex configurations and endless boilerplate—get a production-ready, AI-enhanced editor in minutes.

 

```tsx

import { AIDocumentEditor } from '@inkflow/ai-document-editor'

 

export default function App() {

  return <AIDocumentEditor showAIPanel={true} />

}

```

 

That's it. You now have a full-featured document editor with AI capabilities.

 

---

 

## ✨ Features

 

<table>

<tr>

<td width="50%">

 

### 🤖 AI-Powered Editing

- **Generate** content from prompts

- **Rewrite** with different tones

- **Summarize** long documents

- **Translate** to 18+ languages

- **Fix grammar** automatically

- **Expand** or **simplify** text

- Floating chat interface

- Inline AI prompts (`Ctrl+K`)

 

</td>

<td width="50%">

 

### 📄 Google Docs-like Pagination

- Real page view layout

- Headers & footers

- Page numbers

- Page breaks (`Ctrl+Enter`)

- Print-ready documents

- PDF export

- Letter, A4, Legal sizes

- Portrait & landscape

 

</td>

</tr>

<tr>

<td width="50%">

 

### 🎨 Headless Architecture

- Zero imposed UI

- Full design freedom

- Custom components

- Themeable

- CSS-in-JS ready

- Tailwind compatible

- Dark mode support

 

</td>

<td width="50%">

 

### ⚡ Developer Experience

- TypeScript first

- React, Vue, Svelte

- Next.js App Router ready

- 100+ extensions

- Real-time collaboration

- Offline support

- Tree-shakeable

 

</td>

</tr>

</table>

 

---

 

## 🚀 Quick Start

 

### Installation

 

```bash

# Full AI Document Editor (recommended)

npm install @inkflow/ai-document-editor

 

# Or just the core packages

npm install @inkflow/react @inkflow/starter-kit

```

 

### Option 1: AI Document Editor (Batteries Included)

 

```tsx

'use client' // For Next.js App Router

 

import { AIDocumentEditor } from '@inkflow/ai-document-editor'

import '@inkflow/ai-document-editor/styles'

 

export default function DocumentPage() {

  return (

    <AIDocumentEditor

      initialContent="<h1>Welcome to InkFlow</h1><p>Start writing...</p>"

      showToolbar={true}

      showStatusBar={true}

      showAIPanel={true}

      extensions={{

        pagination: { paperSize: 'letter' },

        aiAssistant: { enableDefaultTools: true }

      }}

      onUpdate={(editor) => {

        console.log('Content:', editor.getHTML())

      }}

    />

  )

}

```

 

### Option 2: Build Your Own

 

```tsx

import { useEditor, EditorContent } from '@inkflow/react'

import StarterKit from '@inkflow/starter-kit'

import { Pagination } from '@inkflow/extension-pagination'

import { AIAssistant } from '@inkflow/extension-ai-assistant'

 

function CustomEditor() {

  const editor = useEditor({

    extensions: [

      StarterKit,

      Pagination.configure({ paperSize: 'a4' }),

      AIAssistant.configure({ enableDefaultTools: true }),

    ],

    content: '<p>Hello World!</p>',

  })

 

  return (

    <div className="editor-container">

      <EditorContent editor={editor} />

    </div>

  )

}

```

 

### Option 3: Use the Hook

 

```tsx

import { useAIDocumentEditor, EditorContent } from '@inkflow/ai-document-editor'

 

function Editor() {

  const {

    editor,

    wordCount,

    characterCount,

    toggleAI,

    sendAIMessage,

    print,

    setPaperSize,

  } = useAIDocumentEditor({

    content: '<p>Start writing...</p>',

    onUpdate: (editor) => saveToDatabase(editor.getJSON()),

  })

 

  return (

    <div>

      <button onClick={() => toggleAI('chat')}>Open AI Assistant</button>

      <button onClick={() => print()}>Print</button>

      <EditorContent editor={editor} />

      <span>{wordCount} words</span>

    </div>

  )

}

```

 

---

 

## 📦 Packages

 

### Core Packages

 

| Package | Description |

|---------|-------------|

| [`@inkflow/core`](./packages/core) | Core editor engine |

| [`@inkflow/react`](./packages/react) | React bindings & hooks |

| [`@inkflow/vue-3`](./packages/vue-3) | Vue 3 composition API |

| [`@inkflow/starter-kit`](./packages/starter-kit) | Essential extensions bundle |

| [`@inkflow/pm`](./packages/pm) | ProseMirror packages |

 

### AI & Document Packages

 

| Package | Description |

|---------|-------------|

| [`@inkflow/ai-document-editor`](./packages/ai-document-editor) | Complete AI-powered editor |

| [`@inkflow/extension-ai-assistant`](./packages/extension-ai-assistant) | Floating AI chat & tools |

| [`@inkflow/extension-pagination`](./packages/extension-pagination) | Google Docs-like pages |

 

### Popular Extensions

 

| Package | Description |

|---------|-------------|

| `@inkflow/extension-table` | Advanced tables with resize |

| `@inkflow/extension-image` | Image handling & resize |

| `@inkflow/extension-link` | Smart link detection |

| `@inkflow/extension-collaboration` | Real-time editing via Yjs |

| `@inkflow/extension-mention` | @mentions with suggestions |

| `@inkflow/extension-code-block-lowlight` | Syntax highlighted code |

| `@inkflow/extension-mathematics` | LaTeX math rendering |

 

[View all 50+ extensions →](https://digitaltrendz.dev/docs/extensions)

 

---

 

## 🤖 AI Tools

 

InkFlow includes powerful AI tools out of the box:

 

| Tool | Shortcut | Description |

|------|----------|-------------|

| **Generate** | - | Create new content from prompts |

| **Rewrite** | - | Change tone, style, or approach |

| **Summarize** | - | Create brief or detailed summaries |

| **Translate** | - | Translate to 18+ languages |

| **Fix Grammar** | `Ctrl+Shift+G` | Correct spelling and grammar |

| **Expand** | - | Add more details and examples |

| **Simplify** | - | Make text easier to understand |

| **Format** | - | Convert to lists, tables, headings |

 

### Keyboard Shortcuts

 

| Shortcut | Action |

|----------|--------|

| `Ctrl+J` | Open AI Assistant (Chat Mode) |

| `Ctrl+K` | Open AI Assistant (Inline Mode) |

| `Ctrl+Enter` | Insert Page Break |

| `Ctrl+P` | Print Document |

| `Ctrl+B` | Bold |

| `Ctrl+I` | Italic |

| `Ctrl+U` | Underline |

| `Ctrl+Z` | Undo |

| `Ctrl+Shift+Z` | Redo |

 

### Custom AI Provider

 

Connect your own AI backend:

 

```tsx

import { AIDocumentEditor } from '@inkflow/ai-document-editor'

import type { AIProviderInterface } from '@inkflow/extension-ai-assistant'

 

const myAIProvider: AIProviderInterface = {

  async complete(request) {

    const response = await fetch('/api/ai/chat', {

      method: 'POST',

      body: JSON.stringify(request),

    })

    return response.json()

  },

  async *stream(request) {

    // Implement streaming for real-time responses

  },

  isReady: () => true,

}

 

<AIDocumentEditor aiProvider={myAIProvider} />

```

 

---

 

## 📱 Framework Support

 

<table>

<tr>

<td align="center" width="25%">

<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="48"><br>

<strong>React</strong><br>

<code>@inkflow/react</code>

</td>

<td align="center" width="25%">

<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vuejs/vuejs-original.svg" width="48"><br>

<strong>Vue 3</strong><br>

<code>@inkflow/vue-3</code>

</td>

<td align="center" width="25%">

<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg" width="48"><br>

<strong>Next.js</strong><br>

<code>@inkflow/react</code>

</td>

<td align="center" width="25%">

<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" width="48"><br>

<strong>Vanilla JS</strong><br>

<code>@inkflow/core</code>

</td>

</tr>

</table>

 

### Next.js App Router

 

```tsx

// app/editor/page.tsx

'use client'

 

import dynamic from 'next/dynamic'

 

const AIDocumentEditor = dynamic(

  () => import('@inkflow/ai-document-editor').then(m => m.AIDocumentEditor),

  { ssr: false, loading: () => <p>Loading editor...</p> }

)

 

export default function EditorPage() {

  return <AIDocumentEditor />

}

```

 

---

 

## 🎨 Styling

 

### Import Base Styles

 

```tsx

import '@inkflow/ai-document-editor/styles'

```

 

### Customize with CSS

 

```css

/* Your custom styles */

.ai-document-editor {

  --inkflow-primary: #6366f1;

  --inkflow-font-family: 'Inter', sans-serif;

}

 

.ai-document-editor .tiptap-page {

  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

}

 

.ai-assistant-panel {

  backdrop-filter: blur(10px);

}

```

 

### Tailwind CSS

 

```tsx

<AIDocumentEditor

  className="prose prose-lg max-w-none"

  editorClassName="focus:outline-none"

/>

```

 

---

 

## 📚 Documentation

 

| Resource | Link |

|----------|------|

| Getting Started | [digitaltrendz.dev/docs/getting-started](https://digitaltrendz.dev/docs/getting-started) |

| API Reference | [digitaltrendz.dev/docs/api](https://digitaltrendz.dev/docs/api) |

| Extensions Guide | [digitaltrendz.dev/docs/extensions](https://digitaltrendz.dev/docs/extensions) |

| AI Integration | [digitaltrendz.dev/docs/ai](https://digitaltrendz.dev/docs/ai) |

| Examples | [digitaltrendz.app/examples](https://digitaltrendz.app/examples) |

| Playground | [digitaltrendz.dev/playground](https://digitaltrendz.dev/playground) |

 

---

 

## 🏢 About Digital Trendz

 

**InkFlow** is developed and maintained by **[Digital Trendz](https://digital-trendz.net)**, a technology company building modern developer tools and applications.

 

| Platform | URL |

|----------|-----|

| Company Website | [digital-trendz.net](https://digital-trendz.net) |

| App Platform | [digitaltrendz.app](https://digitaltrendz.app) |

| Developer Portal | [digitaltrendz.dev](https://digitaltrendz.dev) |

 

---

 

## 🤝 Contributing

 

We welcome contributions! See our [Contributing Guide](CONTRIBUTING.md) for details.

 

```bash

# Clone the repo

git clone https://github.com/digital-trendz/inkflow.git

 

# Install dependencies

pnpm install

 

# Start development

pnpm dev

```

 

---

 

## 🙏 Credits

 

InkFlow builds upon the excellent work of:

 

- **[ProseMirror](https://prosemirror.net/)** - The foundation for structured text editing

- **[Tiptap](https://tiptap.dev/)** - The original headless editor framework

- **[Yjs](https://yjs.dev/)** - CRDT implementation for real-time collaboration

- **[Floating UI](https://floating-ui.com/)** - Positioning engine for tooltips and popovers

 

---

 

## 📄 License

 

MIT License - see [LICENSE.md](LICENSE.md) for details.

 

---

 

<p align="center">

  <strong>Built with 💜 by <a href="https://digital-trendz.net">Digital Trendz</a></strong>

</p>

 

<p align="center">

  <a href="https://digitaltrendz.app">Website</a> •

  <a href="https://twitter.com/digitaltrendz">Twitter</a> •

  <a href="https://github.com/digital-trendz">GitHub</a>

</p>

 
