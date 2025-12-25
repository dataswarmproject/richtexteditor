import type { AITool, AIToolContext, AIToolResult } from '../types.js'

/**
 * Summarize selected text or entire document
 */
export const summarizeTool: AITool = {
  name: 'summarize',
  description: 'Create a summary of the selected text or the entire document.',
  parameters: {
    type: 'object',
    properties: {
      length: {
        type: 'string',
        description: 'Length of the summary',
        enum: ['brief', 'medium', 'detailed'],
      },
      format: {
        type: 'string',
        description: 'Format of the summary',
        enum: ['paragraph', 'bullets', 'numbered'],
      },
      scope: {
        type: 'string',
        description: 'What to summarize',
        enum: ['selection', 'document'],
      },
      insertPosition: {
        type: 'string',
        description: 'Where to insert the summary',
        enum: ['replace', 'before', 'after', 'end'],
      },
    },
  },

  async execute(params: Record<string, unknown>, context: AIToolContext): Promise<AIToolResult> {
    const {
      length = 'medium',
      format = 'paragraph',
      scope = 'selection',
      insertPosition = 'after',
    } = params as {
      length?: string
      format?: string
      scope?: string
      insertPosition?: string
    }

    try {
      const textToSummarize = scope === 'document'
        ? context.document.text
        : context.selection.text

      if (!textToSummarize || textToSummarize.trim().length === 0) {
        return {
          success: false,
          error: 'No text available to summarize. Please select text or ensure the document has content.',
        }
      }

      // Placeholder for actual AI summarization
      const placeholder = `[AI will create ${length} ${format} summary of: "${textToSummarize.substring(0, 50)}..."]`

      const { editor } = context

      switch (insertPosition) {
        case 'replace':
          if (!context.selection.isEmpty) {
            editor.chain().focus().deleteSelection().insertContent(`<p>${placeholder}</p>`).run()
          }
          break
        case 'before':
          editor.chain().focus().insertContentAt(context.selection.from, `<p>${placeholder}</p><p></p>`).run()
          break
        case 'end':
          editor.chain().focus('end').insertContent(`<hr><h3>Summary</h3><p>${placeholder}</p>`).run()
          break
        case 'after':
        default:
          editor.chain().focus().insertContentAt(context.selection.to, `<p></p><p>${placeholder}</p>`).run()
          break
      }

      return {
        success: true,
        message: 'Summarization initiated',
        data: { length, format, scope, textLength: textToSummarize.length },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to summarize text',
      }
    }
  },
}
