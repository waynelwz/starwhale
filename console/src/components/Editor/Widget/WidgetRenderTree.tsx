import React, { useContext, useState } from 'react'
import { useEditorContext } from '../context/EditorContextProvider'
import withWidgetProps from '../Widget/withWidgetProps'
import deepEqual from 'fast-deep-equal'
import { WidgetRenderer } from '../Widget/WidgetRenderer'
import { Modal, ModalBody, ModalHeader } from 'baseui/modal'
import useTranslation from '@/hooks/useTranslation'
import useSelector, { getWidget } from '../hooks/useSelector'
import WidgetFormModel from '../WidgetForm/WidgetFormModel'

export const WrapedWidgetNode = withWidgetProps(function WidgetNode(props: any) {
    const { childWidgets, path } = props
    return (
        <WidgetRenderer {...props}>
            {childWidgets &&
                childWidgets.length > 0 &&
                childWidgets.map(({ childChildren, ...childRest }, i) => (
                    <WrapedWidgetNode path={[...path, 'children', i]} childWidgets={childChildren} {...childRest} />
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
            <WidgetFormModel store={store} />
        </div>
    )
}

export default WidgetRenderTree
