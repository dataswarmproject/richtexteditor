import type { AITool, AIToolContext, AIToolResult } from '../types.js'

/**
 * Fix grammar and spelling in selected text
 */
export const fixGrammarTool: AITool = {
  name: 'fix_grammar',
  description: 'Fix grammar, spelling, and punctuation errors in the selected text.',
  parameters: {
    type: 'object',
    properties: {
      scope: {
        type: 'string',
        description: 'What to check',
        enum: ['selection', 'paragraph', 'document'],
      },
      strictness: {
        type: 'string',
        description: 'How strict the grammar checking should be',
        enum: ['lenient', 'standard', 'strict'],
      },
      dialect: {
        type: 'string',
        description: 'English dialect to use',
        enum: ['american', 'british', 'australian'],
      },
    },
  },

  async execute(params: Record<string, unknown>, context: AIToolContext): Promise<AIToolResult> {
    const {
      scope = 'selection',
      strictness = 'standard',
      dialect = 'american',
    } = params as {
      scope?: string
      strictness?: string
      dialect?: string
    }

    try {
      let textToCheck: string

      switch (scope) {
        case 'document':
          textToCheck = context.document.text
          break
        case 'paragraph':
          // Get current paragraph text
          textToCheck = context.selection.text || context.document.text.substring(0, 500)
          break
        case 'selection':
        default:
          textToCheck = context.selection.text
          break
      }

      if (!textToCheck || textToCheck.trim().length === 0) {
        return {
          success: false,
          error: 'No text available to check. Please select text or ensure the document has content.',
        }
      }

      // Placeholder for actual AI grammar checking
      const placeholder = `[AI will fix grammar (${strictness}, ${dialect}): "${textToCheck.substring(0, 50)}..."]`

      if (scope === 'selection' && !context.selection.isEmpty) {
        context.editor.chain().focus().deleteSelection().insertContent(placeholder).run()
      } else {
        // For document/paragraph scope, we'd need more sophisticated replacement
        context.editor.chain().focus().insertContent(`<p><em>Grammar check result:</em> ${placeholder}</p>`).run()
      }

      return {
        success: true,
        message: 'Grammar check initiated',
        data: { scope, strictness, dialect, textLength: textToCheck.length },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check grammar',
      }
    }
  },
}
