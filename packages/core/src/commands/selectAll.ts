import { AllSelection } from '@inkflow/pm/state'

import type { RawCommands } from '../types.js'

declare module '@inkflow/core' {
  interface Commands<ReturnType> {
    selectAll: {
      /**
       * Select the whole document.
       * @example editor.commands.selectAll()
       */
      selectAll: () => ReturnType
    }
  }
}

export const selectAll: RawCommands['selectAll'] =
  () =>
  ({ tr, dispatch }) => {
    if (dispatch) {
      const selection = new AllSelection(tr.doc)

      tr.setSelection(selection)
    }

    return true
  }
