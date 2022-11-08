import { useStore } from 'zustand'
import { useEditorContext } from '../context/EditorContextProvider'
import { WidgetStoreState } from '../context/store'

export const getTree = (state: WidgetStoreState) => state.tree
export const getWidget = (id: string) => (state: WidgetStoreState) => state.widgets?.[id]

export default function useSelector(selector) {
    const { store } = useEditorContext()
    return useStore(store, selector)
}

// : ReturnType<typeof selector>
