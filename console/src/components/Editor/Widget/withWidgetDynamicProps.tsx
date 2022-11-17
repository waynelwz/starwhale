import React, { useCallback, useEffect } from 'react'
import useSelector, { getWidget, getWidgetDefaults } from '../hooks/useSelector'
import BaseWidget from './BaseWidget'
import { useEditorContext } from '../context/EditorContextProvider'
import { WidgetRendererProps, WidgetRendererType } from './const'
import { useQueryDatastore } from '@/domain/datastore/hooks/useFetchDatastore'

export default function withWidgetDynamicProps(WrappedWidgetRender: WidgetRendererType) {
    function WrapedPropsWidget(props: any) {
        const { id, type, path, childWidgets } = props
        const { store, eventBus } = useEditorContext()
        const api = store()
        const overrides = useSelector(getWidget(id)) ?? {}

        const handleLayoutOrderChange = useCallback(
            (oldIndex, newIndex) => {
                const paths = ['tree', ...path, 'children']
                api.onLayoutOrderChange(paths, oldIndex, newIndex)
            },
            [api]
        )
        const handleLayoutChildrenChange = useCallback(
            (widget: any, payload: Record<string, any>) => {
                const paths = ['tree', ...path, 'children']
                api.onLayoutChildrenChange(paths, getChildrenPath(paths), widget, payload)
            },
            [api]
        )
        const handleLayoutCurrentChange = useCallback(
            (widget: any, payload: Record<string, any>) => {
                // @FIXME path utils
                const paths = ['tree', ...path]
                console.log(getParentPath(paths))
                api.onLayoutChildrenChange(paths, getParentPath(paths), widget, payload)
            },
            [api]
        )
        console.log('withWidgetDynamicProps', props, overrides)

        // @FIXME show datastore be fetch at here
        // @FIXME refrech setting
        const tableName = overrides?.fieldConfig?.data?.tableName

        const query = React.useMemo(
            () => ({
                tableName,
                start: 0,
                limit: 99999,
                rawResult: true,
                ignoreNonExistingTable: true,
                // filter,
            }),
            [tableName]
        )

        const info = useQueryDatastore(query, false)

        useEffect(() => {
            if (tableName) info.refetch()
        }, [tableName, type])

        return (
            <WrappedWidgetRender
                {...props}
                name={overrides.name}
                data={info?.data}
                optionConfig={overrides.optionConfig}
                onOptionChange={(config) => api.onConfigChange(['widgets', id, 'optionConfig'], config)}
                fieldConfig={overrides.fieldConfig}
                onFieldChange={(config) => api.onConfigChange(['widgets', id, 'fieldConfig'], config)}
                // for layout
                onLayoutOrderChange={handleLayoutOrderChange}
                onLayoutChildrenChange={handleLayoutChildrenChange}
                onLayoutCurrentChange={handleLayoutCurrentChange}
                eventBus={eventBus}
                // for
            />
        )
    }
    return WrapedPropsWidget
}

function getParentPath(paths: any[]) {
    const curr = paths.slice()
    const parentIndex = paths.lastIndexOf('children')
    curr.splice(parentIndex, 1)
    return curr
}

function getChildrenPath(paths: any[]) {
    return [...paths, 'children']
}
