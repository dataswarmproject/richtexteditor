import { Node, mergeAttributes } from '@tiptap/core'

export interface PageHeaderOptions {
  /**
   * The HTML attributes for a page header node.
   * @default {}
   */
  HTMLAttributes: Record<string, unknown>

  /**
   * Height of the header area
   * @default '0.5in'
   */
  height: string
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pageHeader: {
      /**
       * Insert a page header
       * @example editor.commands.insertPageHeader()
       */
      insertPageHeader: () => ReturnType
      /**
       * Toggle page header
       * @example editor.commands.togglePageHeader()
       */
      togglePageHeader: () => ReturnType
    }
  }
}

/**
 * This extension adds a page header node to your editor.
 */
export const PageHeader = Node.create<PageHeaderOptions>({
  name: 'pageHeader',

  group: 'block',

  content: 'inline*',

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      height: '0.5in',
    }
  },

  parseHTML() {
    return [
      {
        tag: 'header[data-type="page-header"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'header',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'page-header',
        class: 'tiptap-page-header',
        style: `
          display: block;
          min-height: ${this.options.height};
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 16px;
          font-size: 12px;
          color: #6b7280;
        `.trim().replace(/\s+/g, ' '),
      }),
      0,
    ]
  },

  addCommands() {
    return {
      insertPageHeader:
        () =>
        ({ chain }) => {
          return chain()
            .insertContent({ type: this.name, content: [] })
            .run()
        },
      togglePageHeader:
        () =>
        ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph')
        },
    }
  },
})
