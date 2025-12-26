import Bold from '@digitaltrendz/extension-bold'
// Option 2: Browser-only (lightweight)
// import { generateHTML } from '@digitaltrendz/core'
import Document from '@digitaltrendz/extension-document'
import Paragraph from '@digitaltrendz/extension-paragraph'
import Text from '@digitaltrendz/extension-text'
// Option 1: Browser + server-side
import { generateHTML } from '@digitaltrendz/html'
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
