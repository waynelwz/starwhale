import React, { useCallback } from 'react'
import useSelector, { getWidget, getWidgetDefaults } from '../hooks/useSelector'
import BaseWidget from './BaseWidget'
import { useEditorContext } from '../context/EditorContextProvider'

export default function withWidgetProps(WrappedWidget: typeof BaseWidget) {
    function WrapedPropsWidget(props: any) {
        const { id, type, path, childWidgets } = props
        const { store } = useEditorContext()
        const api = store()
        const config = useSelector(getWidget(id)) ?? {}
        const defaults = useSelector(getWidgetDefaults(type)) ?? {}

        const handleConfigChange = useCallback(
            (config) => {
                console.log('config change', id, config)
                api.onConfigChange(id, config)
            },
            [api, id]
        )
        const handleOrderChange = useCallback(
            (oldIndex, newIndex) => {
                const paths = ['tree', ...path, 'children']
                api.onOrderChange(paths, oldIndex, newIndex)
            },
            [api]
        )

        console.log('WrapedPropsWidget', props, config)

        return (
            <WrappedWidget
                {...props}
                defaults={defaults}
                config={config}
                onConfigChange={handleConfigChange}
                onOrderChange={handleOrderChange}
            />
        )
    }
    return WrapedPropsWidget
}
