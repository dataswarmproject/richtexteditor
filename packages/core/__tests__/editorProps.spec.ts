import { Editor } from '@digitaltrendz/core'
import Document from '@digitaltrendz/extension-document'
import Paragraph from '@digitaltrendz/extension-paragraph'
import Text from '@digitaltrendz/extension-text'
import { describe, expect, it } from 'vitest'

describe('editorProps', () => {
  it('editorProps can be set while constructing Editor', () => {
    function transformPastedHTML(html: string) {
      return html
    }

    const editor = new Editor({
      extensions: [Document, Paragraph, Text],
      editorProps: { transformPastedHTML },
    })

    expect(transformPastedHTML).toBe(editor.view.props.transformPastedHTML)
  })

  it('editorProps can be set through setOptions', () => {
    function transformPastedHTML(html: string) {
      return html
    }

    const editor = new Editor({
      extensions: [Document, Paragraph, Text],
    })

    editor.setOptions({ editorProps: { transformPastedHTML } })

    expect(transformPastedHTML).toBe(editor.view.props.transformPastedHTML)
  })
})
