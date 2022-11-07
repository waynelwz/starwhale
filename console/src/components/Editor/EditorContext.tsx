import { createContext, useContext, useMemo } from 'react'
import { createCustomStore } from './store'

export type IEditorContext = {
    store: typeof store
}
const EditorContext = createContext<IEditorContext>({})

const store = createCustomStore({})

export const useEditorContext = () => useContext(EditorContext)

export default function EditorContextProvider({ children }) {
    const value = useMemo(
        () => ({
            store,
        }),
        []
    )
    console.log('---', store, value)
    return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}
