import type { AITool, AIToolContext, AIToolResult } from '../types.js'

/**
 * Insert content at the current cursor position
 */
export const insertContentTool: AITool = {
  name: 'insert_content',
  description: 'Insert new content at the current cursor position in the document.',
  parameters: {
    type: 'object',
    properties: {
      content: {
        type: 'string',
        description: 'The content to insert (can be HTML or plain text)',
      },
      format: {
        type: 'string',
        description: 'The format of the content',
        enum: ['text', 'html', 'markdown'],
      },
      position: {
        type: 'string',
        description: 'Where to insert relative to cursor',
        enum: ['cursor', 'start', 'end', 'before-selection', 'after-selection'],
      },
    },
    required: ['content'],
  },

  async execute(params: Record<string, unknown>, context: AIToolContext): Promise<AIToolResult> {
    const {
      content,
      format = 'html',
      position = 'cursor',
    } = params as {
      content: string
      format?: string
      position?: string
    }

    try {
      const { editor } = context
      let insertContent = content

      // Convert markdown to HTML if needed
      if (format === 'markdown') {
        // Basic markdown conversion (full implementation would use a library)
        insertContent = content
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`(.*?)`/g, '<code>$1</code>')
          .replace(/\n/g, '<br>')
      } else if (format === 'text') {
        insertContent = `<p>${content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`
      }

      switch (position) {
        case 'start':
          editor.chain().focus('start').insertContent(insertContent).run()
          break
        case 'end':
          editor.chain().focus('end').insertContent(insertContent).run()
          break
        case 'before-selection':
          editor.chain().focus().insertContentAt(context.selection.from, insertContent).run()
          break
        case 'after-selection':
          editor.chain().focus().insertContentAt(context.selection.to, insertContent).run()
          break
        case 'cursor':
        default:
          editor.chain().focus().insertContent(insertContent).run()
          break
      }

      return {
        success: true,
        message: 'Content inserted successfully',
        data: { contentLength: content.length, position },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to insert content',
      }
    }
  },
}
