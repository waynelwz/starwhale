import React, { useCallback, useMemo, useState } from 'react'
import Card from '@/components/Card'
import { createJob } from '@job/services/job'
import { ICreateJobSchema } from '@job/schemas/job'
import JobForm from '@job/components/JobForm'
import { durationToStr, formatTimestampDateTime } from '@/utils/datetime'
import useTranslation from '@/hooks/useTranslation'
import { Modal, ModalHeader, ModalBody } from 'baseui/modal'
import { useHistory, useParams, Prompt } from 'react-router-dom'
import { CustomColumn } from '@starwhale/ui/base/data-table'
import _ from 'lodash'
import { ITableState, useEvaluationStore } from '@starwhale/ui/GridTable/store'
import { useFetchViewConfig } from '@/domain/evaluation/hooks/useFetchViewConfig'
import { setEvaluationViewConfig } from '@/domain/evaluation/services/evaluation'
import useFetchDatastoreByTable from '@starwhale/core/datastore/hooks/useFetchDatastoreByTable'
import { tableNameOfSummary } from '@starwhale/core/datastore/utils'
import { TextLink } from '@/components/Link'
import { WithCurrentAuth } from '@/api/WithAuth'
import { useDatastoreColumns } from '@starwhale/ui/GridDatastoreTable'
import { toaster } from 'baseui/toast'
import { BusyPlaceholder, Button } from '@starwhale/ui'
import { useLocalStorage } from 'react-use'
import { useProject } from '@project/hooks/useProject'
import JobStatus from '@/domain/job/components/JobStatus'
import { GridResizerVertical } from '@starwhale/ui/AutoResizer/GridResizerVertical'
import EvaluationListResult from './EvaluationListResult'
import GridCombineTable from '@starwhale/ui/GridTable/GridCombineTable'
import { val } from '@starwhale/ui/GridTable/utils'
import shallow from 'zustand/shallow'

const selector = (s: ITableState) => ({
    rowSelectedIds: s.rowSelectedIds,
    currentView: s.currentView,
    initStore: s.initStore,
    getRawConfigs: s.getRawConfigs,
    onCurrentViewIdChange: s.onCurrentViewIdChange,
    getRawIfChangedConfigs: s.getRawIfChangedConfigs,
})

export default function EvaluationListCard() {
    const [t] = useTranslation()
    const history = useHistory()
    const { projectId: projectFromUri } = useParams<{ projectId: string }>()
    const { project } = useProject()
    const projectId = project?.id || projectFromUri
    const summaryTableName = React.useMemo(() => {
        return tableNameOfSummary(projectId)
    }, [projectId])
    const { rowSelectedIds, currentView, initStore, getRawConfigs, getRawIfChangedConfigs } = useEvaluationStore(
        selector,
        shallow
    )

    const options = React.useMemo(() => {
        const sorts = currentView?.sortBy
            ? [
                  {
                      columnName: currentView?.sortBy,
                      descending: currentView?.sortDirection === 'DESC',
                  },
              ]
            : []

        sorts.push({
            columnName: 'sys/id',
            descending: true,
        })

        return {
            pageNum: 1,
            pageSize: 1000,
            query: {
                orderBy: sorts,
            },
            filter: currentView.queries,
        }
    }, [currentView.queries, currentView.sortBy, currentView.sortDirection])

    const {
        recordInfo: evaluationsInfo,
        columnTypes,
        records,
    } = useFetchDatastoreByTable(summaryTableName, options, true)
    const evaluationViewConfig = useFetchViewConfig(projectId, 'evaluation')
    const [isCreateJobOpen, setIsCreateJobOpen] = useState(false)
    const [viewId, setViewId] = useLocalStorage<string>('currentViewId', '')
    const [changed, setChanged] = useState(false)
    const handleCreateJob = useCallback(
        async (data: ICreateJobSchema) => {
            await createJob(projectId, data)
            await evaluationsInfo.refetch()
            setIsCreateJobOpen(false)
        },
        [evaluationsInfo, projectId]
    )

    const $columns = useDatastoreColumns(columnTypes as any)

    const $columnsWithSpecColumns = useMemo(() => {
        return $columns.map((column) => {
            if (column.key === 'sys/id')
                return CustomColumn({
                    ...column,
                    key: column.key,
                    title: column.key,
                    fillWidth: false,
                    mapDataToValue: (data: any) => _.get(data, [column.key, 'value'], 0),
                    // @ts-ignore
                    renderCell: ({ value: id }) => {
                        if (!id) return <></>
                        return (
                            <TextLink key={id} to={`/projects/${projectId}/evaluations/${id}/results`}>
                                {id}
                            </TextLink>
                        )
                    },
                })
            if (column.key === 'sys/duration')
                return CustomColumn({
                    ...column,
                    key: 'duration',
                    title: t('Elapsed Time'),
                    sortable: true,
                    filterType: 'number',
                    fillWidth: false,
                    sortFn: (a: any, b: any) => {
                        const aNum = Number(a)
                        const bNum = Number(b)
                        if (Number.isNaN(aNum)) {
                            return -1
                        }
                        return aNum - bNum
                    },
                    // @ts-ignore
                    renderCell: ({ value }) => <p title={value}>{durationToStr(value)}</p>,
                    mapDataToValue: (data: any): number => _.get(data, [column.key, 'value'], 0),
                })
            if (column.key === 'sys/job_status')
                return CustomColumn({
                    ...column,
                    key: column.key,
                    title: column.key,
                    sortable: true,
                    fillWidth: false,
                    // @ts-ignore
                    renderCell: ({ value }) => (
                        <div title={value}>
                            <JobStatus status={value} />
                        </div>
                    ),
                    mapDataToValue: (data: any): string => _.get(data, [column.key, 'value'], ''),
                })
            if (column.key?.endsWith('time')) {
                return CustomColumn({
                    ...column,
                    key: column.key,
                    title: column.key,
                    fillWidth: false,
                    // @ts-ignore
                    renderCell: ({ value }) => {
                        return <span title={value}>{formatTimestampDateTime(value)}</span>
                    },
                    mapDataToValue: (data: any) => _.get(data, [column.key, 'value'], 0),
                })
            }
            return {
                ...column,
                fillWidth: false,
            }
        })
    }, [t, $columns, projectId])

    const $ready = React.useMemo(() => {
        return evaluationViewConfig.isSuccess
    }, [evaluationViewConfig.isSuccess])

    React.useEffect(() => {
        const unloadCallback = (event: any) => {
            if (!changed) return ''
            event.preventDefault()
            // eslint-disable-next-line no-param-reassign
            event.returnValue = 'Some browsers display this to the user'
            return ''
        }

        window.addEventListener('beforeunload', unloadCallback)
        return () => {
            window.removeEventListener('beforeunload', unloadCallback)
        }
    }, [changed])

    const doSave = React.useCallback(() => {
        setEvaluationViewConfig(projectId, {
            name: 'evaluation',
            content: JSON.stringify(getRawIfChangedConfigs(), null),
        }).then(() => {
            toaster.positive(t('evaluation.save.success'), {})
        })
    }, [projectId, t, getRawIfChangedConfigs])

    const onViewsChange = React.useCallback(
        (state: ITableState, prevState: ITableState) => {
            // console.log('onViewsChange', state)
            setChanged(state.currentView.updated ?? false)
            setViewId(state.currentView.id)
            if (!_.isEqual(state.views, prevState.views)) {
                setEvaluationViewConfig(projectId, {
                    name: 'evaluation',
                    content: JSON.stringify(
                        {
                            ...getRawIfChangedConfigs(),
                            views: state.views,
                        },
                        null
                    ),
                })
            }
        },
        [projectId, setViewId, getRawIfChangedConfigs]
    )

    // NOTICE: use isinit to make sure view config is loading into store
    const initRef = React.useRef(false)
    React.useEffect(() => {
        if (!evaluationViewConfig.isSuccess) return
        if (initRef.current) return

        let $rawConfig
        try {
            $rawConfig = JSON.parse(evaluationViewConfig.data?.content, undefined) ?? {}
        } catch (e) {
            // console.log(e)
        }
        // eslint-disable-next-line no-console
        console.log('init store', getRawConfigs(), $rawConfig)
        initStore({
            ...getRawConfigs(),
            ...$rawConfig,
        })

        initRef.current = true
        // store should not be used as a deps, it's will trigger cycle render
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [evaluationViewConfig.isSuccess, evaluationViewConfig.data?.content, viewId])

    const $compareRows = React.useMemo(() => {
        return records?.filter((r) => rowSelectedIds.includes(val(r.id))) ?? []
    }, [rowSelectedIds, records])

    if (!$ready)
        return (
            <Card
                title={t('Evaluations')}
                style={{
                    flexShrink: 1,
                    marginBottom: 0,
                    width: '100%',
                    flex: 1,
                }}
                extra={
                    <WithCurrentAuth id='evaluation.create'>
                        <Button onClick={() => history.push('new_job')}>{t('create')}</Button>
                    </WithCurrentAuth>
                }
            >
                <BusyPlaceholder />
            </Card>
        )
    return (
        <Card
            title={t('Evaluations')}
            style={{
                flexShrink: 1,
                marginBottom: 0,
                width: '100%',
                flex: 1,
            }}
            bodyStyle={{
                flexDirection: 'column',
            }}
            extra={
                <WithCurrentAuth id='evaluation.create'>
                    <Button onClick={() => history.push('new_job')}>{t('create')}</Button>
                </WithCurrentAuth>
            }
        >
            <Prompt when={changed} message='If you leave this page, your changes will be discarded.' />
            <GridResizerVertical
                top={() => (
                    <GridCombineTable
                        title={t('evaluation.title')}
                        titleOfCompare={t('compare.title')}
                        store={useEvaluationStore}
                        compareable
                        columnable
                        viewable
                        queryable
                        selectable
                        records={records}
                        columnTypes={columnTypes}
                        columns={$columnsWithSpecColumns}
                        onSave={doSave}
                        onViewsChange={onViewsChange}
                    />
                )}
                isResizeable={$compareRows.length > 0}
                initGridMode={2}
                bottom={() => <EvaluationListResult rows={$compareRows} />}
            />
            <Modal isOpen={isCreateJobOpen} onClose={() => setIsCreateJobOpen(false)} closeable animate autoFocus>
                <ModalHeader>{t('create sth', [t('Job')])}</ModalHeader>
                <ModalBody>
                    <JobForm onSubmit={handleCreateJob} />
                </ModalBody>
            </Modal>
        </Card>
    )
}
