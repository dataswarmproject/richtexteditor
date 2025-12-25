import type { AITool, AIToolContext, AIToolResult } from '../types.js'

/**
 * Rewrite selected text with different tone or style
 */
export const rewriteTextTool: AITool = {
  name: 'rewrite_text',
  description: 'Rewrite the selected text with a different tone, style, or approach while maintaining the core meaning.',
  parameters: {
    type: 'object',
    properties: {
      tone: {
        type: 'string',
        description: 'The tone to use for rewriting',
        enum: ['professional', 'casual', 'formal', 'friendly', 'persuasive', 'neutral'],
      },
      style: {
        type: 'string',
        description: 'The writing style to apply',
        enum: ['concise', 'detailed', 'conversational', 'academic', 'journalistic'],
      },
      customInstructions: {
        type: 'string',
        description: 'Additional instructions for how to rewrite the text',
      },
    },
  },

  async execute(params: Record<string, unknown>, context: AIToolContext): Promise<AIToolResult> {
    const { tone = 'professional', style = 'concise', customInstructions } = params as {
      tone?: string
      style?: string
      customInstructions?: string
    }

    if (context.selection.isEmpty) {
      return {
        success: false,
        error: 'No text selected. Please select text to rewrite.',
      }
    }

    try {
      const selectedText = context.selection.text

      // Placeholder for actual AI rewriting
      const placeholder = `[AI will rewrite: "${selectedText.substring(0, 50)}..." in ${tone} tone, ${style} style${customInstructions ? ` with: ${customInstructions}` : ''}]`

      context.editor.chain().focus().deleteSelection().insertContent(placeholder).run()

      return {
        success: true,
        message: 'Text rewriting initiated',
        data: { originalText: selectedText, tone, style },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to rewrite text',
      }
    }
  },
}
