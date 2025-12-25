<script setup lang="ts">
import StarterKit from '@inkflow/starter-kit'
import { EditorContent, useEditor } from '@inkflow/vue-3'
import { ref, watch } from 'vue'

import type { TNote } from './types.js'

const props = defineProps<{ note: TNote }>()

const modelValueProxy = ref('')

watch(props, () => (modelValueProxy.value = props.note.content))

const editor = useEditor({
  content: props.note.content,
  editorProps: {
    attributes: {
      class: 'textarea',
    },
  },
  extensions: [StarterKit],
})
</script>

<template>
  <editor-content :editor="editor" />
</template>
