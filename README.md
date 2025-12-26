<div align="center">

<!-- Logo -->
<img src=".github/assets/inkflow-logo.svg" alt="InkFlow" height="80">

<br>
<br>

<!-- Tagline -->
<h3>The AI-Powered Document Editor for Modern Applications</h3>

<p>Build beautiful, Google Docs-like editors with AI superpowers.<br>Headless • Extensible • Production-Ready</p>

<br>

<!-- Badges -->
[![npm version](https://img.shields.io/npm/v/@digitaltrendz/core?color=6366f1&label=version)](https://www.npmjs.com/package/@digitaltrendz/core)
[![Downloads](https://img.shields.io/npm/dm/@digitaltrendz/core?color=8b5cf6)](https://www.npmjs.com/package/@digitaltrendz/core)
[![License](https://img.shields.io/badge/license-MIT-10b981)](LICENSE.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6)](https://www.typescriptlang.org/)

<br>

[Website](https://digitaltrendz.app) · [Documentation](https://digitaltrendz.dev/docs) · [Examples](https://digitaltrendz.app/examples) · [Playground](https://digitaltrendz.dev/playground)

<br>
<br>

<!-- Hero Image -->
<img src=".github/assets/cover.png" alt="InkFlow Editor" width="100%" style="border-radius: 12px;">

</div>

<br>

---

<br>

## Overview

**InkFlow** is a headless, framework-agnostic rich text editor with built-in AI capabilities and Google Docs-like pagination. Built on [ProseMirror](https://prosemirror.net/) and designed for modern web applications.

```tsx
import { AIDocumentEditor } from '@digitaltrendz/ai-document-editor'

export default function App() {
  return <AIDocumentEditor showAIPanel={true} />
}
```

**That's it.** A full-featured document editor with AI capabilities in one line.

<br>

---

<br>

## ✨ Key Features

<table>
<tr>
<td width="50%" valign="top">

### 🤖 AI-Powered Editing

- Generate content from prompts
- Rewrite with different tones & styles
- Summarize documents instantly
- Translate to 18+ languages
- Fix grammar & spelling
- Expand or simplify text
- Floating chat interface
- Inline AI prompts (`Ctrl+K`)

</td>
<td width="50%" valign="top">

### 📄 Document Pagination

- Real page view layout
- Headers & footers
- Automatic page numbers
- Manual page breaks
- Print-ready output
- PDF export
- Multiple paper sizes
- Portrait & landscape

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🎨 Headless Design

- Zero imposed UI
- Complete design freedom
- Custom components
- Themeable architecture
- CSS-in-JS compatible
- Tailwind ready
- Dark mode support

</td>
<td width="50%" valign="top">

### ⚡ Developer Experience

- TypeScript first
- React, Vue, Next.js
- 100+ extensions
- Real-time collaboration
- Offline capable
- Tree-shakeable
- Excellent documentation

</td>
</tr>
</table>

<br>

---

<br>

## 🚀 Quick Start

### Installation

```bash
npm install @digitaltrendz/ai-document-editor
```

### Usage

```tsx
'use client'

import { AIDocumentEditor } from '@digitaltrendz/ai-document-editor'
import '@digitaltrendz/ai-document-editor/styles'

export default function Editor() {
  return (
    <AIDocumentEditor
      initialContent="<h1>Hello InkFlow</h1><p>Start writing...</p>"
      showToolbar={true}
      showStatusBar={true}
      showAIPanel={true}
      extensions={{
        pagination: { paperSize: 'letter' },
        aiAssistant: { enableDefaultTools: true }
      }}
      onUpdate={(editor) => console.log(editor.getHTML())}
    />
  )
}
```

<br>

### Or Build Your Own

```tsx
import { useEditor, EditorContent } from '@digitaltrendz/react'
import StarterKit from '@digitaltrendz/starter-kit'
import { Pagination } from '@digitaltrendz/extension-pagination'
import { AIAssistant } from '@digitaltrendz/extension-ai-assistant'

function Editor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Pagination.configure({ paperSize: 'a4' }),
      AIAssistant.configure({ enableDefaultTools: true }),
    ],
    content: '<p>Hello World!</p>',
  })

  return <EditorContent editor={editor} />
}
```

<br>

---

<br>

## 📦 Packages

### Core

| Package | Description |
|:--------|:------------|
| `@digitaltrendz/core` | Core editor engine |
| `@digitaltrendz/react` | React bindings & hooks |
| `@digitaltrendz/vue-3` | Vue 3 composition API |
| `@digitaltrendz/starter-kit` | Essential extensions bundle |

### AI & Documents

| Package | Description |
|:--------|:------------|
| `@digitaltrendz/ai-document-editor` | Complete AI-powered editor |
| `@digitaltrendz/extension-ai-assistant` | Floating AI chat & tools |
| `@digitaltrendz/extension-pagination` | Google Docs-like pages |

### Extensions

| Package | Description |
|:--------|:------------|
| `@digitaltrendz/extension-table` | Advanced tables |
| `@digitaltrendz/extension-image` | Image handling |
| `@digitaltrendz/extension-link` | Smart links |
| `@digitaltrendz/extension-collaboration` | Real-time editing |
| `@digitaltrendz/extension-mention` | @mentions |
| `@digitaltrendz/extension-code-block-lowlight` | Syntax highlighting |

> [View all 50+ extensions →](https://digitaltrendz.dev/docs/extensions)

<br>

---

<br>

## 🤖 AI Tools

| Tool | Description |
|:-----|:------------|
| **Generate** | Create content from prompts |
| **Rewrite** | Change tone & style |
| **Summarize** | Create summaries |
| **Translate** | 18+ languages |
| **Fix Grammar** | Spelling & grammar |
| **Expand** | Add more detail |
| **Simplify** | Make easier to read |
| **Format** | Lists, tables, headings |

### Keyboard Shortcuts

| Shortcut | Action |
|:---------|:-------|
| `Ctrl+J` | Open AI Assistant |
| `Ctrl+K` | Inline AI Prompt |
| `Ctrl+Enter` | Insert Page Break |
| `Ctrl+P` | Print Document |

<br>

### Custom AI Provider

```tsx
const myAIProvider: AIProviderInterface = {
  async complete(request) {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify(request),
    })
    return response.json()
  },
  async *stream(request) {
    // Streaming implementation
  },
  isReady: () => true,
}

<AIDocumentEditor aiProvider={myAIProvider} />
```

<br>

---

<br>

## 🛠 Framework Support

<table>
<tr>
<td align="center" width="25%">
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="40">
<br><strong>React</strong>
<br><code>@digitaltrendz/react</code>
</td>
<td align="center" width="25%">
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vuejs/vuejs-original.svg" width="40">
<br><strong>Vue 3</strong>
<br><code>@digitaltrendz/vue-3</code>
</td>
<td align="center" width="25%">
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg" width="40">
<br><strong>Next.js</strong>
<br><code>@digitaltrendz/react</code>
</td>
<td align="center" width="25%">
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" width="40">
<br><strong>Vanilla</strong>
<br><code>@digitaltrendz/core</code>
</td>
</tr>
</table>

<br>

### Next.js App Router

```tsx
// app/editor/page.tsx
'use client'

import dynamic from 'next/dynamic'

const Editor = dynamic(
  () => import('@digitaltrendz/ai-document-editor').then(m => m.AIDocumentEditor),
  { ssr: false }
)

export default function Page() {
  return <Editor />
}
```

<br>

---

<br>

## 🎨 Styling

```tsx
// Import base styles
import '@digitaltrendz/ai-document-editor/styles'
```

```css
/* Custom overrides */
.ai-document-editor {
  --inkflow-primary: #6366f1;
  --inkflow-font-family: 'Inter', sans-serif;
}
```

<br>

---

<br>

## 📚 Resources

| | |
|:--|:--|
| 📖 **Documentation** | [digitaltrendz.dev/docs](https://digitaltrendz.dev/docs) |
| 🎮 **Playground** | [digitaltrendz.dev/playground](https://digitaltrendz.dev/playground) |
| 💡 **Examples** | [digitaltrendz.app/examples](https://digitaltrendz.app/examples) |
| 🔌 **API Reference** | [digitaltrendz.dev/docs/api](https://digitaltrendz.dev/docs/api) |

<br>

---

<br>

## 🤝 Contributing

```bash
git clone https://github.com/digital-trendz/inkflow.git
cd inkflow
pnpm install
pnpm dev
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

<br>

---

<br>

## 🙏 Credits

Built on the shoulders of giants:

- [ProseMirror](https://prosemirror.net/) — Foundation for structured editing
- [Tiptap](https://tiptap.dev/) — Original headless editor framework
- [Yjs](https://yjs.dev/) — Real-time collaboration
- [Floating UI](https://floating-ui.com/) — Positioning engine

<br>

---

<br>

## 📄 License

MIT © [Digital Trendz](https://digital-trendz.net)

<br>

---

<div align="center">

<br>

**[Digital Trendz](https://digital-trendz.net)**

[Website](https://digitaltrendz.app) · [Docs](https://digitaltrendz.dev) · [GitHub](https://github.com/digital-trendz)

<br>

<sub>Made with 💜 for developers who build great things</sub>
 

<!-- Logo -->

<img src=".github/assets/Gemini_Generated_Image_ytb3yytb3yytb3yy.png" alt="InkFlow" height="80">

 

<br>

<br>

 

<!-- Tagline -->

<h3>The AI-Powered Document Editor for Modern Applications</h3>

 

<p>Build beautiful, Google Docs-like editors with AI superpowers.<br>Headless • Extensible • Production-Ready</p>

 

<br>

 

<!-- Badges -->

[![npm version](https://img.shields.io/npm/v/@inkflow/core?color=6366f1&label=version)](https://www.npmjs.com/package/@inkflow/core)

[![Downloads](https://img.shields.io/npm/dm/@inkflow/core?color=8b5cf6)](https://www.npmjs.com/package/@inkflow/core)

[![License](https://img.shields.io/badge/license-MIT-10b981)](LICENSE.md)

[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6)](https://www.typescriptlang.org/)

 

<br>

 

[Website](https://digitaltrendz.app) · [Documentation](https://digitaltrendz.dev/docs) · [Examples](https://digitaltrendz.app/examples) · [Playground](https://digitaltrendz.dev/playground)

 

<br>

<br>

 

<!-- Hero Image -->

<img src=".github/assets/Gemini_Generated_Image_ytb3yytb3yytb3yy.png" alt="InkFlow Editor" width="100%" style="border-radius: 12px;">

 

</div>

 

<br>

 

---

 

<br>

 

## Overview

 

**InkFlow** is a headless, framework-agnostic rich text editor with built-in AI capabilities and Google Docs-like pagination. Built on [ProseMirror](https://prosemirror.net/) and designed for modern web applications.

 

```tsx

import { AIDocumentEditor } from '@inkflow/ai-document-editor'

 

export default function App() {

  return <AIDocumentEditor showAIPanel={true} />

}

```

 

**That's it.** A full-featured document editor with AI capabilities in one line.

 

<br>

 

---

 

<br>

 

## ✨ Key Features

 

<table>

<tr>

<td width="50%" valign="top">

 

### 🤖 AI-Powered Editing

 

- Generate content from prompts

- Rewrite with different tones & styles

- Summarize documents instantly

- Translate to 18+ languages

- Fix grammar & spelling

- Expand or simplify text

- Floating chat interface

- Inline AI prompts (`Ctrl+K`)

 

</td>

<td width="50%" valign="top">

 

### 📄 Document Pagination

 

- Real page view layout

- Headers & footers

- Automatic page numbers

- Manual page breaks

- Print-ready output

- PDF export

- Multiple paper sizes

- Portrait & landscape

 

</td>

</tr>

<tr>

<td width="50%" valign="top">

 

### 🎨 Headless Design

 

- Zero imposed UI

- Complete design freedom

- Custom components

- Themeable architecture

- CSS-in-JS compatible

- Tailwind ready

- Dark mode support

 

</td>

<td width="50%" valign="top">

 

### ⚡ Developer Experience

 

- TypeScript first

- React, Vue, Next.js

- 100+ extensions

- Real-time collaboration

- Offline capable

- Tree-shakeable

- Excellent documentation

 

</td>

</tr>

</table>

 

<br>

 

---

 

<br>

 

## 🚀 Quick Start

 

### Installation

 

```bash

npm install @inkflow/ai-document-editor

```

 

### Usage

 

```tsx

'use client'

 

import { AIDocumentEditor } from '@inkflow/ai-document-editor'

import '@inkflow/ai-document-editor/styles'

 

export default function Editor() {

  return (

    <AIDocumentEditor

      initialContent="<h1>Hello InkFlow</h1><p>Start writing...</p>"

      showToolbar={true}

      showStatusBar={true}

      showAIPanel={true}

      extensions={{

        pagination: { paperSize: 'letter' },

        aiAssistant: { enableDefaultTools: true }

      }}

      onUpdate={(editor) => console.log(editor.getHTML())}

    />

  )

}

```

 

<br>

 

### Or Build Your Own

 

```tsx

import { useEditor, EditorContent } from '@inkflow/react'

import StarterKit from '@inkflow/starter-kit'

import { Pagination } from '@inkflow/extension-pagination'

import { AIAssistant } from '@inkflow/extension-ai-assistant'

 

function Editor() {

  const editor = useEditor({

    extensions: [

      StarterKit,

      Pagination.configure({ paperSize: 'a4' }),

      AIAssistant.configure({ enableDefaultTools: true }),

    ],

    content: '<p>Hello World!</p>',

  })

 

  return <EditorContent editor={editor} />

}

```

 

<br>

 

---

 

<br>

 

## 📦 Packages

 

### Core

 

| Package | Description |

|:--------|:------------|

| `@inkflow/core` | Core editor engine |

| `@inkflow/react` | React bindings & hooks |

| `@inkflow/vue-3` | Vue 3 composition API |

| `@inkflow/starter-kit` | Essential extensions bundle |

 

### AI & Documents

 

| Package | Description |

|:--------|:------------|

| `@inkflow/ai-document-editor` | Complete AI-powered editor |

| `@inkflow/extension-ai-assistant` | Floating AI chat & tools |

| `@inkflow/extension-pagination` | Google Docs-like pages |

 

### Extensions

 

| Package | Description |

|:--------|:------------|

| `@inkflow/extension-table` | Advanced tables |

| `@inkflow/extension-image` | Image handling |

| `@inkflow/extension-link` | Smart links |

| `@inkflow/extension-collaboration` | Real-time editing |

| `@inkflow/extension-mention` | @mentions |

| `@inkflow/extension-code-block-lowlight` | Syntax highlighting |

 

> [View all 50+ extensions →](https://digitaltrendz.dev/docs/extensions)

 

<br>

 

---

 

<br>

 

## 🤖 AI Tools

 

| Tool | Description |

|:-----|:------------|

| **Generate** | Create content from prompts |

| **Rewrite** | Change tone & style |

| **Summarize** | Create summaries |

| **Translate** | 18+ languages |

| **Fix Grammar** | Spelling & grammar |

| **Expand** | Add more detail |

| **Simplify** | Make easier to read |

| **Format** | Lists, tables, headings |

 

### Keyboard Shortcuts

 

| Shortcut | Action |

|:---------|:-------|

| `Ctrl+J` | Open AI Assistant |

| `Ctrl+K` | Inline AI Prompt |

| `Ctrl+Enter` | Insert Page Break |

| `Ctrl+P` | Print Document |

 

<br>

 

### Custom AI Provider

 

```tsx

const myAIProvider: AIProviderInterface = {

  async complete(request) {

    const response = await fetch('/api/ai/chat', {

      method: 'POST',

      body: JSON.stringify(request),

    })

    return response.json()

  },

  async *stream(request) {

    // Streaming implementation

  },

  isReady: () => true,

}

 

<AIDocumentEditor aiProvider={myAIProvider} />

```

 

<br>

 

---

 

<br>

 

## 🛠 Framework Support

 

<table>

<tr>

<td align="center" width="25%">

<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="40">

<br><strong>React</strong>

<br><code>@inkflow/react</code>

</td>

<td align="center" width="25%">

<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vuejs/vuejs-original.svg" width="40">

<br><strong>Vue 3</strong>

<br><code>@inkflow/vue-3</code>

</td>

<td align="center" width="25%">

<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg" width="40">

<br><strong>Next.js</strong>

<br><code>@inkflow/react</code>

</td>

<td align="center" width="25%">

<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" width="40">

<br><strong>Vanilla</strong>

<br><code>@inkflow/core</code>

</td>

</tr>

</table>

 

<br>

 

### Next.js App Router

 

```tsx

// app/editor/page.tsx

'use client'

 

import dynamic from 'next/dynamic'

 

const Editor = dynamic(

  () => import('@inkflow/ai-document-editor').then(m => m.AIDocumentEditor),

  { ssr: false }

)

 

export default function Page() {

  return <Editor />

}

```

 

<br>

 

---

 

<br>

 

## 🎨 Styling

 

```tsx

// Import base styles

import '@inkflow/ai-document-editor/styles'

```

 

```css

/* Custom overrides */

.ai-document-editor {

  --inkflow-primary: #6366f1;

  --inkflow-font-family: 'Inter', sans-serif;

}

```

 

<br>

 

---

 

<br>

 

## 📚 Resources

 

| | |

|:--|:--|

| 📖 **Documentation** | [digitaltrendz.dev/docs](https://digitaltrendz.dev/docs) |

| 🎮 **Playground** | [digitaltrendz.dev/playground](https://digitaltrendz.dev/playground) |

| 💡 **Examples** | [digitaltrendz.app/examples](https://digitaltrendz.app/examples) |

| 🔌 **API Reference** | [digitaltrendz.dev/docs/api](https://digitaltrendz.dev/docs/api) |

 

<br>

 

---

 

<br>

 

## 🤝 Contributing

 

```bash

git clone https://github.com/digital-trendz/inkflow.git

cd inkflow

pnpm install

pnpm dev

```

 

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

 

<br>

 

---

 

<br>

 

## 🙏 Credits

 

Built on the shoulders of giants:

 

- [ProseMirror](https://prosemirror.net/) — Foundation for structured editing

- [Tiptap](https://tiptap.dev/) — Original headless editor framework

- [Yjs](https://yjs.dev/) — Real-time collaboration

- [Floating UI](https://floating-ui.com/) — Positioning engine

 

<br>

 

---

 

<br>

 

## 📄 License

 

MIT © [Digital Trendz](https://digital-trendz.net)

 

<br>

 

---

 

<div align="center">

 

<br>

 

**[Digital Trendz](https://digital-trendz.net)**

 

[Website](https://digitaltrendz.app) · [Docs](https://digitaltrendz.dev) · [GitHub](https://github.com/digital-trendz)

 

<br>

 

<sub>Made with 💜 for developers who build great things</sub>

 

</div>
