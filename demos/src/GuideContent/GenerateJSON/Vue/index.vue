<template>
  <pre><code>{{ output }}</code></pre>
</template>

<script>
// Option 1: Browser + server-side
import Bold from '@digitaltrendz/extension-bold'
// Option 2: Browser-only (lightweight)
// import { generateJSON } from '@digitaltrendz/core'
import Document from '@digitaltrendz/extension-document'
import Paragraph from '@digitaltrendz/extension-paragraph'
import Text from '@digitaltrendz/extension-text'
import { generateJSON } from '@digitaltrendz/html'

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
