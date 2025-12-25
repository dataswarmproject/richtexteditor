import { Node, mergeAttributes } from '@tiptap/core'

export interface PageOptions {
  /**
   * The HTML attributes for a page node.
   * @default {}
   */
  HTMLAttributes: Record<string, unknown>

  /**
   * Page width in CSS units (e.g., '8.5in', '210mm', '816px')
   * @default '8.5in'
   */
  pageWidth: string

  /**
   * Page height in CSS units (e.g., '11in', '297mm', '1056px')
   * @default '11in'
   */
  pageHeight: string

  /**
   * Page margins in CSS units
   * @default { top: '1in', right: '1in', bottom: '1in', left: '1in' }
   */
  margins: {
    top: string
    right: string
    bottom: string
    left: string
  }

  /**
   * Show page shadow for visual effect
   * @default true
   */
  showShadow: boolean

  /**
   * Background color of the page
   * @default '#ffffff'
   */
  backgroundColor: string
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    page: {
      /**
       * Set page options
       * @param options Page options
       * @example editor.commands.setPageOptions({ pageWidth: '8.5in', pageHeight: '11in' })
       */
      setPageOptions: (options: Partial<PageOptions>) => ReturnType
    }
  }
}

/**
 * This extension adds a page node to your editor for document pagination.
 * @see https://tiptap.dev/api/extensions/page
 */
export const Page = Node.create<PageOptions>({
  name: 'page',

  group: 'block',

  content: '(block | pageHeader | pageFooter)+',

  defining: true,

  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      pageWidth: '8.5in',
      pageHeight: '11in',
      margins: {
        top: '1in',
        right: '1in',
        bottom: '1in',
        left: '1in',
      },
      showShadow: true,
      backgroundColor: '#ffffff',
    }
  },

  addAttributes() {
    return {
      pageNumber: {
        default: 1,
        parseHTML: element => parseInt(element.getAttribute('data-page-number') || '1', 10),
        renderHTML: attributes => ({
          'data-page-number': attributes.pageNumber,
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="page"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { pageWidth, pageHeight, margins, showShadow, backgroundColor } = this.options

    const style = `
      width: ${pageWidth};
      min-height: ${pageHeight};
      padding: ${margins.top} ${margins.right} ${margins.bottom} ${margins.left};
      background-color: ${backgroundColor};
      ${showShadow ? 'box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);' : ''}
      margin: 20px auto;
      box-sizing: border-box;
      position: relative;
      page-break-after: always;
    `.trim().replace(/\s+/g, ' ')

    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'page',
        class: 'tiptap-page',
        style,
      }),
      0,
    ]
  },

  addCommands() {
    return {
      setPageOptions:
        options =>
        ({ editor }) => {
          Object.assign(this.options, options)
          editor.view.dispatch(editor.state.tr)
          return true
        },
    }
  },
})
