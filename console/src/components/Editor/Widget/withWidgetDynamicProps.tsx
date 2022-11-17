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

        const handleOrderChange = useCallback(
            (oldIndex, newIndex) => {
                const paths = ['tree', ...path, 'children']
                api.onOrderChange(paths, oldIndex, newIndex)
            },
            [api]
        )
        const handleChildrenAdd = useCallback(
            (widget: any) => {
                const paths = ['tree', ...path, 'children']
                api.onChildrenAdd(paths, widget)
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
                onOrderChange={handleOrderChange}
                onChildrenAdd={handleChildrenAdd}
                eventBus={eventBus}
                // for
            />
        )
    }
    return WrapedPropsWidget
}
