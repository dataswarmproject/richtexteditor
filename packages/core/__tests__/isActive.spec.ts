import { Editor } from '@digitaltrendz/core'
import Document from '@digitaltrendz/extension-document'
import Paragraph from '@digitaltrendz/extension-paragraph'
import Text from '@digitaltrendz/extension-text'
import { Color, FontFamily, TextStyle } from '@digitaltrendz/extension-text-style'
import { describe, expect, it } from 'vitest'

describe('isActive', () => {
  it('should check the current node', () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text],
    })

    expect(editor.isActive('paragraph')).toBe(true)
  })

  it('should check non-existent nodes', () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text],
    })

    expect(editor.isActive('doesNotExist')).toBe(false)
  })

  it('should check the current mark for correct values', () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, TextStyle, FontFamily, Color],
      content: `
        <p><span style="font-family: Inter">text</span></p>
      `,
    })

    expect(editor.isActive('textStyle', { fontFamily: 'Inter' })).toBe(true)
  })

  it('should check the current mark for false values', () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, TextStyle, FontFamily, Color],
      content: `
        <p><span style="font-family: Inter; color: red">text</span></p>
      `,
    })

    expect(editor.isActive('textStyle', { fontFamily: 'Comic Sans' })).toBe(false)
  })

  it('should check the current mark for any values', () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, TextStyle, FontFamily],
      content: `
        <p><span style="font-family: Inter; color: red">text</span></p>
      `,
    })

    expect(editor.isActive('textStyle', { fontFamily: /.*/ })).toBe(true)
  })

  it('should check the current mark for correct values (multiple)', () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, TextStyle, FontFamily, Color],
      content: `
        <p><span style="font-family: Inter; color: red">text</span></p>
      `,
    })

    expect(editor.isActive('textStyle', { fontFamily: 'Inter', color: 'red' })).toBe(true)
  })

  it('should check the current mark for false values (multiple)', () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, TextStyle, FontFamily, Color],
      content: `
        <p><span style="font-family: Inter; color: red">text</span></p>
      `,
    })

    expect(editor.isActive('textStyle', { fontFamily: 'Inter', color: 'green' })).toBe(false)
  })
})
