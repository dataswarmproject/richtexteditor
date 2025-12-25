import type { AITool, AIToolContext, AIToolResult } from '../types.js'

/**
 * Generate new text content based on a prompt
 */
export const generateTextTool: AITool = {
  name: 'generate_text',
  description: 'Generate new text content based on a prompt. Use this to create new paragraphs, sections, or entire documents.',
  parameters: {
    type: 'object',
    properties: {
      prompt: {
        type: 'string',
        description: 'The prompt describing what content to generate',
      },
      style: {
        type: 'string',
        description: 'The writing style to use',
        enum: ['professional', 'casual', 'academic', 'creative', 'technical'],
      },
      length: {
        type: 'string',
        description: 'Approximate length of the generated content',
        enum: ['short', 'medium', 'long'],
      },
      insertAt: {
        type: 'string',
        description: 'Where to insert the generated content',
        enum: ['cursor', 'end', 'replace'],
      },
    },
    required: ['prompt'],
  },

  async execute(params: Record<string, unknown>, context: AIToolContext): Promise<AIToolResult> {
    const { prompt, style = 'professional', insertAt = 'cursor' } = params as {
      prompt: string
      style?: string
      insertAt?: string
    }

    try {
      // This is a placeholder - actual AI generation would happen via the provider
      const placeholder = `[AI will generate content for: "${prompt}" in ${style} style]`

      const { editor } = context

      switch (insertAt) {
        case 'end':
          editor.chain().focus('end').insertContent(`<p>${placeholder}</p>`).run()
          break
        case 'replace':
          if (!context.selection.isEmpty) {
            editor.chain().focus().deleteSelection().insertContent(placeholder).run()
          } else {
            editor.chain().focus().insertContent(placeholder).run()
          }
          break
        case 'cursor':
        default:
          editor.chain().focus().insertContent(placeholder).run()
          break
      }

      return {
        success: true,
        message: 'Text generation initiated',
        data: { prompt, style, insertAt },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate text',
      }
    }
  },
}
