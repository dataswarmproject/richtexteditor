import { Node, mergeAttributes } from '@inkflow/core'

export interface PageNumberOptions {
  /**
   * The HTML attributes for a page number node.
   * @default {}
   */
  HTMLAttributes: Record<string, unknown>

  /**
   * Format for page numbers
   * @default 'numeric'
   */
  format: 'numeric' | 'roman' | 'alpha'

  /**
   * Show total page count (e.g., "1 of 5")
   * @default false
   */
  showTotal: boolean

  /**
   * Separator between current and total (when showTotal is true)
   * @default ' of '
   */
  separator: string
}

declare module '@inkflow/core' {
  interface Commands<ReturnType> {
    pageNumber: {
      /**
       * Insert a page number placeholder
       * @example editor.commands.insertPageNumber()
       */
      insertPageNumber: () => ReturnType
    }
  }
}

/**
 * This extension adds a page number node to your editor.
 * The actual page numbers are calculated and rendered dynamically.
 */
export const PageNumber = Node.create<PageNumberOptions>({
  name: 'pageNumber',

  group: 'inline',

  inline: true,

  atom: true,

  selectable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      format: 'numeric',
      showTotal: false,
      separator: ' of ',
    }
  },

  addAttributes() {
    return {
      showTotal: {
        default: this.options.showTotal,
        parseHTML: element => element.getAttribute('data-show-total') === 'true',
        renderHTML: attributes => ({
          'data-show-total': attributes.showTotal,
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="page-number"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'page-number',
        class: 'tiptap-page-number',
        contenteditable: 'false',
        style: `
          display: inline-block;
          font-variant-numeric: tabular-nums;
        `.trim().replace(/\s+/g, ' '),
      }),
      // The actual page number is injected via CSS counter or JavaScript
      '#',
    ]
  },

  addCommands() {
    return {
      insertPageNumber:
        () =>
        ({ chain }) => {
          return chain()
            .insertContent({ type: this.name })
            .run()
        },
    }
  },
})
