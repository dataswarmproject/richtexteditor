import { Extension } from '@digitaltrendz/core'
import { Plugin, PluginKey } from '@digitaltrendz/pm/state'
import type { EditorView } from '@digitaltrendz/pm/view'

import { Page, type PageOptions } from './page.js'
import { PageBreak, type PageBreakOptions } from './page-break.js'
import { PageHeader, type PageHeaderOptions } from './page-header.js'
import { PageFooter, type PageFooterOptions } from './page-footer.js'
import { PageNumber, type PageNumberOptions } from './page-number.js'

export interface PaginationOptions {
  /**
   * Enable automatic page splitting based on content height
   * @default true
   */
  autoSplit: boolean

  /**
   * Page options
   */
  page: Partial<PageOptions>

  /**
   * Page break options
   */
  pageBreak: Partial<PageBreakOptions>

  /**
   * Page header options
   */
  pageHeader: Partial<PageHeaderOptions>

  /**
   * Page footer options
   */
  pageFooter: Partial<PageFooterOptions>

  /**
   * Page number options
   */
  pageNumber: Partial<PageNumberOptions>

  /**
   * Enable page view mode (shows pages visually)
   * @default true
   */
  pageView: boolean

  /**
   * Paper size preset
   * @default 'letter'
   */
  paperSize: 'letter' | 'a4' | 'legal' | 'tabloid' | 'custom'

  /**
   * Page orientation
   * @default 'portrait'
   */
  orientation: 'portrait' | 'landscape'
}

const PAPER_SIZES = {
  letter: { width: '8.5in', height: '11in' },
  a4: { width: '210mm', height: '297mm' },
  legal: { width: '8.5in', height: '14in' },
  tabloid: { width: '11in', height: '17in' },
  custom: { width: '8.5in', height: '11in' },
}

declare module '@digitaltrendz/core' {
  interface Commands<ReturnType> {
    pagination: {
      /**
       * Set paper size
       * @param size Paper size preset
       * @example editor.commands.setPaperSize('a4')
       */
      setPaperSize: (size: PaginationOptions['paperSize']) => ReturnType
      /**
       * Set page orientation
       * @param orientation 'portrait' or 'landscape'
       * @example editor.commands.setOrientation('landscape')
       */
      setOrientation: (orientation: PaginationOptions['orientation']) => ReturnType
      /**
       * Toggle page view mode
       * @example editor.commands.togglePageView()
       */
      togglePageView: () => ReturnType
      /**
       * Print the document
       * @example editor.commands.printDocument()
       */
      printDocument: () => ReturnType
      /**
       * Export to PDF (triggers print dialog)
       * @example editor.commands.exportToPDF()
       */
      exportToPDF: () => ReturnType
    }
  }
}

/**
 * Pagination extension plugin key
 */
export const PaginationPluginKey = new PluginKey('pagination')

/**
 * Create a pagination plugin that handles page number updates
 */
function createPaginationPlugin(options: PaginationOptions) {
  return new Plugin({
    key: PaginationPluginKey,
    view(view: EditorView) {
      const updatePageNumbers = () => {
        const pages = view.dom.querySelectorAll('[data-type="page"]')
        const pageNumbers = view.dom.querySelectorAll('[data-type="page-number"]')
        const totalPages = pages.length || 1

        pageNumbers.forEach(pageNumber => {
          const page = pageNumber.closest('[data-type="page"]')
          const pageIndex = page ? Array.from(pages).indexOf(page) + 1 : 1

          const showTotal = pageNumber.getAttribute('data-show-total') === 'true'
          pageNumber.textContent = showTotal
            ? `${pageIndex} of ${totalPages}`
            : String(pageIndex)
        })
      }

      // Initial update
      setTimeout(updatePageNumbers, 0)

      return {
        update() {
          updatePageNumbers()
        },
        destroy() {
          // Cleanup if needed
        },
      }
    },
  })
}

/**
 * This extension adds Google Docs-like pagination to your editor.
 * @see https://tiptap.dev/api/extensions/pagination
 */
export const Pagination = Extension.create<PaginationOptions>({
  name: 'pagination',

  addOptions() {
    return {
      autoSplit: true,
      page: {},
      pageBreak: {},
      pageHeader: {},
      pageFooter: {},
      pageNumber: {},
      pageView: true,
      paperSize: 'letter',
      orientation: 'portrait',
    }
  },

  addExtensions() {
    const { paperSize, orientation, page } = this.options
    const size = PAPER_SIZES[paperSize]

    const pageWidth = orientation === 'portrait' ? size.width : size.height
    const pageHeight = orientation === 'portrait' ? size.height : size.width

    return [
      Page.configure({
        ...page,
        pageWidth,
        pageHeight,
      }),
      PageBreak.configure(this.options.pageBreak),
      PageHeader.configure(this.options.pageHeader),
      PageFooter.configure(this.options.pageFooter),
      PageNumber.configure(this.options.pageNumber),
    ]
  },

  addCommands() {
    return {
      setPaperSize:
        size =>
        ({ editor }) => {
          this.options.paperSize = size
          const dimensions = PAPER_SIZES[size]
          const { orientation } = this.options

          editor.commands.setPageOptions({
            pageWidth: orientation === 'portrait' ? dimensions.width : dimensions.height,
            pageHeight: orientation === 'portrait' ? dimensions.height : dimensions.width,
          })

          return true
        },

      setOrientation:
        orientation =>
        ({ editor }) => {
          this.options.orientation = orientation
          const dimensions = PAPER_SIZES[this.options.paperSize]

          editor.commands.setPageOptions({
            pageWidth: orientation === 'portrait' ? dimensions.width : dimensions.height,
            pageHeight: orientation === 'portrait' ? dimensions.height : dimensions.width,
          })

          return true
        },

      togglePageView:
        () =>
        ({ editor }) => {
          this.options.pageView = !this.options.pageView
          editor.view.dom.classList.toggle('page-view', this.options.pageView)
          return true
        },

      printDocument:
        () =>
        () => {
          window.print()
          return true
        },

      exportToPDF:
        () =>
        () => {
          // Trigger print dialog for PDF export
          window.print()
          return true
        },
    }
  },

  addProseMirrorPlugins() {
    return [createPaginationPlugin(this.options)]
  },

  addGlobalAttributes() {
    return [
      {
        types: ['page'],
        attributes: {
          class: {
            default: null,
            parseHTML: element => element.getAttribute('class'),
            renderHTML: attributes => {
              if (!attributes.class) {
                return {}
              }
              return { class: attributes.class }
            },
          },
        },
      },
    ]
  },
})
