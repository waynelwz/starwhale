import React, { useEffect, useMemo } from 'react'
import EditorContextProvider from './context/EditorContextProvider'
import Demo from './Demo'
import { registerWidgets } from './Widget/WidgetFactoryRegister'
import log from 'loglevel'
import WidgetFactory from './Widget/WidgetFactory'
import { generateId } from './utils/generators'
import { createCustomStore } from './context/store'

export function EditorLoader(props: any) {
    const [registred, setRegistred] = React.useState(false)

    useEffect(() => {
        registerWidgets().then((module) => {
            setRegistred(true)
        })
    }, [])
    console.log('WidgetFactory', WidgetFactory.widgetMap)

    if (!registred) {
        return <>registring</>
    }

    return props.children
}

export function witEditorContext(EditorApp: React.FC, initialState = {}) {
    return function EditorContexted(props: any) {
        const state = useMemo(() => tranformState(initialState), [])
        const value = useMemo(() => {
            const store = createCustomStore(state)
            console.log('store', state)
            return {
                store,
            }
        }, [state])

        return (
            <EditorLoader>
                <EditorContextProvider value={value}>
                    <EditorApp {...props} />
                </EditorContextProvider>
            </EditorLoader>
        )
    }
}

const initialState = {
    key: 'widgets',
    tree: [
        {
            type: 'ui:dndList',
            children: [
                {
                    type: 'ui:section',
                    children: [
                        {
                            type: 'ui:dndList',
                            children: [{ type: 'panel-1' }],
                        },
                    ],
                },
                {
                    type: 'ui:section',
                    children: [
                        {
                            type: 'layout-2',
                            children: [{ type: 'panel-2' }],
                        },
                    ],
                },
            ],
        },
    ],
    widgets: {},
    defaults: {},
}
const tranformState = (state: typeof initialState) => {
    const defaults = {}
    const widgets = {}

    function walk(nodes) {
        return nodes.map((node) => {
            // console.log(node)
            if (!node.id) node.id = generateId(node.type)
            if (node.children) node.children = walk(node.children)
            defaults[node.type] = WidgetFactory.widgetConfigMap.get(node.type) ?? {}
            widgets[node.id] = WidgetFactory.widgetConfigMap.get(node.type) ?? {}
            return node
        })
    }
    const newTree = walk(Object.assign([], state.tree))
    console.log(newTree, defaults, widgets)
    return {
        key: state.key,
        tree: newTree,
        defaults,
        widgets,
    }
}

const Editor = witEditorContext(Demo, initialState)

export default Editor
