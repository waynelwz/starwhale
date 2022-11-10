import React, { Context } from 'react'
import { createContext, useContext, useMemo } from 'react'
import { createCustomStore } from './store'

export type EditorContextType = {
    store: ReturnType<typeof createCustomStore>
}
type EditorContextProviderProps = {
    children: React.ReactNode
}

export const EditorContext: Context<EditorContextType> = createContext({} as EditorContextType)

export const useEditorContext = () => useContext(EditorContext)

export default function EditorContextProvider({ children, value }: EditorContextProviderProps) {
    // const value = useMemo(() => {
    //     const store = createCustomStore({})
    //     return {
    //         store,
    //     }
    // }, [])
    return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}
