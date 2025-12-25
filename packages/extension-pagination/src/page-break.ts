import { Node, mergeAttributes } from '@inkflow/core'

export interface PageBreakOptions {
  /**
   * The HTML attributes for a page break node.
   * @default {}
   */
  HTMLAttributes: Record<string, unknown>
}

declare module '@inkflow/core' {
  interface Commands<ReturnType> {
    pageBreak: {
      /**
       * Insert a page break
       * @example editor.commands.insertPageBreak()
       */
      insertPageBreak: () => ReturnType
    }
  }
}

/**
 * This extension adds a page break node to your editor.
 * @see https://tiptap.dev/api/extensions/page-break
 */
export const PageBreak = Node.create<PageBreakOptions>({
  name: 'pageBreak',

  group: 'block',

  atom: true,

  selectable: true,

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="page-break"]',
      },
      {
        tag: 'hr.page-break',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'page-break',
        class: 'tiptap-page-break',
        style: `
          width: 100%;
          height: 0;
          border: none;
          border-top: 2px dashed #d1d5db;
          margin: 24px 0;
          page-break-before: always;
          position: relative;
        `.trim().replace(/\s+/g, ' '),
      }),
      [
        'span',
        {
          contenteditable: 'false',
          style: `
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background: #f3f4f6;
            padding: 2px 8px;
            font-size: 11px;
            color: #6b7280;
            border-radius: 4px;
            pointer-events: none;
          `.trim().replace(/\s+/g, ' '),
        },
        'Page Break',
      ],
    ]
  },

  addCommands() {
    return {
      insertPageBreak:
        () =>
        ({ chain }) => {
          return chain()
            .insertContent({ type: this.name })
            .run()
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Enter': () => this.editor.commands.insertPageBreak(),
    }
  },
})
