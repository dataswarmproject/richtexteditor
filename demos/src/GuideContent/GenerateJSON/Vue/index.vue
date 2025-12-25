<template>
  <pre><code>{{ output }}</code></pre>
</template>

<script>
// Option 1: Browser + server-side
import Bold from '@inkflow/extension-bold'
// Option 2: Browser-only (lightweight)
// import { generateJSON } from '@inkflow/core'
import Document from '@inkflow/extension-document'
import Paragraph from '@inkflow/extension-paragraph'
import Text from '@inkflow/extension-text'
import { generateJSON } from '@inkflow/html'

const html = '<p>Example <strong>Text</strong></p>'

export default {
  computed: {
    output() {
      return generateJSON(html, [
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
