import React, { useEffect, useMemo } from 'react'
import EditorContextProvider from './context/EditorContextProvider'
import { registerWidgets } from './Widget/WidgetFactoryRegister'
import log from 'loglevel'
import WidgetFactory from './Widget/WidgetFactory'
import { generateId } from './utils/generators'
import { createCustomStore } from './context/store'
import WidgetRenderTree from './Widget/WidgetRenderTree'

// log.enableAll()

export function withEditorRegister(EditorApp: React.FC) {
    return function EditorLoader(props: any) {
        const [registred, setRegistred] = React.useState(false)

        useEffect(() => {
            registerWidgets().then((module) => {
                setRegistred(true)
            })
        }, [])

        if (!registred) {
            return <>registring</>
        }
        log.debug('WidgetFactory', WidgetFactory.widgetMap)

        return <EditorApp {...props} />
    }
}

export function witEditorContext(EditorApp: React.FC, rawState: typeof initialState) {
    return function EditorContexted(props: any) {
        const state = useMemo(() => tranformState(rawState), [])
        const value = useMemo(() => {
            const store = createCustomStore(state)
            log.debug('store', state)
            return {
                store,
            }
        }, [state])

        return (
            <EditorContextProvider value={value}>
                <EditorApp {...props} />
            </EditorContextProvider>
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

const Editor = withEditorRegister(witEditorContext(WidgetRenderTree, initialState))

export default Editor
