/** @jsxImportSource @tiptap/core */
import { mergeAttributes } from '@inkflow/core'
import { Paragraph as BaseParagraph } from '@inkflow/extension-paragraph'

export const Paragraph = BaseParagraph.extend({
  renderHTML({ HTMLAttributes }) {
    return (
      <p {...mergeAttributes(HTMLAttributes, { style: 'color: red' })}>
        <slot />
      </p>
    )
  },
})
