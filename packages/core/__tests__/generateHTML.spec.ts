import { generateHTML } from '@inkflow/core'
import Document from '@inkflow/extension-document'
import Paragraph from '@inkflow/extension-paragraph'
import Text from '@inkflow/extension-text'
import { describe, expect, it } from 'vitest'

describe('generateHTML', () => {
  it('generate HTML from JSON without an editor instance', () => {
    const json = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Example Text',
            },
          ],
        },
      ],
    }

    const html = generateHTML(json, [Document, Paragraph, Text])

    expect(html).toBe('<p>Example Text</p>')
  })
})
