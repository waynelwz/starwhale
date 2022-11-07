import React from 'react'
import EditorContextProvider from './EditorContext'

export default function Editor({ children }) {
    // init store
    // registry widgets by factory, + api
    // registry root context
    // registry widget context ?
    return <EditorContextProvider>{children}</EditorContextProvider>
}
