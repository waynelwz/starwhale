import React, { useContext, useState } from 'react'
import { useEditorContext } from '../context/EditorContextProvider'
import withWidgetProps from '../Widget/withWidgetProps'
import deepEqual from 'fast-deep-equal'
import { WidgetRenderer } from '../Widget/WidgetRenderer'

export const WrapedWidgetNode = withWidgetProps(function WidgetNode(props: any) {
    const { type, childWidgets, path } = props
    return (
        <WidgetRenderer {...props}>
            {childWidgets &&
                childWidgets.length > 0 &&
                childWidgets.map((child, i) => (
                    <WrapedWidgetNode
                        key={child.id}
                        id={child.id}
                        path={[...path, 'children', i]}
                        childWidgets={child.children}
                    />
                ))}
        </WidgetRenderer>
    )
})

export function WidgetRenderTree() {
    const { store } = useEditorContext()
    const tree = store((state) => state.tree, deepEqual)
    console.log('tree', tree)

    return (
        <div>
            {tree.map((node, i) => (
                <WrapedWidgetNode key={node.id} id={node.id} type={node.type} path={[i]} childWidgets={node.children} />
            ))}
        </div>
    )
}

export default WidgetRenderTree
