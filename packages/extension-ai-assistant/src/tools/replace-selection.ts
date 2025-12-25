import type { AITool, AIToolContext, AIToolResult } from '../types.js'

/**
 * Replace the current selection with new content
 */
export const replaceSelectionTool: AITool = {
  name: 'replace_selection',
  description: 'Replace the currently selected text with new content.',
  parameters: {
    type: 'object',
    properties: {
      content: {
        type: 'string',
        description: 'The content to replace the selection with',
      },
      format: {
        type: 'string',
        description: 'The format of the content',
        enum: ['text', 'html', 'markdown'],
      },
    },
    required: ['content'],
  },

  async execute(params: Record<string, unknown>, context: AIToolContext): Promise<AIToolResult> {
    const { content, format = 'html' } = params as {
      content: string
      format?: string
    }

    if (context.selection.isEmpty) {
      // If no selection, insert at cursor
      return {
        success: false,
        error: 'No text selected. Please select text to replace.',
      }
    }

    try {
      const { editor } = context
      let insertContent = content

      // Convert formats if needed
      if (format === 'markdown') {
        insertContent = content
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`(.*?)`/g, '<code>$1</code>')
          .replace(/\n/g, '<br>')
      } else if (format === 'text') {
        insertContent = content.replace(/\n/g, '<br>')
      }

      editor.chain().focus().deleteSelection().insertContent(insertContent).run()

      return {
        success: true,
        message: 'Selection replaced successfully',
        data: {
          originalText: context.selection.text,
          newContentLength: content.length,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to replace selection',
      }
    }
  },
}
