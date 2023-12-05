import React, { useEffect, useState } from 'react'
import useTranslation from '@/hooks/useTranslation'
import _ from 'lodash'
import { ITableState, useEvaluationStore } from '@starwhale/ui/GridTable/store'
import { BusyPlaceholder } from '@starwhale/ui'
import { useLocalStorage } from 'react-use'
import GridCombineTable from '@starwhale/ui/GridTable/GridCombineTable'
import { shallow } from 'zustand/shallow'
import { useDatastoreMixedSchema, useEventCallback } from '@starwhale/core'
import { useDatastoreSummaryColumns } from '@starwhale/ui/GridDatastoreTable/hooks/useDatastoreSummaryColumns'
import RECORDS from './table.json'

const selector = (s: ITableState) => ({
    rowSelectedIds: s.rowSelectedIds,
    currentView: s.currentView,
    initStore: s.initStore,
    getRawConfigs: s.getRawConfigs,
    onCurrentViewIdChange: s.onCurrentViewIdChange,
    getRawIfChangedConfigs: s.getRawIfChangedConfigs,
    setRowSelectedIds: s.setRowSelectedIds,
    onCurrentViewColumnsPin: s.onCurrentViewColumnsPin,
})

export default function EvaluationListCard() {
    const [t] = useTranslation()
    const projectId = '1'
    const viewCurrentKey = 'eval-view-id'

    const store = useEvaluationStore(selector, shallow)
    const [changed, setChanged] = useState(false)
    const { records, columnTypes, columnHints } = useDatastoreMixedSchema(RECORDS.data as any)
    const [defaultViewObj, setDefaultViewObj] = useLocalStorage<Record<string, any>>(viewCurrentKey, {})
    const $columns = useDatastoreSummaryColumns({ projectId, columnTypes, columnHints, hasAction: true })

    const onViewsChange = useEventCallback((state: ITableState, prevState: ITableState) => {
        setChanged(state.currentView.updated ?? false)
        setDefaultViewObj((obj) => {
            return { ...obj, [projectId]: state.currentView.id }
        })
    })

    const onCurrentViewChange = useEventCallback((state: ITableState) => {
        setDefaultViewObj((obj) => {
            return { ...obj, [projectId]: state.currentView.id }
        })
    })

    useEffect(() => {
        store.setRowSelectedIds(['2730d853a5104f66b3336c4e76905415', '77c3d6610fe9427187f8741d49cfc4b4'])
        store.onCurrentViewColumnsPin('sys/id', true)
        store.onCurrentViewColumnsPin('id', true)
    }, [])

    return (
        <GridCombineTable
            // rowActions={getActions}
            title={'Title'}
            titleOfCompare={t('compare.title')}
            store={useEvaluationStore}
            compareable
            columnable
            viewable={false}
            queryable={false}
            selectable
            sortable
            paginationable
            previewable
            records={records}
            columnTypes={columnTypes}
            columnHints={columnHints}
            columns={$columns}
            onViewsChange={onViewsChange}
            onCurrentViewChange={onCurrentViewChange}
            emptyColumnMessage={<BusyPlaceholder type='notfound'>{t('evalution.grid.empty.notice')}</BusyPlaceholder>}
        />
    )
}
