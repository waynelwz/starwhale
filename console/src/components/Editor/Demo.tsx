import Editor from '.'
import React, { useContext, useState } from 'react'
import { useEditorContext } from './EditorContext'
import { useStore } from 'zustand'
import { Button } from 'baseui/button'
import LayoutWidget from './LayoutWidget'

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

        // console.log('rendered', id, config)

        return <WrappedWidget {...props} {...config} />
    }
}

export const WrapedWidgetNode = withWidgetProps(({ id, path, childWidgets, ...rest }) => {
    // todo
    // * onOrderChange
    const Node = Widgets[rest.type ?? 'layout']
    console.log('WidgetNode', rest)
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
    const { store } = useEditorContext()
    const tree = useStore(store, (state) => state.tree)
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
    return (
        <Editor>
            <WidgetTree />
        </Editor>
    )
})
