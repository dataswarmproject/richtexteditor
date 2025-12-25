import type { AITool, AIToolContext, AIToolResult } from '../types.js'

/**
 * Expand selected text with more details
 */
export const expandTextTool: AITool = {
  name: 'expand_text',
  description: 'Expand the selected text by adding more details, examples, or explanations.',
  parameters: {
    type: 'object',
    properties: {
      expansionType: {
        type: 'string',
        description: 'How to expand the text',
        enum: ['elaborate', 'add-examples', 'add-details', 'explain-further'],
      },
      targetLength: {
        type: 'string',
        description: 'How much to expand the text',
        enum: ['slightly', 'moderately', 'significantly'],
      },
      maintainTone: {
        type: 'boolean',
        description: 'Whether to maintain the original tone',
      },
    },
  },

  async execute(params: Record<string, unknown>, context: AIToolContext): Promise<AIToolResult> {
    const {
      expansionType = 'elaborate',
      targetLength = 'moderately',
      maintainTone = true,
    } = params as {
      expansionType?: string
      targetLength?: string
      maintainTone?: boolean
    }

    if (context.selection.isEmpty) {
      return {
        success: false,
        error: 'No text selected. Please select text to expand.',
      }
    }

    try {
      const selectedText = context.selection.text

      // Placeholder for actual AI expansion
      const placeholder = `[AI will ${expansionType} (${targetLength}): "${selectedText.substring(0, 50)}..."${maintainTone ? ' (maintaining tone)' : ''}]`

      context.editor.chain().focus().deleteSelection().insertContent(placeholder).run()

      return {
        success: true,
        message: 'Text expansion initiated',
        data: { expansionType, targetLength, originalLength: selectedText.length },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to expand text',
      }
    }
  },
}
