import './styles.scss'

import Code from '@inkflow/extension-code'
import CodeBlock from '@inkflow/extension-code-block'
import Document from '@inkflow/extension-document'
import { BulletList, ListItem } from '@inkflow/extension-list'
import Paragraph from '@inkflow/extension-paragraph'
import Text from '@inkflow/extension-text'
import { TrailingNode } from '@inkflow/extensions'
import { EditorContent, useEditor } from '@inkflow/react'
import React from 'react'

export default () => {
  const editor = useEditor({
    extensions: [Document, Paragraph, Text, TrailingNode, Code, BulletList, ListItem, CodeBlock],
    content: `
        <p>A paragraph</p>
        <pre><code>There should be a paragraph right after this one, because it is a code-block</code></pre>
      `,
  })

  return <EditorContent editor={editor} />
}
