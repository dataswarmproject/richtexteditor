import type { AITool, AIToolContext, AIToolResult } from '../types.js'

/**
 * Format text into different structures
 */
export const formatTextTool: AITool = {
  name: 'format_text',
  description: 'Format text into different structures like lists, tables, or headings.',
  parameters: {
    type: 'object',
    properties: {
      format: {
        type: 'string',
        description: 'The format to convert the text into',
        enum: ['bullet-list', 'numbered-list', 'table', 'headings', 'paragraphs', 'blockquote'],
      },
      options: {
        type: 'object',
        description: 'Additional formatting options',
      },
    },
    required: ['format'],
  },

  async execute(params: Record<string, unknown>, context: AIToolContext): Promise<AIToolResult> {
    const { format } = params as { format: string }

    if (context.selection.isEmpty) {
      return {
        success: false,
        error: 'No text selected. Please select text to format.',
      }
    }

    try {
      const selectedText = context.selection.text
      const { editor } = context
      let formattedContent: string

      switch (format) {
        case 'bullet-list':
          formattedContent = `<ul>${selectedText.split('\n').filter(line => line.trim()).map(line => `<li>${line.trim()}</li>`).join('')}</ul>`
          break
        case 'numbered-list':
          formattedContent = `<ol>${selectedText.split('\n').filter(line => line.trim()).map(line => `<li>${line.trim()}</li>`).join('')}</ol>`
          break
        case 'table':
          // Convert to simple table with AI assistance placeholder
          formattedContent = `[AI will convert to table: "${selectedText.substring(0, 50)}..."]`
          break
        case 'headings':
          // AI would determine appropriate heading structure
          formattedContent = `[AI will structure with headings: "${selectedText.substring(0, 50)}..."]`
          break
        case 'blockquote':
          formattedContent = `<blockquote>${selectedText}</blockquote>`
          break
        case 'paragraphs':
        default:
          formattedContent = selectedText.split('\n\n').filter(p => p.trim()).map(p => `<p>${p.trim()}</p>`).join('')
          break
      }

      editor.chain().focus().deleteSelection().insertContent(formattedContent).run()

      return {
        success: true,
        message: `Text formatted as ${format}`,
        data: { format },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to format text',
      }
    }
  },
}
