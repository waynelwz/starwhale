import React from 'react'
import EditorContextProvider from './context/EditorContextProvider'
import Demo from './Demo'
import { registerWidgets } from './Widget/WidgetRegisterHelpers'
import log from 'loglevel'
import WidgetFactory from './Widget/WidgetFactory'

export function EditorLoader() {
    const [registred, setRegistred] = React.useState(false)
    // init store
    // registry widgets by factory, + api
    // registry root context
    // registry widget context ?
    registerWidgets().then((module) => {
        setRegistred(true)
    })

    if (!registred) {
        return <>registring</>
    }

    console.log('WidgetFactory', WidgetFactory.widgetMap)

    return <Demo />
}

export function witEditorContext(EditorApp: React.FC) {
    return function EditorContexted(props: any) {
        return (
            <EditorContextProvider>
                <EditorApp {...props} />
            </EditorContextProvider>
        )
    }
}

const Editor = witEditorContext(EditorLoader)

export default Editor
