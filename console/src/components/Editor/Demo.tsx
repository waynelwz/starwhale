import Editor from '.'
import React, { useContext, useState } from 'react'
import { useEditorContext } from './context/EditorContextProvider'
import { useStore } from 'zustand'
import { Button } from 'baseui/button'
import LayoutWidget from './widgets/DNDListWidget/component/DNDList'
import useSelector, { getTree } from './hooks/useSelector'
import WidgetFactory from './Widget/WidgetFactory'

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

function withWidgetProps(WrappedWidget: React.Component) {
    return function WrapedPropsWidget(props: any) {
        // todo
        // * add log state
        // * onFieldConfigChange
        const { id } = props
        const { store } = useEditorContext()

        const config = useStore(store, (state) => {
            return state.widgets?.[id]
        })

        console.log('rendered', id, props, config)

        return <WrappedWidget {...props} {...config} />
    }
}

export const WrapedWidgetNode = withWidgetProps(({ id, path, childWidgets, ...rest }) => {
    // todo
    // * onOrderChange
    // const Node = Widgets[rest.type ?? 'layout']
    const { type = '' } = rest
    let Node = Widgets['layout']

    console.log('WrapedWidgetNode', rest, type, WidgetFactory.widgetMap)

    if (WidgetFactory.widgetMap.has(type)) {
        Node = WidgetFactory.createWidget({ type: 'ui:dndList', widgetId: '123' })
        console.log(Node)
    }
    return (
        <Node id={id} path={path}>
            {childWidgets &&
                childWidgets.length > 0 &&
                childWidgets.map((child, i) => (
                    <WrapedWidgetNode id={child.id} path={[...path, i]} childWidgets={child.children} />
                ))}
        </Node>
    )
})

export function WidgetTree() {
    const tree = useSelector(getTree)
    console.log(tree)

    return (
        <div>
            {tree.map((node, i) => (
                <WrapedWidgetNode id={node.id} path={[i]} childWidgets={node.children} />
            ))}
        </div>
    )
}

export default React.memo(function Demo() {
    return <WidgetTree />
})
