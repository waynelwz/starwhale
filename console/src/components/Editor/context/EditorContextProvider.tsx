import React, { Context } from 'react'
import { createContext, useContext, useMemo } from 'react'
import { createCustomStore } from './store'

export type EditorContextType = {
    store: ReturnType<typeof createCustomStore>
}
type EditorContextProviderProps = {
    value: any
    children: React.ReactNode
}

export const EditorContext: Context<EditorContextType> = createContext({} as EditorContextType)

export const useEditorContext = () => useContext(EditorContext)

export default function EditorContextProvider({ children, value }: EditorContextProviderProps) {
    return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}
