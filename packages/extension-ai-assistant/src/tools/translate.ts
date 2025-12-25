import type { AITool, AIToolContext, AIToolResult } from '../types.js'

/**
 * Translate selected text to another language
 */
export const translateTool: AITool = {
  name: 'translate',
  description: 'Translate the selected text to another language.',
  parameters: {
    type: 'object',
    properties: {
      targetLanguage: {
        type: 'string',
        description: 'The language to translate to',
        enum: [
          'english', 'spanish', 'french', 'german', 'italian', 'portuguese',
          'chinese', 'japanese', 'korean', 'arabic', 'russian', 'hindi',
          'dutch', 'swedish', 'polish', 'turkish', 'vietnamese', 'thai',
        ],
      },
      preserveFormatting: {
        type: 'boolean',
        description: 'Whether to preserve the original formatting',
      },
      insertMode: {
        type: 'string',
        description: 'How to insert the translation',
        enum: ['replace', 'append', 'side-by-side'],
      },
    },
    required: ['targetLanguage'],
  },

  async execute(params: Record<string, unknown>, context: AIToolContext): Promise<AIToolResult> {
    const {
      targetLanguage,
      preserveFormatting = true,
      insertMode = 'replace',
    } = params as {
      targetLanguage: string
      preserveFormatting?: boolean
      insertMode?: string
    }

    if (context.selection.isEmpty) {
      return {
        success: false,
        error: 'No text selected. Please select text to translate.',
      }
    }

    try {
      const selectedText = context.selection.text

      // Placeholder for actual AI translation
      const placeholder = `[AI will translate to ${targetLanguage}: "${selectedText.substring(0, 50)}..."]`

      const { editor } = context

      switch (insertMode) {
        case 'append':
          editor.chain()
            .focus()
            .insertContentAt(context.selection.to, `<p><em>(${targetLanguage})</em> ${placeholder}</p>`)
            .run()
          break
        case 'side-by-side':
          editor.chain()
            .focus()
            .deleteSelection()
            .insertContent(`
              <table>
                <tr>
                  <td><strong>Original:</strong><br>${selectedText}</td>
                  <td><strong>${targetLanguage}:</strong><br>${placeholder}</td>
                </tr>
              </table>
            `)
            .run()
          break
        case 'replace':
        default:
          editor.chain().focus().deleteSelection().insertContent(placeholder).run()
          break
      }

      return {
        success: true,
        message: `Translation to ${targetLanguage} initiated`,
        data: { targetLanguage, originalText: selectedText, insertMode },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to translate text',
      }
    }
  },
}
