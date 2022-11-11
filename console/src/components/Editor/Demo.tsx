import React, { useContext, useState } from 'react'
import { useEditorContext } from './context/EditorContextProvider'
import { useStore } from 'zustand'
import { Button } from 'baseui/button'
import LayoutWidget from './widgets/DNDListWidget/component/DNDList'
import useSelector, { getTree, getWidget } from './hooks/useSelector'
import WidgetFactory from './Widget/WidgetFactory'
import withWidgetProps from './Widget/withWidgetProps'
import Editor from '.'
import { defaultsDeep, isEqual } from 'lodash'
import deepEqual from 'fast-deep-equal'
import { useWidget } from './Widget/WidgetFactoryRegister'
import { WidgetRenderer } from './Widget/WidgetRenderer'

function Widget(props) {
    const { store } = useEditorContext()
    const a = useStore(store, (state) => state.a)
    console.log('Widget props', props, a)

    return (
        <div>
            - {props.name}
            <Button
                onClick={() =>
                    store.setState({
                        a: a + 1,
                    })
                }
            >
                {a}
            </Button>
            {props.children}
        </div>
    )
}

export const WrapedWidgetNode = withWidgetProps(function WidgetNode({ id, path, childWidgets, ...rest }) {
    // todo
    // * onOrderChange
    const { type = '' } = rest.config

    return (
        <WidgetRenderer id={id} path={path} type={type}>
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

export function WidgetTree() {
    // const tree = useSelector(getTree)
    const { store } = useEditorContext()
    // console.log(store)
    const api = store()
    const tree = store((state) => state.tree, deepEqual)

    console.log('tree', tree)

    return (
        <div>
            {tree.map((node, i) => (
                <WrapedWidgetNode key={node.id} id={node.id} path={[i]} childWidgets={node.children} />
            ))}
        </div>
    )
}

export default React.memo(function Demo() {
    return <WidgetTree />
})
