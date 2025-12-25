<p align="center">
  <img src=".github/assets/inkflow-logo.svg" alt="InkFlow" width="200">
</p>

<h1 align="center">InkFlow Editor</h1>

<p align="center">
  <strong>AI-Powered Rich Text Editor for Modern Applications</strong>
</p>

<p align="center">
  <a href="https://digitaltrendz.app">Website</a> •
  <a href="https://digitaltrendz.dev/docs">Documentation</a> •
  <a href="https://digitaltrendz.app/examples">Examples</a> •
  <a href="https://digital-trendz.net">Digital Trendz</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@inkflow/core">
    <img src="https://img.shields.io/npm/v/@inkflow/core.svg?label=version" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/@inkflow/core">
    <img src="https://img.shields.io/npm/dm/@inkflow/core.svg" alt="Downloads">
  </a>
  <a href="https://github.com/dataswarmproject/richtexteditor/blob/main/LICENSE.md">
    <img src="https://img.shields.io/npm/l/@inkflow/core.svg" alt="License">
  </a>
</p>

---

## What is InkFlow?

**InkFlow** is a headless, framework-agnostic rich text editor with built-in AI capabilities, Google Docs-like pagination, and seamless integration for React, Vue, and Next.js applications. Built on the battle-tested [ProseMirror](https://github.com/ProseMirror/prosemirror) foundation.

Developed and maintained by **[Digital Trendz](https://digital-trendz.net)**.

### Key Features

- **AI-Powered Editing** - Built-in AI assistant with tools for generating, rewriting, summarizing, and translating content
- **Google Docs-like Pagination** - Page view with headers, footers, page numbers, and print-ready documents
- **Headless Architecture** - Complete design freedom with no imposed UI
- **Framework Agnostic** - Works with React, Vue, Svelte, or vanilla JavaScript
- **100+ Extensions** - Rich ecosystem of formatting, media, and collaboration features
- **Real-time Collaboration** - Built-in support for collaborative editing via Yjs
- **TypeScript First** - Full type safety and excellent DX

## Quick Start

### Installation

```bash
npm install @inkflow/ai-document-editor
# or
pnpm add @inkflow/ai-document-editor
# or
yarn add @inkflow/ai-document-editor
```

### Basic Usage

```tsx
import { AIDocumentEditor } from '@inkflow/ai-document-editor'
import '@inkflow/ai-document-editor/styles'

export default function App() {
  return (
    <AIDocumentEditor
      initialContent="<p>Start writing...</p>"
      showToolbar={true}
      showAIPanel={true}
    />
  )
}
```

### Using the Core Editor

```tsx
import { useEditor, EditorContent } from '@inkflow/react'
import StarterKit from '@inkflow/starter-kit'

function Editor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World!</p>',
  })

  return <EditorContent editor={editor} />
}
```

## Packages

| Package | Description |
|---------|-------------|
| `@inkflow/core` | Core editor functionality |
| `@inkflow/react` | React integration and hooks |
| `@inkflow/vue-3` | Vue 3 integration |
| `@inkflow/starter-kit` | Essential extensions bundle |
| `@inkflow/ai-document-editor` | Complete AI-powered document editor |
| `@inkflow/extension-pagination` | Google Docs-like pagination |
| `@inkflow/extension-ai-assistant` | AI chat interface with agentic tools |

## AI Features

InkFlow includes powerful AI capabilities out of the box:

| Tool | Description |
|------|-------------|
| Generate Text | Create new content from prompts |
| Rewrite | Change tone, style, or approach |
| Summarize | Create brief or detailed summaries |
| Translate | Translate to 18+ languages |
| Fix Grammar | Correct spelling and grammar |
| Expand | Add more details and examples |
| Simplify | Make text easier to understand |
| Format | Convert to lists, tables, headings |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+J` | Open AI Assistant |
| `Ctrl+K` | Inline AI Prompt |
| `Ctrl+Enter` | Insert Page Break |
| `Ctrl+P` | Print Document |

## Documentation

Visit our documentation at **[digitaltrendz.dev/docs](https://digitaltrendz.dev/docs)** for:

- Getting started guides
- Extension documentation
- API reference
- Examples and tutorials

## Examples

Explore live examples at **[digitaltrendz.app/examples](https://digitaltrendz.app/examples)**:

- Basic editor setup
- AI document editor
- Collaborative editing
- Custom extensions
- Menu implementations

## About Digital Trendz

InkFlow is developed by **[Digital Trendz](https://digital-trendz.net)**, a technology company focused on building modern developer tools and applications.

- **Website:** [digital-trendz.net](https://digital-trendz.net)
- **App Platform:** [digitaltrendz.app](https://digitaltrendz.app)
- **Developer Docs:** [digitaltrendz.dev](https://digitaltrendz.dev)

## Contributing

We welcome contributions! Please see our [CONTRIBUTING](CONTRIBUTING.md) guidelines.

## Credits

InkFlow is built on the excellent work of:

- [ProseMirror](https://prosemirror.net/) - The foundation for structured text editing
- [Tiptap](https://tiptap.dev/) - The original headless editor framework (MIT License)
- [Yjs](https://yjs.dev/) - CRDT implementation for real-time collaboration

## License

MIT License - see [LICENSE.md](LICENSE.md) for details.

---

<p align="center">
  Made with ❤️ by <a href="https://digital-trendz.net">Digital Trendz</a>
</p>
