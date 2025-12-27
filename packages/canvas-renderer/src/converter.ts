import type { JSONContent } from '@digitaltrendz/core'

import type {
  CanvasElement,
  CanvasTrElement,
  CanvasTdElement,
  ContentConverter,
  CanvasElementType,
} from './types.js'
import { CanvasElementType as ElementType } from './types.js'

/**
 * Default converter implementation for transforming between
 * ProseMirror JSON and canvas-editor element format
 */
export class DefaultConverter implements ContentConverter {
  /**
   * Convert ProseMirror JSON content to canvas-editor elements
   */
  toCanvasElements(content: JSONContent): CanvasElement[] {
    if (!content) return []

    const elements: CanvasElement[] = []

    if (content.type === 'doc' && content.content) {
      for (const node of content.content) {
        elements.push(...this.convertNode(node))
      }
    } else {
      elements.push(...this.convertNode(content))
    }

    return elements
  }

  /**
   * Convert a single ProseMirror node to canvas elements
   */
  private convertNode(node: JSONContent): CanvasElement[] {
    const elements: CanvasElement[] = []

    switch (node.type) {
      case 'paragraph':
        elements.push(...this.convertParagraph(node))
        break

      case 'heading':
        elements.push(...this.convertHeading(node))
        break

      case 'text':
        elements.push(this.convertText(node))
        break

      case 'hardBreak':
        elements.push({ value: '\n' })
        break

      case 'horizontalRule':
        elements.push({ type: ElementType.SEPARATOR })
        break

      case 'image':
        elements.push(this.convertImage(node))
        break

      case 'bulletList':
      case 'orderedList':
        elements.push(...this.convertList(node))
        break

      case 'listItem':
        elements.push(...this.convertListItem(node))
        break

      case 'blockquote':
        elements.push(...this.convertBlockquote(node))
        break

      case 'codeBlock':
        elements.push(...this.convertCodeBlock(node))
        break

      case 'table':
        elements.push(this.convertTable(node))
        break

      case 'page':
        elements.push(...this.convertPage(node))
        break

      case 'pageBreak':
        elements.push({ type: ElementType.PAGE_BREAK })
        break

      default:
        // For unknown node types, try to extract text content
        if (node.content) {
          for (const child of node.content) {
            elements.push(...this.convertNode(child))
          }
        } else if (node.text) {
          elements.push(this.convertText(node))
        }
    }

    return elements
  }

  /**
   * Convert paragraph node
   */
  private convertParagraph(node: JSONContent): CanvasElement[] {
    const elements: CanvasElement[] = []

    if (node.content) {
      for (const child of node.content) {
        elements.push(...this.convertNode(child))
      }
    }

    // Add newline after paragraph
    elements.push({ value: '\n' })

    // Apply paragraph-level alignment
    if (node.attrs?.textAlign && elements.length > 0) {
      const alignment = this.mapAlignment(node.attrs.textAlign as string)
      elements.forEach(el => {
        el.rowFlex = alignment
      })
    }

    return elements
  }

  /**
   * Convert heading node
   */
  private convertHeading(node: JSONContent): CanvasElement[] {
    const level = (node.attrs?.level ?? 1) as number
    const levelMap: Record<number, CanvasElement['level']> = {
      1: 'first',
      2: 'second',
      3: 'third',
      4: 'fourth',
      5: 'fifth',
      6: 'sixth',
    }

    const elements: CanvasElement[] = []

    if (node.content) {
      for (const child of node.content) {
        const childElements = this.convertNode(child)
        for (const el of childElements) {
          el.type = ElementType.TITLE
          el.level = levelMap[level] ?? 'first'
          el.bold = true
          el.size = this.getHeadingSize(level)
          elements.push(el)
        }
      }
    }

    elements.push({ value: '\n' })

    return elements
  }

  /**
   * Get font size for heading level
   */
  private getHeadingSize(level: number): number {
    const sizes: Record<number, number> = {
      1: 32,
      2: 28,
      3: 24,
      4: 20,
      5: 18,
      6: 16,
    }
    return sizes[level] ?? 16
  }

  /**
   * Convert text node with marks
   */
  private convertText(node: JSONContent): CanvasElement {
    const element: CanvasElement = {
      value: node.text ?? '',
    }

    // Apply marks
    if (node.marks) {
      for (const mark of node.marks) {
        switch (mark.type) {
          case 'bold':
            element.bold = true
            break
          case 'italic':
            element.italic = true
            break
          case 'underline':
            element.underline = true
            break
          case 'strike':
            element.strikeout = true
            break
          case 'code':
            element.font = 'monospace'
            element.highlight = '#f5f5f5'
            break
          case 'link':
            element.type = ElementType.HYPERLINK
            element.url = mark.attrs?.href as string
            break
          case 'textStyle':
            if (mark.attrs?.color) {
              element.color = mark.attrs.color as string
            }
            if (mark.attrs?.fontSize) {
              element.size = parseInt(mark.attrs.fontSize as string, 10)
            }
            if (mark.attrs?.fontFamily) {
              element.font = mark.attrs.fontFamily as string
            }
            break
          case 'highlight':
            element.highlight = mark.attrs?.color as string ?? '#ffff00'
            break
          case 'superscript':
            element.type = ElementType.SUPERSCRIPT
            break
          case 'subscript':
            element.type = ElementType.SUBSCRIPT
            break
        }
      }
    }

    return element
  }

  /**
   * Convert image node
   */
  private convertImage(node: JSONContent): CanvasElement {
    return {
      type: ElementType.IMAGE,
      value: node.attrs?.src as string ?? '',
      width: node.attrs?.width as number,
      height: node.attrs?.height as number,
      imgDisplay: 'inline',
    }
  }

  /**
   * Convert list (bullet or ordered)
   */
  private convertList(node: JSONContent): CanvasElement[] {
    const elements: CanvasElement[] = []
    const isOrdered = node.type === 'orderedList'

    if (node.content) {
      let index = 1
      for (const item of node.content) {
        const itemElements = this.convertListItem(item)
        for (const el of itemElements) {
          if (!el.type || el.type === ElementType.TEXT) {
            el.type = ElementType.LIST
            el.listType = isOrdered ? 'ol' : 'ul'
            if (isOrdered) {
              el.listStyle = `${index}.`
            }
          }
        }
        elements.push(...itemElements)
        index++
      }
    }

    return elements
  }

  /**
   * Convert list item
   */
  private convertListItem(node: JSONContent): CanvasElement[] {
    const elements: CanvasElement[] = []

    if (node.content) {
      for (const child of node.content) {
        elements.push(...this.convertNode(child))
      }
    }

    return elements
  }

  /**
   * Convert blockquote
   */
  private convertBlockquote(node: JSONContent): CanvasElement[] {
    const elements: CanvasElement[] = []

    if (node.content) {
      for (const child of node.content) {
        const childElements = this.convertNode(child)
        for (const el of childElements) {
          el.color = el.color ?? '#666666'
          el.rowMargin = 20
        }
        elements.push(...childElements)
      }
    }

    return elements
  }

  /**
   * Convert code block
   */
  private convertCodeBlock(node: JSONContent): CanvasElement[] {
    const elements: CanvasElement[] = []
    const code = node.content?.map(c => c.text ?? '').join('') ?? ''
    const lines = code.split('\n')

    for (const line of lines) {
      elements.push({
        value: line,
        font: 'monospace',
        size: 14,
        highlight: '#f5f5f5',
      })
      elements.push({ value: '\n' })
    }

    return elements
  }

  /**
   * Convert table
   */
  private convertTable(node: JSONContent): CanvasElement {
    const trList: CanvasTrElement[] = []

    if (node.content) {
      for (const row of node.content) {
        if (row.type === 'tableRow') {
          trList.push(this.convertTableRow(row))
        }
      }
    }

    return {
      type: ElementType.TABLE,
      trList,
    }
  }

  /**
   * Convert table row
   */
  private convertTableRow(node: JSONContent): CanvasTrElement {
    const tdList: CanvasTdElement[] = []

    if (node.content) {
      for (const cell of node.content) {
        if (cell.type === 'tableCell' || cell.type === 'tableHeader') {
          tdList.push(this.convertTableCell(cell))
        }
      }
    }

    return { tdList }
  }

  /**
   * Convert table cell
   */
  private convertTableCell(node: JSONContent): CanvasTdElement {
    const value: CanvasElement[] = []

    if (node.content) {
      for (const child of node.content) {
        value.push(...this.convertNode(child))
      }
    }

    return {
      colspan: node.attrs?.colspan as number ?? 1,
      rowspan: node.attrs?.rowspan as number ?? 1,
      value,
    }
  }

  /**
   * Convert page node (from pagination extension)
   */
  private convertPage(node: JSONContent): CanvasElement[] {
    const elements: CanvasElement[] = []

    if (node.content) {
      for (const child of node.content) {
        elements.push(...this.convertNode(child))
      }
    }

    // Add page break after page (unless it's the last page)
    elements.push({ type: ElementType.PAGE_BREAK })

    return elements
  }

  /**
   * Map text alignment
   */
  private mapAlignment(align: string): CanvasElement['rowFlex'] {
    const map: Record<string, CanvasElement['rowFlex']> = {
      left: 'left',
      center: 'center',
      right: 'right',
      justify: 'justify',
    }
    return map[align] ?? 'left'
  }

  /**
   * Convert canvas elements back to ProseMirror JSON
   */
  fromCanvasElements(elements: CanvasElement[]): JSONContent {
    const content: JSONContent[] = []
    let currentParagraph: JSONContent = { type: 'paragraph', content: [] }

    for (const element of elements) {
      if (element.value === '\n') {
        // End current paragraph
        if (currentParagraph.content && currentParagraph.content.length > 0) {
          content.push(currentParagraph)
        }
        currentParagraph = { type: 'paragraph', content: [] }
        continue
      }

      if (element.type === ElementType.PAGE_BREAK) {
        if (currentParagraph.content && currentParagraph.content.length > 0) {
          content.push(currentParagraph)
          currentParagraph = { type: 'paragraph', content: [] }
        }
        content.push({ type: 'pageBreak' })
        continue
      }

      if (element.type === ElementType.SEPARATOR) {
        if (currentParagraph.content && currentParagraph.content.length > 0) {
          content.push(currentParagraph)
          currentParagraph = { type: 'paragraph', content: [] }
        }
        content.push({ type: 'horizontalRule' })
        continue
      }

      if (element.type === ElementType.IMAGE) {
        const imageNode: JSONContent = {
          type: 'image',
          attrs: {
            src: element.value,
            width: element.width,
            height: element.height,
          },
        }
        currentParagraph.content?.push(imageNode)
        continue
      }

      if (element.type === ElementType.TABLE && element.trList) {
        if (currentParagraph.content && currentParagraph.content.length > 0) {
          content.push(currentParagraph)
          currentParagraph = { type: 'paragraph', content: [] }
        }
        content.push(this.convertTableToProseMirror(element))
        continue
      }

      if (element.type === ElementType.TITLE && element.level) {
        const levelMap: Record<string, number> = {
          first: 1,
          second: 2,
          third: 3,
          fourth: 4,
          fifth: 5,
          sixth: 6,
        }

        if (currentParagraph.content && currentParagraph.content.length > 0) {
          content.push(currentParagraph)
        }

        currentParagraph = {
          type: 'heading',
          attrs: { level: levelMap[element.level] ?? 1 },
          content: [],
        }

        currentParagraph.content?.push(this.convertElementToText(element))
        continue
      }

      // Convert text element
      currentParagraph.content?.push(this.convertElementToText(element))
    }

    // Add remaining paragraph
    if (currentParagraph.content && currentParagraph.content.length > 0) {
      content.push(currentParagraph)
    }

    return {
      type: 'doc',
      content,
    }
  }

  /**
   * Convert canvas element to text node with marks
   */
  private convertElementToText(element: CanvasElement): JSONContent {
    const marks: JSONContent['marks'] = []

    if (element.bold) {
      marks.push({ type: 'bold' })
    }
    if (element.italic) {
      marks.push({ type: 'italic' })
    }
    if (element.underline) {
      marks.push({ type: 'underline' })
    }
    if (element.strikeout) {
      marks.push({ type: 'strike' })
    }
    if (element.type === ElementType.HYPERLINK && element.url) {
      marks.push({ type: 'link', attrs: { href: element.url } })
    }
    if (element.color || element.size || element.font) {
      marks.push({
        type: 'textStyle',
        attrs: {
          color: element.color,
          fontSize: element.size ? `${element.size}px` : undefined,
          fontFamily: element.font,
        },
      })
    }
    if (element.highlight) {
      marks.push({ type: 'highlight', attrs: { color: element.highlight } })
    }
    if (element.type === ElementType.SUPERSCRIPT) {
      marks.push({ type: 'superscript' })
    }
    if (element.type === ElementType.SUBSCRIPT) {
      marks.push({ type: 'subscript' })
    }

    return {
      type: 'text',
      text: element.value ?? '',
      marks: marks.length > 0 ? marks : undefined,
    }
  }

  /**
   * Convert canvas table to ProseMirror table
   */
  private convertTableToProseMirror(element: CanvasElement): JSONContent {
    const rows: JSONContent[] = []

    if (element.trList) {
      for (const tr of element.trList) {
        const cells: JSONContent[] = []
        for (const td of tr.tdList) {
          cells.push({
            type: 'tableCell',
            attrs: {
              colspan: td.colspan ?? 1,
              rowspan: td.rowspan ?? 1,
            },
            content: td.value
              ? [{ type: 'paragraph', content: td.value.map(v => this.convertElementToText(v)) }]
              : [{ type: 'paragraph' }],
          })
        }
        rows.push({ type: 'tableRow', content: cells })
      }
    }

    return {
      type: 'table',
      content: rows,
    }
  }
}

/**
 * Create a default converter instance
 */
export function createConverter(): ContentConverter {
  return new DefaultConverter()
}
