import create, { createStore, useStore } from 'zustand'
import { devtools, subscribeWithSelector, persist } from 'zustand/middleware'
import produce from 'immer'
import { arrayMove, arrayRemove } from 'react-movable'
import _ from 'lodash'
import { generateId } from '../utils/generators'
import WidgetFactory from '../Widget/WidgetFactory'

export type WidgetType = string

export type LayoutWidget = ''
export type WidgetLayoutType = {
    dndList: 'dndList'
}

export type WidgetTreeNode = {
    id?: string
    type: string
    children?: WidgetTreeNode[]
}
export type WidgetStoreState = {
    key: string
    tree: WidgetTreeNode[]
    widgets: Record<string, any>
    defaults: Record<string, any>
    onOrderChange: any
    onConfigChange: any
    onChildrenAdd: any
}

const transformWidget = (node) => {
    // console.log(node)
    if (!node?.id) node.id = generateId(node.type)
    const defaultConfig = WidgetFactory.widgetConfigMap.get(node.type) ?? {}
    const config = WidgetFactory.widgetConfigMap.get(node.type) ?? {}
    return {
        node,
        defaultConfig,
        config,
    }
}

export function createCustomStore(initState: Partial<WidgetStoreState> = {}) {
    console.log('store init')
    const name = `widgets`
    const useStore = create<WidgetStoreState>()(
        subscribeWithSelector(
            devtools(
                persist(
                    (set, get, store) => ({
                        key: name,
                        ...(initState as any),
                        onOrderChange: (paths, oldIndex, newIndex) =>
                            set(
                                produce((state) => {
                                    const nodes = _.get(get(), paths)
                                    console.log(get(), nodes, paths)
                                    const ordered =
                                        newIndex === -1
                                            ? arrayRemove(nodes, oldIndex)
                                            : arrayMove(nodes, oldIndex, newIndex)
                                    _.set(state, paths, ordered)
                                })
                            ),
                        onConfigChange: (id: string, config: any) =>
                            set(
                                produce((state) => {
                                    state.widgets[id] = config
                                })
                            ),
                        onChildrenAdd: (paths, widgets) =>
                            set(
                                produce((state) => {
                                    const nodes = _.get(get(), paths)
                                    const { node, defaultConfig, config } = transformWidget(widgets)
                                    _.set(state, paths, [...nodes, widgets])
                                    state.widgets[node.id] = config
                                    state.defaults[node.id] = defaultConfig
                                })
                            ),
                    }),
                    { name: initState.key }
                ),
                { name: initState.key }
            )
        )
    )
    // eslint-disable-next-line
    // useStore.subscribe(console.log)
    // @ts-ignore
    return useStore
}
export default {
    createCustomStore,
}
