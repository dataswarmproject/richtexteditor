import './styles.scss'

import Code from '@digitaltrendz/extension-code'
import Document from '@digitaltrendz/extension-document'
import { BulletList, ListItem } from '@digitaltrendz/extension-list'
import Paragraph from '@digitaltrendz/extension-paragraph'
import Text from '@digitaltrendz/extension-text'
import { Selection } from '@digitaltrendz/extensions'
import { EditorContent, useEditor } from '@digitaltrendz/react'
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
