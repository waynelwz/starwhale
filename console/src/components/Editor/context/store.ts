import create, { createStore, useStore } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'

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
    // widgets:
}

export function createCustomStore(initState: Partial<WidgetStoreState> = {}) {
    // if (initialized) return initialized
    console.log('store init')
    const name = `widgets`
    const useStore = create<WidgetStoreState>()(
        devtools(
            (...a) => ({
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
            }),
            { name }
        )
    )
    // eslint-disable-next-line
    // useStore.subscribe(console.log)
    // TODO type define
    // @ts-ignore
    // initialized = useStore
    return useStore
}
export default {
    createCustomStore,
}
