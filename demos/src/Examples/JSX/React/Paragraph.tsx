/** @jsxImportSource @tiptap/core */
import { mergeAttributes } from '@digitaltrendz/core'
import { Paragraph as BaseParagraph } from '@digitaltrendz/extension-paragraph'

export const Paragraph = BaseParagraph.extend({
  renderHTML({ HTMLAttributes }) {
    return (
      <p {...mergeAttributes(HTMLAttributes, { style: 'color: red' })}>
        <slot />
      </p>
    )
  },
})
