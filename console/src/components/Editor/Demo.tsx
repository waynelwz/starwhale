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

function Section(props) {
    return (
        <div>
            - {props.id}
            {props.children}
        </div>
    )
}

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

const Widgets = {
    layout: withWidgetProps(Section),
    dndList: withWidgetProps(LayoutWidget),
    section: withWidgetProps(Section),
    panel: withWidgetProps(Widget),
}

export const WrapedWidgetNode = withWidgetProps(function WidgetNode({ id, path, childWidgets, ...rest }) {
    // todo
    // * onOrderChange
    const { type = '' } = rest.config
    let Node = Widgets['layout']

    if (WidgetFactory.widgetMap.has(type)) {
        Node = (props) => WidgetFactory.createWidget({ type: 'ui:dndList', widgetId: '123', ...props })
    }

    return (
        <Node id={id} path={path}>
            {childWidgets &&
                childWidgets.length > 0 &&
                childWidgets.map((child, i) => (
                    <WrapedWidgetNode key={child.id} id={child.id} path={[...path, i]} childWidgets={child.children} />
                ))}
        </Node>
    )
})

export function WidgetTree() {
    // const tree = useSelector(getTree)
    const { store } = useEditorContext()
    const tree = store((state) => state.tree)

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
