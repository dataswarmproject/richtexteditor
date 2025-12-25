import { selectParentNode as originalSelectParentNode } from '@inkflow/pm/commands'

import type { RawCommands } from '../types.js'

declare module '@inkflow/core' {
  interface Commands<ReturnType> {
    selectParentNode: {
      /**
       * Select the parent node.
       * @example editor.commands.selectParentNode()
       */
      selectParentNode: () => ReturnType
    }
  }
}

export const selectParentNode: RawCommands['selectParentNode'] =
  () =>
  ({ state, dispatch }) => {
    return originalSelectParentNode(state, dispatch)
  }
