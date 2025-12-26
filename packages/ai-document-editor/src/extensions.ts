import { type AnyExtension,Extension } from '@digitaltrendz/core'
import { type AIAssistantOptions,AIAssistant } from '@digitaltrendz/extension-ai-assistant'
import Blockquote from '@digitaltrendz/extension-blockquote'
import Bold from '@digitaltrendz/extension-bold'
import BulletList from '@digitaltrendz/extension-bullet-list'
import Code from '@digitaltrendz/extension-code'
import CodeBlock from '@digitaltrendz/extension-code-block'
// Core extensions
import Document from '@digitaltrendz/extension-document'
import Dropcursor from '@digitaltrendz/extension-dropcursor'
import FloatingMenu from '@digitaltrendz/extension-floating-menu'
import Gapcursor from '@digitaltrendz/extension-gapcursor'
import HardBreak from '@digitaltrendz/extension-hard-break'
import Heading from '@digitaltrendz/extension-heading'
import Highlight from '@digitaltrendz/extension-highlight'
import HorizontalRule from '@digitaltrendz/extension-horizontal-rule'
import Image from '@digitaltrendz/extension-image'
import Italic from '@digitaltrendz/extension-italic'
import Link from '@digitaltrendz/extension-link'
import ListItem from '@digitaltrendz/extension-list-item'
import OrderedList from '@digitaltrendz/extension-ordered-list'
// AI & Pagination extensions
import { type PaginationOptions,Pagination } from '@digitaltrendz/extension-pagination'
import Paragraph from '@digitaltrendz/extension-paragraph'
import Placeholder from '@digitaltrendz/extension-placeholder'
import Strike from '@digitaltrendz/extension-strike'
import { TableKit as Table } from '@digitaltrendz/extension-table'
import TaskItem from '@digitaltrendz/extension-task-item'
import TaskList from '@digitaltrendz/extension-task-list'
import Text from '@digitaltrendz/extension-text'
import TextAlign from '@digitaltrendz/extension-text-align'
import { TextStyle } from '@digitaltrendz/extension-text-style'
import Typography from '@digitaltrendz/extension-typography'
import Underline from '@digitaltrendz/extension-underline'

export interface AIDocumentEditorKitOptions {
  /**
   * Document extension options
   */
  document?: false

  /**
   * Paragraph extension options
   */
  paragraph?: false

  /**
   * Text extension options
   */
  text?: false

  /**
   * Heading extension options
   */
  heading?: Partial<Parameters<typeof Heading.configure>[0]> | false

  /**
   * Bold extension options
   */
  bold?: Partial<Parameters<typeof Bold.configure>[0]> | false

  /**
   * Italic extension options
   */
  italic?: Partial<Parameters<typeof Italic.configure>[0]> | false

  /**
   * Underline extension options
   */
  underline?: Partial<Parameters<typeof Underline.configure>[0]> | false

  /**
   * Strike extension options
   */
  strike?: Partial<Parameters<typeof Strike.configure>[0]> | false

  /**
   * Code extension options
   */
  code?: Partial<Parameters<typeof Code.configure>[0]> | false

  /**
   * Code block extension options
   */
  codeBlock?: Partial<Parameters<typeof CodeBlock.configure>[0]> | false

  /**
   * Blockquote extension options
   */
  blockquote?: Partial<Parameters<typeof Blockquote.configure>[0]> | false

  /**
   * Bullet list extension options
   */
  bulletList?: Partial<Parameters<typeof BulletList.configure>[0]> | false

  /**
   * Ordered list extension options
   */
  orderedList?: Partial<Parameters<typeof OrderedList.configure>[0]> | false

  /**
   * List item extension options
   */
  listItem?: Partial<Parameters<typeof ListItem.configure>[0]> | false

  /**
   * Link extension options
   */
  link?: Partial<Parameters<typeof Link.configure>[0]> | false

  /**
   * Image extension options
   */
  image?: Partial<Parameters<typeof Image.configure>[0]> | false

  /**
   * Hard break extension options
   */
  hardBreak?: Partial<Parameters<typeof HardBreak.configure>[0]> | false

  /**
   * Horizontal rule extension options
   */
  horizontalRule?: Partial<Parameters<typeof HorizontalRule.configure>[0]> | false

  /**
   * Dropcursor extension options
   */
  dropcursor?: Partial<Parameters<typeof Dropcursor.configure>[0]> | false

  /**
   * Gapcursor extension options
   */
  gapcursor?: false

  /**
   * Highlight extension options
   */
  highlight?: Partial<Parameters<typeof Highlight.configure>[0]> | false

  /**
   * Text align extension options
   */
  textAlign?: Partial<Parameters<typeof TextAlign.configure>[0]> | false

  /**
   * Text style extension options
   */
  textStyle?: Partial<Parameters<typeof TextStyle.configure>[0]> | false

  /**
   * Typography extension options
   */
  typography?: Partial<Parameters<typeof Typography.configure>[0]> | false

  /**
   * Table extension options
   */
  table?: Partial<Parameters<typeof Table.configure>[0]> | false

  /**
   * Task list extension options
   */
  taskList?: Partial<Parameters<typeof TaskList.configure>[0]> | false

  /**
   * Task item extension options
   */
  taskItem?: Partial<Parameters<typeof TaskItem.configure>[0]> | false

  /**
   * Placeholder extension options
   */
  placeholder?: Partial<Parameters<typeof Placeholder.configure>[0]> | false

  /**
   * Floating menu extension options
   */
  floatingMenu?: Partial<Parameters<typeof FloatingMenu.configure>[0]> | false

  /**
   * Pagination extension options
   */
  pagination?: Partial<PaginationOptions> | false

  /**
   * AI Assistant extension options
   */
  aiAssistant?: Partial<AIAssistantOptions> | false
}

/**
 * AI Document Editor Kit - A comprehensive extension bundle for building
 * Google Docs-like document editors with AI capabilities.
 */
export const AIDocumentEditorKit = Extension.create<AIDocumentEditorKitOptions>({
  name: 'aiDocumentEditorKit',

  addExtensions() {
    const extensions: AnyExtension[] = []

    // Document structure
    if (this.options.document !== false) {
      extensions.push(Document)
    }

    if (this.options.paragraph !== false) {
      extensions.push(Paragraph)
    }

    if (this.options.text !== false) {
      extensions.push(Text)
    }

    if (this.options.heading !== false) {
      extensions.push(
        Heading.configure({
          levels: [1, 2, 3, 4, 5, 6],
          ...this.options.heading,
        }),
      )
    }

    // Text formatting
    if (this.options.bold !== false) {
      extensions.push(Bold.configure(this.options.bold))
    }

    if (this.options.italic !== false) {
      extensions.push(Italic.configure(this.options.italic))
    }

    if (this.options.underline !== false) {
      extensions.push(Underline.configure(this.options.underline))
    }

    if (this.options.strike !== false) {
      extensions.push(Strike.configure(this.options.strike))
    }

    if (this.options.code !== false) {
      extensions.push(Code.configure(this.options.code))
    }

    if (this.options.codeBlock !== false) {
      extensions.push(CodeBlock.configure(this.options.codeBlock))
    }

    if (this.options.highlight !== false) {
      extensions.push(
        Highlight.configure({
          multicolor: true,
          ...this.options.highlight,
        }),
      )
    }

    // Block elements
    if (this.options.blockquote !== false) {
      extensions.push(Blockquote.configure(this.options.blockquote))
    }

    if (this.options.bulletList !== false) {
      extensions.push(BulletList.configure(this.options.bulletList))
    }

    if (this.options.orderedList !== false) {
      extensions.push(OrderedList.configure(this.options.orderedList))
    }

    if (this.options.listItem !== false) {
      extensions.push(ListItem.configure(this.options.listItem))
    }

    if (this.options.horizontalRule !== false) {
      extensions.push(HorizontalRule.configure(this.options.horizontalRule))
    }

    if (this.options.hardBreak !== false) {
      extensions.push(HardBreak.configure(this.options.hardBreak))
    }

    // Links and media
    if (this.options.link !== false) {
      extensions.push(
        Link.configure({
          openOnClick: false,
          autolink: true,
          ...this.options.link,
        }),
      )
    }

    if (this.options.image !== false) {
      extensions.push(
        Image.configure({
          inline: false,
          allowBase64: true,
          ...this.options.image,
        }),
      )
    }

    // Tables
    if (this.options.table !== false) {
      extensions.push(
        Table.configure({
          table: {
            resizable: true,
            ...(typeof this.options.table === 'object' ? this.options.table : {}),
          },
        }),
      )
    }

    // Task lists
    if (this.options.taskList !== false) {
      extensions.push(TaskList.configure(this.options.taskList))
    }

    if (this.options.taskItem !== false) {
      extensions.push(
        TaskItem.configure({
          nested: true,
          ...this.options.taskItem,
        }),
      )
    }

    // Text styling
    if (this.options.textAlign !== false) {
      extensions.push(
        TextAlign.configure({
          types: ['heading', 'paragraph'],
          ...this.options.textAlign,
        }),
      )
    }

    if (this.options.textStyle !== false) {
      extensions.push(TextStyle.configure(this.options.textStyle))
    }

    if (this.options.typography !== false) {
      extensions.push(Typography.configure(this.options.typography))
    }

    // Utilities
    if (this.options.dropcursor !== false) {
      extensions.push(
        Dropcursor.configure({
          color: '#3b82f6',
          width: 2,
          ...this.options.dropcursor,
        }),
      )
    }

    if (this.options.gapcursor !== false) {
      extensions.push(Gapcursor)
    }

    if (this.options.placeholder !== false) {
      extensions.push(
        Placeholder.configure({
          placeholder: 'Start writing or press / for commands...',
          ...this.options.placeholder,
        }),
      )
    }

    if (this.options.floatingMenu !== false) {
      extensions.push(FloatingMenu.configure(this.options.floatingMenu))
    }

    // Pagination
    if (this.options.pagination !== false) {
      extensions.push(
        Pagination.configure({
          paperSize: 'letter',
          orientation: 'portrait',
          pageView: true,
          ...this.options.pagination,
        }),
      )
    }

    // AI Assistant
    if (this.options.aiAssistant !== false) {
      extensions.push(
        AIAssistant.configure({
          enableDefaultTools: true,
          enableDefaultActions: true,
          ...this.options.aiAssistant,
        }),
      )
    }

    return extensions
  },
})

export default AIDocumentEditorKit
