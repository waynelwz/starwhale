import React, { Context } from 'react'
import { createContext, useContext, useMemo } from 'react'
import { createCustomStore } from './store'

export type EditorContextType = {
    store: typeof store
}
type EditorContextProviderProps = {
    children: React.ReactNode
}
export const store = createCustomStore({})

export const EditorContext: Context<EditorContextType> = createContext({
    store,
})

export const useEditorContext = () => useContext(EditorContext)

export default function EditorContextProvider({ children }: EditorContextProviderProps) {
    const value = useMemo(
        () => ({
            store,
        }),
        []
    )
    return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}
