import type { ReactNodeViewProps } from '@inkflow/react'
import { NodeViewWrapper } from '@inkflow/react'
import React from 'react'

export default (props: ReactNodeViewProps<HTMLLabelElement>) => {
  const increase = () => {
    props.updateAttributes({
      count: props.node.attrs.count + 1,
    })
  }

  return (
    <NodeViewWrapper className="react-component">
      <label ref={props.ref}>React Component</label>

      <div className="content">
        <button onClick={increase}>This button has been clicked {props.node.attrs.count} times.</button>
      </div>
    </NodeViewWrapper>
  )
}
