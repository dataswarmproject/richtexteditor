import { Node, mergeAttributes } from '@inkflow/core'

export interface PageFooterOptions {
  /**
   * The HTML attributes for a page footer node.
   * @default {}
   */
  HTMLAttributes: Record<string, unknown>

  /**
   * Height of the footer area
   * @default '0.5in'
   */
  height: string
}

declare module '@inkflow/core' {
  interface Commands<ReturnType> {
    pageFooter: {
      /**
       * Insert a page footer
       * @example editor.commands.insertPageFooter()
       */
      insertPageFooter: () => ReturnType
      /**
       * Toggle page footer
       * @example editor.commands.togglePageFooter()
       */
      togglePageFooter: () => ReturnType
    }
  }
}

/**
 * This extension adds a page footer node to your editor.
 */
export const PageFooter = Node.create<PageFooterOptions>({
  name: 'pageFooter',

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
        tag: 'footer[data-type="page-footer"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'footer',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'page-footer',
        class: 'tiptap-page-footer',
        style: `
          display: block;
          min-height: ${this.options.height};
          padding: 8px 0;
          border-top: 1px solid #e5e7eb;
          margin-top: auto;
          font-size: 12px;
          color: #6b7280;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding-left: inherit;
          padding-right: inherit;
        `.trim().replace(/\s+/g, ' '),
      }),
      0,
    ]
  },

  addCommands() {
    return {
      insertPageFooter:
        () =>
        ({ chain }) => {
          return chain()
            .insertContent({ type: this.name, content: [] })
            .run()
        },
      togglePageFooter:
        () =>
        ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph')
        },
    }
  },
})
