import BusyPlaceholder from '@/components/BusyLoaderWrapper/BusyPlaceholder'
import React, { useCallback, useState } from 'react'
import { WidgetProps, WidgetRendererProps } from '../../Widget/const'
import WidgetPlugin from '../../Widget/WidgetPlugin'
import PanelTable from './component/Table'

export const CONFIG = {
    type: 'ui:panel:table',
    group: 'panel',
    name: 'table',
}

function PanelTableWidget(props: WidgetRendererProps<PanelTableProps, any>) {
    console.log('PanelTableWidget', props)

    const { defaults, config, children, data = {} } = props
    const { columnTypes = [], records = [] } = data
    const name = config?.name ?? defaults?.name

    const columns = React.useMemo(() => {
        return columnTypes.map((column) => column.name)?.sort((a) => (a === 'id' ? -1 : 1)) ?? []
    }, [columnTypes])

    const $data = React.useMemo(() => {
        if (!records) return []

        return (
            records.map((item) => {
                return columns.map((k) => item?.[k])
            }) ?? []
        )
    }, [records, columns])

    console.log(columns, data)

    return (
        <React.Suspense fallback={<BusyPlaceholder />}>
            <PanelTable
                columns={columns}
                data={$data}
                // paginationProps={{
                //     start: modelsInfo.data?.pageNum,
                //     count: modelsInfo.data?.pageSize,
                //     total: modelsInfo.data?.total,
                //     afterPageChange: () => {
                //         info.refetch()
                //     },
                // }}
            />
        </React.Suspense>
    )
}

const widget = new WidgetPlugin<PanelTableProps, any>(PanelTableWidget)

export default widget
