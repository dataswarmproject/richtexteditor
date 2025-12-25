import { getSchemaByResolvedExtensions, getTextContentFromNodes } from '@inkflow/core'
import Document from '@inkflow/extension-document'
import Mention from '@inkflow/extension-mention'
import Paragraph from '@inkflow/extension-paragraph'
import Text from '@inkflow/extension-text'
import { Node } from '@inkflow/pm/model'
import { describe, expect, it } from 'vitest'

describe(getTextContentFromNodes.name, () => {
  it('gets text', () => {
    const schema = getSchemaByResolvedExtensions([
      Document,
      Paragraph,
      Text,
      Mention.configure({ renderText: ({ node }) => `@${node.attrs.label ?? 'Unknown'}` }),
    ])

    const doc = Node.fromJSON(schema, {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Start ' },
            { type: 'mention', attrs: { id: 1, label: 'Mention' } },
            { type: 'text', text: ' End' },
          ],
        },
      ],
    })

    const pos = doc.resolve(12)

    const text = getTextContentFromNodes(pos)

    expect(text).toBe('Start @Mention End')
  })
})
