import './styles.scss'

import Code from '@digitaltrendz/extension-code'
import CodeBlock from '@digitaltrendz/extension-code-block'
import Document from '@digitaltrendz/extension-document'
import { BulletList, ListItem } from '@digitaltrendz/extension-list'
import Paragraph from '@digitaltrendz/extension-paragraph'
import Text from '@digitaltrendz/extension-text'
import { TrailingNode } from '@digitaltrendz/extensions'
import { EditorContent, useEditor } from '@digitaltrendz/react'
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
