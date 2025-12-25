import { Extension } from '@inkflow/core'
import { Plugin } from '@inkflow/pm/state'

import findColors from './findColors.js'

export const ColorHighlighter = Extension.create({
  name: 'colorHighlighter',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        state: {
          init(_, { doc }) {
            return findColors(doc)
          },
          apply(transaction, oldState) {
            return transaction.docChanged ? findColors(transaction.doc) : oldState
          },
        },
        props: {
          decorations(state) {
            return this.getState(state)
          },
        },
      }),
    ]
  },
})
