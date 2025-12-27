import type { JSONContent } from '@digitaltrendz/core'

/**
 * Canvas element types matching canvas-editor's element types
 */
export enum CanvasElementType {
  TEXT = 'text',
  IMAGE = 'image',
  TABLE = 'table',
  HYPERLINK = 'hyperlink',
  SUPERSCRIPT = 'superscript',
  SUBSCRIPT = 'subscript',
  SEPARATOR = 'separator',
  PAGE_BREAK = 'pageBreak',
  CONTROL = 'control',
  CHECKBOX = 'checkbox',
  LATEX = 'latex',
  TAB = 'tab',
  DATE = 'date',
  BLOCK = 'block',
  TITLE = 'title',
  LIST = 'list',
}

/**
 * Canvas element interface (compatible with canvas-editor's IElement)
 */
export interface CanvasElement {
  id?: string
  type?: CanvasElementType
  value?: string
  font?: string
  size?: number
  width?: number
  height?: number
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikeout?: boolean
  color?: string
  highlight?: string
  rowFlex?: 'left' | 'center' | 'right' | 'alignment' | 'justify'
  rowMargin?: number
  letterSpacing?: number
  url?: string
  valueList?: CanvasElement[]
  level?: 'first' | 'second' | 'third' | 'fourth' | 'fifth' | 'sixth'
  listType?: 'ul' | 'ol'
  listStyle?: string
  trList?: CanvasTrElement[]
  laTexSVG?: string
  control?: CanvasControlElement
  imgDisplay?: 'inline' | 'block' | 'surround' | 'float-left' | 'float-right'
  imgFloatPosition?: { x: number; y: number }
  extension?: Record<string, unknown>
}

/**
 * Table row element
 */
export interface CanvasTrElement {
  height?: number
  minHeight?: number
  tdList: CanvasTdElement[]
}

/**
 * Table cell element
 */
export interface CanvasTdElement {
  colspan?: number
  rowspan?: number
  width?: number
  verticalAlign?: 'top' | 'middle' | 'bottom'
  backgroundColor?: string
  borderTypes?: number[]
  slashTypes?: number[]
  value: CanvasElement[]
}

/**
 * Control element (form inputs)
 */
export interface CanvasControlElement {
  type: 'text' | 'select' | 'checkbox' | 'radio' | 'date'
  value?: string | null
  placeholder?: string
  code?: string | null
  min?: number
  max?: number
  extension?: Record<string, unknown>
  valueSets?: { value: string; code: string }[]
  dateFormat?: string
  checkbox?: { value: boolean }
  radio?: { value: boolean }
}

/**
 * Canvas editor data structure
 */
export interface CanvasEditorData {
  header?: CanvasElement[]
  main: CanvasElement[]
  footer?: CanvasElement[]
}

/**
 * Paper size options
 */
export type PaperSize = 'A3' | 'A4' | 'A5' | 'B4' | 'B5' | 'letter' | 'legal'

/**
 * Paper orientation
 */
export type PaperOrientation = 'portrait' | 'landscape'

/**
 * Renderer options
 */
export interface CanvasRendererOptions {
  /**
   * Paper size for rendering
   * @default 'A4'
   */
  paperSize?: PaperSize

  /**
   * Paper orientation
   * @default 'portrait'
   */
  orientation?: PaperOrientation

  /**
   * Page margins in millimeters
   */
  margins?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }

  /**
   * Header configuration
   */
  header?: {
    disabled?: boolean
    top?: number
    content?: CanvasElement[] | string
  }

  /**
   * Footer configuration
   */
  footer?: {
    disabled?: boolean
    bottom?: number
    content?: CanvasElement[] | string
  }

  /**
   * Watermark configuration
   */
  watermark?: {
    disabled?: boolean
    text?: string
    color?: string
    opacity?: number
    font?: string
    size?: number
    rotation?: number
  }

  /**
   * Page number configuration
   */
  pageNumber?: {
    disabled?: boolean
    format?: 'arabic' | 'roman'
    position?: 'left' | 'center' | 'right'
    startPageNo?: number
  }

  /**
   * Default font settings
   */
  defaultFont?: {
    family?: string
    size?: number
    color?: string
  }

  /**
   * Pixel ratio for export (higher = better quality)
   * @default 2
   */
  pixelRatio?: number

  /**
   * Background color
   * @default '#ffffff'
   */
  backgroundColor?: string
}

/**
 * Export options for images
 */
export interface ExportImageOptions {
  /**
   * Image format
   * @default 'png'
   */
  format?: 'png' | 'jpeg' | 'webp'

  /**
   * Image quality (0-1, for jpeg/webp)
   * @default 0.92
   */
  quality?: number

  /**
   * Pixel ratio for export
   * @default 2
   */
  pixelRatio?: number

  /**
   * Which pages to export (undefined = all)
   */
  pages?: number[]
}

/**
 * Export options for PDF
 */
export interface ExportPDFOptions {
  /**
   * PDF filename
   * @default 'document.pdf'
   */
  filename?: string

  /**
   * Pixel ratio for export
   * @default 2
   */
  pixelRatio?: number

  /**
   * PDF title metadata
   */
  title?: string

  /**
   * PDF author metadata
   */
  author?: string

  /**
   * PDF subject metadata
   */
  subject?: string

  /**
   * PDF keywords metadata
   */
  keywords?: string[]
}

/**
 * Print options
 */
export interface PrintOptions {
  /**
   * Pixel ratio for printing
   * @default 2
   */
  pixelRatio?: number

  /**
   * Which pages to print (undefined = all)
   */
  pages?: number[]
}

/**
 * Result of export operations
 */
export interface ExportResult {
  /**
   * Whether export was successful
   */
  success: boolean

  /**
   * Data URLs of exported images (one per page)
   */
  dataUrls?: string[]

  /**
   * PDF blob if exporting to PDF
   */
  pdfBlob?: Blob

  /**
   * Error message if export failed
   */
  error?: string

  /**
   * Number of pages exported
   */
  pageCount?: number
}

/**
 * Converter interface for transforming editor content
 */
export interface ContentConverter {
  /**
   * Convert ProseMirror JSON to canvas elements
   */
  toCanvasElements(content: JSONContent): CanvasElement[]

  /**
   * Convert canvas elements to ProseMirror JSON
   */
  fromCanvasElements(elements: CanvasElement[]): JSONContent
}
