import type { Editor as CanvasEditor, IEditorOption, IElement } from '@hufe921/canvas-editor'
import type { JSONContent, Editor } from '@digitaltrendz/core'

import type {
  CanvasRendererOptions,
  ExportImageOptions,
  ExportPDFOptions,
  ExportResult,
  PrintOptions,
  CanvasElement,
  PaperSize,
  PaperOrientation,
} from './types.js'
import { createConverter } from './converter.js'

/**
 * Paper size dimensions in pixels (at 96 DPI)
 */
const PAPER_SIZES: Record<PaperSize, { width: number; height: number }> = {
  A3: { width: 1123, height: 1587 },
  A4: { width: 794, height: 1123 },
  A5: { width: 559, height: 794 },
  B4: { width: 944, height: 1334 },
  B5: { width: 665, height: 944 },
  letter: { width: 816, height: 1056 },
  legal: { width: 816, height: 1344 },
}

/**
 * Default margin in pixels
 */
const DEFAULT_MARGIN = 75 // ~20mm at 96 DPI

/**
 * Canvas-based document renderer for high-quality print and PDF export
 *
 * This renderer uses canvas-editor to render TipTap/ProseMirror content
 * as pixel-perfect pages suitable for printing or PDF export.
 *
 * @example
 * ```ts
 * const renderer = new CanvasRenderer(editor, {
 *   paperSize: 'A4',
 *   orientation: 'portrait',
 *   header: { content: 'Document Title' },
 *   footer: { content: 'Page {pageNo}' },
 * })
 *
 * // Export to images
 * const result = await renderer.exportToImages()
 *
 * // Print document
 * await renderer.print()
 * ```
 */
export class CanvasRenderer {
  private editor: Editor | null = null
  private canvasEditor: CanvasEditor | null = null
  private container: HTMLDivElement | null = null
  private options: CanvasRendererOptions
  private converter = createConverter()

  constructor(editor?: Editor | null, options: CanvasRendererOptions = {}) {
    this.editor = editor ?? null
    this.options = {
      paperSize: 'A4',
      orientation: 'portrait',
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      ...options,
    }
  }

  /**
   * Set the TipTap editor instance
   */
  setEditor(editor: Editor): void {
    this.editor = editor
  }

  /**
   * Update renderer options
   */
  setOptions(options: Partial<CanvasRendererOptions>): void {
    this.options = { ...this.options, ...options }
  }

  /**
   * Get current options
   */
  getOptions(): CanvasRendererOptions {
    return { ...this.options }
  }

  /**
   * Initialize the canvas editor for rendering
   */
  private async initCanvasEditor(): Promise<void> {
    // Dynamically import canvas-editor
    const { default: Editor } = await import('@hufe921/canvas-editor')

    // Create container element (offscreen)
    this.container = document.createElement('div')
    this.container.style.cssText = `
      position: fixed;
      left: -9999px;
      top: -9999px;
      visibility: hidden;
    `
    document.body.appendChild(this.container)

    // Get paper dimensions
    const { width, height } = this.getPaperDimensions()

    // Convert editor content to canvas elements
    const content = this.getEditorContent()
    const mainElements = this.converter.toCanvasElements(content)

    // Build editor options
    const editorOptions = this.buildEditorOptions(width, height)

    // Create canvas editor
    this.canvasEditor = new Editor(
      this.container,
      {
        main: mainElements as IElement[],
        header: this.options.header?.content
          ? this.parseHeaderFooter(this.options.header.content)
          : undefined,
        footer: this.options.footer?.content
          ? this.parseHeaderFooter(this.options.footer.content)
          : undefined,
      },
      editorOptions,
    )
  }

  /**
   * Clean up canvas editor and container
   */
  private cleanup(): void {
    if (this.container) {
      document.body.removeChild(this.container)
      this.container = null
    }
    this.canvasEditor = null
  }

  /**
   * Get paper dimensions based on size and orientation
   */
  private getPaperDimensions(): { width: number; height: number } {
    const size = PAPER_SIZES[this.options.paperSize ?? 'A4']
    const isLandscape = this.options.orientation === 'landscape'

    return {
      width: isLandscape ? size.height : size.width,
      height: isLandscape ? size.width : size.height,
    }
  }

  /**
   * Get editor content as ProseMirror JSON
   */
  private getEditorContent(): JSONContent {
    if (!this.editor) {
      return { type: 'doc', content: [] }
    }
    return this.editor.getJSON()
  }

  /**
   * Build canvas-editor options
   */
  private buildEditorOptions(width: number, height: number): IEditorOption {
    const margins = this.options.margins ?? {}

    const options: IEditorOption = {
      width,
      height,
      margins: [
        margins.top ?? DEFAULT_MARGIN,
        margins.right ?? DEFAULT_MARGIN,
        margins.bottom ?? DEFAULT_MARGIN,
        margins.left ?? DEFAULT_MARGIN,
      ],
      pageMode: 1, // PAGING mode
      pageNumber: this.options.pageNumber?.disabled
        ? undefined
        : {
            format: this.options.pageNumber?.format ?? 'arabic',
            rowFlex: this.options.pageNumber?.position ?? 'center',
            startPageNo: this.options.pageNumber?.startPageNo ?? 1,
          },
      header: this.options.header?.disabled
        ? { disabled: true }
        : {
            top: this.options.header?.top ?? 30,
          },
      footer: this.options.footer?.disabled
        ? { disabled: true }
        : {
            bottom: this.options.footer?.bottom ?? 30,
          },
      watermark: this.options.watermark?.disabled
        ? { disabled: true }
        : this.options.watermark?.text
          ? {
              data: this.options.watermark.text,
              color: this.options.watermark.color ?? '#cccccc',
              opacity: this.options.watermark.opacity ?? 0.3,
              font: this.options.watermark.font ?? 'Arial',
              size: this.options.watermark.size ?? 48,
            }
          : undefined,
      defaultFont: this.options.defaultFont?.family ?? 'Arial',
      defaultSize: this.options.defaultFont?.size ?? 16,
      defaultBasicStyle: {
        color: this.options.defaultFont?.color ?? '#000000',
      },
      backgroundColor: this.options.backgroundColor,
    }

    return options
  }

  /**
   * Parse header/footer content (string or elements)
   */
  private parseHeaderFooter(
    content: CanvasElement[] | string,
  ): IElement[] {
    if (typeof content === 'string') {
      return [{ value: content }] as IElement[]
    }
    return content as IElement[]
  }

  /**
   * Export document to images
   */
  async exportToImages(options: ExportImageOptions = {}): Promise<ExportResult> {
    try {
      await this.initCanvasEditor()

      if (!this.canvasEditor) {
        throw new Error('Canvas editor not initialized')
      }

      const format = options.format ?? 'png'
      const quality = options.quality ?? 0.92
      const pixelRatio = options.pixelRatio ?? this.options.pixelRatio ?? 2

      // Get image data URLs from canvas editor
      const images = await this.canvasEditor.command.getImage({
        pixelRatio,
      })

      // Filter pages if specified
      let dataUrls = images
      if (options.pages && options.pages.length > 0) {
        dataUrls = options.pages
          .filter(p => p >= 0 && p < images.length)
          .map(p => images[p])
      }

      // Convert format if needed
      if (format !== 'png') {
        dataUrls = await Promise.all(
          dataUrls.map((url: string) => this.convertImageFormat(url, format, quality)),
        )
      }

      this.cleanup()

      return {
        success: true,
        dataUrls,
        pageCount: dataUrls.length,
      }
    } catch (error) {
      this.cleanup()
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Export failed',
      }
    }
  }

  /**
   * Convert image data URL to different format
   */
  private async convertImageFormat(
    dataUrl: string,
    format: 'jpeg' | 'webp',
    quality: number,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL(`image/${format}`, quality))
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = dataUrl
    })
  }

  /**
   * Export document to PDF
   * Note: This creates images and packages them as a PDF
   */
  async exportToPDF(options: ExportPDFOptions = {}): Promise<ExportResult> {
    try {
      // First export to images
      const imageResult = await this.exportToImages({
        format: 'png',
        pixelRatio: options.pixelRatio ?? 2,
      })

      if (!imageResult.success || !imageResult.dataUrls) {
        return imageResult
      }

      // Create PDF using jsPDF (would need to be added as dependency)
      // For now, return the images and let the consumer create the PDF
      const pdfBlob = await this.createPDFBlob(
        imageResult.dataUrls,
        options,
      )

      return {
        success: true,
        pdfBlob,
        pageCount: imageResult.pageCount,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'PDF export failed',
      }
    }
  }

  /**
   * Create PDF blob from images
   * This is a simple implementation - for production, use a proper PDF library
   */
  private async createPDFBlob(
    _dataUrls: string[],
    _options: ExportPDFOptions,
  ): Promise<Blob> {
    // This would use jsPDF or similar library
    // For now, we'll return a placeholder
    // In a real implementation:
    // const pdf = new jsPDF({ ... })
    // dataUrls.forEach((url, i) => {
    //   if (i > 0) pdf.addPage()
    //   pdf.addImage(url, 'PNG', 0, 0, width, height)
    // })
    // return pdf.output('blob')

    throw new Error(
      'PDF export requires jspdf library. ' +
        'Install it with: npm install jspdf\n' +
        'Or use exportToImages() and create PDF yourself.',
    )
  }

  /**
   * Print document using browser print dialog
   */
  async print(options: PrintOptions = {}): Promise<void> {
    try {
      await this.initCanvasEditor()

      if (!this.canvasEditor) {
        throw new Error('Canvas editor not initialized')
      }

      const pixelRatio = options.pixelRatio ?? this.options.pixelRatio ?? 2

      // Get images
      const images = await this.canvasEditor.command.getImage({
        pixelRatio,
      })

      // Filter pages if specified
      let printImages = images
      if (options.pages && options.pages.length > 0) {
        printImages = options.pages
          .filter(p => p >= 0 && p < images.length)
          .map(p => images[p])
      }

      // Create print frame
      this.printImages(printImages)

      this.cleanup()
    } catch (error) {
      this.cleanup()
      throw error
    }
  }

  /**
   * Print images using iframe
   */
  private printImages(images: string[]): void {
    const { width, height } = this.getPaperDimensions()
    const isLandscape = this.options.orientation === 'landscape'

    // Create iframe for printing
    const iframe = document.createElement('iframe')
    iframe.style.cssText = 'position: fixed; left: -9999px; top: -9999px;'
    document.body.appendChild(iframe)

    const iframeDoc = iframe.contentDocument ?? iframe.contentWindow?.document
    if (!iframeDoc) {
      document.body.removeChild(iframe)
      throw new Error('Could not access iframe document')
    }

    // Build print content
    const paperSize = this.options.paperSize ?? 'A4'
    const imagesHtml = images
      .map(
        (url, i) =>
          `<img src="${url}" style="width: 100%; height: auto; ${i > 0 ? 'page-break-before: always;' : ''}" />`,
      )
      .join('')

    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          @page {
            size: ${paperSize} ${isLandscape ? 'landscape' : 'portrait'};
            margin: 0;
          }
          @media print {
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
            }
            img {
              display: block;
              max-width: 100%;
              height: auto;
            }
          }
          body {
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        ${imagesHtml}
      </body>
      </html>
    `)
    iframeDoc.close()

    // Wait for images to load then print
    const imgElements = iframeDoc.querySelectorAll('img')
    let loadedCount = 0

    const checkAndPrint = () => {
      loadedCount++
      if (loadedCount === imgElements.length) {
        iframe.contentWindow?.focus()
        iframe.contentWindow?.print()

        // Remove iframe after print dialog closes
        setTimeout(() => {
          document.body.removeChild(iframe)
        }, 100)
      }
    }

    if (imgElements.length === 0) {
      document.body.removeChild(iframe)
      return
    }

    imgElements.forEach(img => {
      if (img.complete) {
        checkAndPrint()
      } else {
        img.onload = checkAndPrint
        img.onerror = checkAndPrint
      }
    })
  }

  /**
   * Get canvas elements from current editor content
   * Useful for debugging or custom processing
   */
  getCanvasElements(): CanvasElement[] {
    const content = this.getEditorContent()
    return this.converter.toCanvasElements(content)
  }

  /**
   * Render content to a specific canvas element
   */
  async renderToCanvas(
    canvas: HTMLCanvasElement,
    pageIndex = 0,
  ): Promise<void> {
    const result = await this.exportToImages({ pages: [pageIndex] })

    if (!result.success || !result.dataUrls?.[0]) {
      throw new Error(result.error ?? 'Failed to render')
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Could not get canvas context')
    }

    const img = new Image()
    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        resolve()
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = result.dataUrls![0]
    })
  }

  /**
   * Get page count for current content
   */
  async getPageCount(): Promise<number> {
    try {
      await this.initCanvasEditor()

      if (!this.canvasEditor) {
        return 0
      }

      const count = this.canvasEditor.command.getPageCount?.() ?? 1
      this.cleanup()
      return count
    } catch {
      this.cleanup()
      return 0
    }
  }
}

/**
 * Create a canvas renderer instance
 */
export function createCanvasRenderer(
  editor?: Editor | null,
  options?: CanvasRendererOptions,
): CanvasRenderer {
  return new CanvasRenderer(editor, options)
}
