import { NodeSelection } from '@inkflow/pm/state'

export function isNodeSelection(value: unknown): value is NodeSelection {
  return value instanceof NodeSelection
}
