// @ts-nocheck
import create, { createStore, useStore } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
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
    onOrderChange: any
    // widgets:
}

export function createCustomStore(initState: Partial<WidgetStoreState> = {}) {
    console.log('store init')
    const name = `widgets`
    const useStore = create<WidgetStoreState>()(
        subscribeWithSelector(
            devtools(
                (set, get, store) => ({
                    key: name,
                    tree: [
                        {
                            id: 'layout-1',
                            children: [
                                {
                                    id: 'section-1',
                                    children: [
                                        {
                                            id: 'layout-2',
                                            children: [{ id: 'panel-1' }],
                                        },
                                    ],
                                },
                                {
                                    id: 'section-2',
                                    children: [
                                        {
                                            id: 'layout-2',
                                            children: [{ id: 'panel-2' }],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    widgets: {
                        'layout-1': {
                            name: 'layout-1',
                            type: 'ui:dndList',
                        },
                        'section-2': {
                            name: 'section-2',
                            type: 'section',
                        },
                        'section-1': {
                            name: 'section-1',
                            type: 'section',
                        },
                        'panel-1': {
                            name: 'panel-1',
                            type: 'panel',
                        },
                    },
                    a: 0,
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
                                console.log(paths, nodes, ordered)
                            })
                        ),
                }),
                { name }
            )
        )
    )
    // eslint-disable-next-line
    useStore.subscribe(console.log)
    // @ts-ignore
    return useStore
}
export default {
    createCustomStore,
}
