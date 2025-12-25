import Bold from '@inkflow/extension-bold'
// Option 2: Browser-only (lightweight)
// import { generateHTML } from '@inkflow/core'
import Document from '@inkflow/extension-document'
import Paragraph from '@inkflow/extension-paragraph'
import Text from '@inkflow/extension-text'
// Option 1: Browser + server-side
import { generateHTML } from '@inkflow/html'
import React, { useMemo } from 'react'

const json = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Example ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'bold',
            },
          ],
          text: 'Text',
        },
      ],
    },
  ],
}

export default () => {
  const output = useMemo(() => {
    return generateHTML(json, [
      Document,
      Paragraph,
      Text,
      Bold,
      // other extensions …
    ])
  }, [])

  return (
    <pre>
      <code>{output}</code>
    </pre>
  )
}
