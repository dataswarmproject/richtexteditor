import { deleteSelection as originalDeleteSelection } from '@inkflow/pm/commands'

import type { RawCommands } from '../types.js'

declare module '@inkflow/core' {
  interface Commands<ReturnType> {
    deleteSelection: {
      /**
       * Delete the selection, if there is one.
       * @example editor.commands.deleteSelection()
       */
      deleteSelection: () => ReturnType
    }
  }
}

export const deleteSelection: RawCommands['deleteSelection'] =
  () =>
  ({ state, dispatch }) => {
    return originalDeleteSelection(state, dispatch)
  }
