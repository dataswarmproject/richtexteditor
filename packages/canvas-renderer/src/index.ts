/**
 * @digitaltrendz/canvas-renderer
 *
 * Canvas-based document renderer for high-quality print and PDF export.
 * Uses canvas-editor internally to render TipTap/ProseMirror content
 * as pixel-perfect pages suitable for printing.
 *
 * @example
 * ```ts
 * import { createCanvasRenderer } from '@digitaltrendz/canvas-renderer'
 *
 * const renderer = createCanvasRenderer(editor, {
 *   paperSize: 'A4',
 *   orientation: 'portrait',
 *   header: { content: 'My Document' },
 *   footer: { content: 'Page {pageNo}' },
 * })
 *
 * // Export to images
 * const result = await renderer.exportToImages()
 * if (result.success) {
 *   result.dataUrls.forEach((url, i) => {
 *     console.log(`Page ${i + 1}:`, url)
 *   })
 * }
 *
 * // Print document
 * await renderer.print()
 * ```
 *
 * @packageDocumentation
 */

export * from './types.js'
export * from './converter.js'
export * from './renderer.js'
