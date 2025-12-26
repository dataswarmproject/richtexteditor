<template>
  <editor-content :editor="editor" />
</template>

<script>
import Document from '@digitaltrendz/extension-document'
import Text from '@digitaltrendz/extension-text'
import { Editor, EditorContent } from '@digitaltrendz/vue-3'

import Paper from './Paper.js'

export default {
  components: {
    EditorContent,
  },

  data() {
    return {
      editor: null,
    }
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        Document.extend({
          content: 'paper',
        }),
        Text,
        Paper,
      ],
    })
  },

  beforeUnmount() {
    this.editor.destroy()
  },
}
</script>
