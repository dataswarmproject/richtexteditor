import './styles.scss'

import Code from '@inkflow/extension-code'
import Document from '@inkflow/extension-document'
import { BulletList, ListItem } from '@inkflow/extension-list'
import Paragraph from '@inkflow/extension-paragraph'
import Text from '@inkflow/extension-text'
import { Selection } from '@inkflow/extensions'
import { EditorContent, useEditor } from '@inkflow/react'
import React from 'react'

export default () => {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Selection.configure({
        className: 'selection',
      }),
      Code,
      BulletList,
      ListItem,
    ],
    content: `
        <p>
          The selection extension adds a class to the selection when the editor is blurred. That enables you to visually preserve the selection even though the editor is blurred. By default, it’ll add <code>.selection</code> classname.
        </p>
      `,

    onCreate: ctx => {
      ctx.editor.commands.setTextSelection({ from: 5, to: 30 })
    },
  })

  return <EditorContent editor={editor} />
}
