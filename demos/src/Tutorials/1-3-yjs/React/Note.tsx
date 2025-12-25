import { Collaboration } from '@inkflow/extension-collaboration'
import { EditorContent, useEditor } from '@inkflow/react'
import { StarterKit } from '@inkflow/starter-kit'
import React from 'react'
import * as Y from 'yjs'

import type { TNote } from './types.js'

export default ({ note }: { note: TNote }) => {
  const doc = new Y.Doc()

  const editor = useEditor({
    content: note.defaultContent,
    editorProps: {
      attributes: {
        class: 'textarea',
      },
    },
    extensions: [
      StarterKit.configure({
        history: false, // important because history will now be handled by Y.js
      }),
      Collaboration.configure({
        document: doc,
      }),
    ],
  })

  return (
    // @ts-ignore
    <EditorContent editor={editor} />
  )
}
