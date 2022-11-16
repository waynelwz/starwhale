import BusyPlaceholder from '@/components/BusyLoaderWrapper/BusyPlaceholder'
import React, { useCallback, useState } from 'react'
import { WidgetProps, WidgetRendererProps } from '../../Widget/const'
import WidgetPlugin from '../../Widget/WidgetPlugin'
import PanelTable from './component/Table'
import { WidgetConfig, WidgetProps, WidgetRendererProps } from '../../Widget/const'

export const CONFIG: WidgetConfig = {
    type: 'ui:panel:table',
    group: 'panel',
    name: 'table',
}

function PanelTableWidget(props: WidgetRendererProps<PanelTableProps, any>) {
    console.log('PanelTableWidget', props)

    const { defaults, config, children, data } = props
    const { columnTypes = {}, records = [] } = data
    const name = config?.name ?? defaults?.name

    const columns = React.useMemo(() => {
        return columnTypes?.map((column) => column.name)?.sort((a) => (a === 'id' ? -1 : 1)) ?? []
    }, [columnTypes])

    const data = React.useMemo(() => {
        if (!records) return []

        return (
            records?.map((item) => {
                return columns.map((k) => item?.[k])
            }) ?? []
        )
    }, [records, columns])

    return <PanelTable columns={columns} data={data} />
}

const widget = new WidgetPlugin(PanelTableWidget, CONFIG)

export default widget
