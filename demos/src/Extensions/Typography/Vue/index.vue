<template>
  <editor-content :editor="editor" />
</template>

<script>
import Document from '@inkflow/extension-document'
import Paragraph from '@inkflow/extension-paragraph'
import Text from '@inkflow/extension-text'
import Typography from '@inkflow/extension-typography'
import { Editor, EditorContent } from '@inkflow/vue-3'

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
      extensions: [Document, Paragraph, Text, Typography],
      content: `
        <p>“I have been suffering from Typomania all my life, a sickness that is incurable but not lethal.”</p>
        <p>— Erik Spiekermann, December 2008</p>
      `,
    })
  },

  beforeUnmount() {
    this.editor.destroy()
  },
}
</script>

<style lang="scss">
/* Basic editor styles */
.tiptap {
  :first-child {
    margin-top: 0;
  }
}
</style>
