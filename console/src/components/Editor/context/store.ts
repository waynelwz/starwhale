// @ts-nocheck
import create, { createStore, useStore } from 'zustand'
import { devtools, subscribeWithSelector, persist } from 'zustand/middleware'
import produce from 'immer'
import { arrayMove, arrayRemove } from 'react-movable'
import _ from 'lodash'

export type WidgetType = string

export type LayoutWidget = ''
export type WidgetLayoutType = {
    dndList: 'dndList'
}

export type WidgetTreeNode = {
    id: string
    children?: WidgetTreeNode[]
}
export type WidgetStoreState = {
    key: string
    tree: WidgetTreeNode[]
    widgets: Record<string, any>
    defaults: Record<string, any>
    onOrderChange: any
    onConfigChange: any
    // widgets:
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
                        ...initState,
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
