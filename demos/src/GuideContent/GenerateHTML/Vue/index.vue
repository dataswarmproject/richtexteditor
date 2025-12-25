<template>
  <pre><code>{{ output }}</code></pre>
</template>

<script>
// Option 1: Browser + server-side
import Bold from '@inkflow/extension-bold'
// Option 2: Browser-only (lightweight)
// import { generateHTML } from '@inkflow/core'
import Document from '@inkflow/extension-document'
import Paragraph from '@inkflow/extension-paragraph'
import Text from '@inkflow/extension-text'
import { generateHTML } from '@inkflow/html'

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

export default {
  computed: {
    output() {
      return generateHTML(json, [
        Document,
        Paragraph,
        Text,
        Bold,
        // other extensions …
      ])
    },
  },
}
</script>
