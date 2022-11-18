import React, { useEffect } from 'react'
import { getHeatmapConfig, getRocAucConfig } from '@/components/Indicator/utils'
import Card from '@/components/Card'
import useTranslation from '@/hooks/useTranslation'
import BusyPlaceholder from '@/components/BusyLoaderWrapper/BusyPlaceholder'
import { showTableName, tableNameOfSummary, tablesOfEvaluation } from '@/domain/datastore/utils'
import { useJob } from '@/domain/job/hooks/useJob'
import { useListDatastoreTables, useQueryDatastore } from '@/domain/datastore/hooks/useFetchDatastore'
import { useProject } from '@/domain/project/hooks/useProject'
import { useParseConfusionMatrix, useParseRocAuc } from '@/domain/datastore/hooks/useParseDatastore'
import Table from '@/components/Table'
import Editor from '@/components/Editor'
import { Panel } from 'baseui/accordion'
import Accordion from '@/components/Accordion'

const PAGE_TABLE_SIZE = 100

function Summary({ fetch }: any) {
    const [t] = useTranslation()
    const record: Record<string, string> = fetch?.data?.records?.[0] ?? {}

    // if (fetch?.data?.records.length === 0) {
    //     return <BusyPlaceholder type='notfound' />
    // }

    return (
        <div className='mb-20'>
            <Accordion accordion>
                <Panel title={`Summary`} expanded={true}>
                    {fetch?.data?.records.length === 0 && (
                        <BusyPlaceholder type='notfound' style={{ minHeight: '300px' }} />
                    )}
                    <div
                        style={{
                            lineHeight: '32px',
                            fontSize: '14px',
                            gridTemplateColumns: 'minmax(160px, max-content) 1fr',
                            display: 'grid',
                        }}
                    >
                        {Object.keys(record)
                            .sort((a, b) => {
                                if (a === 'id') return -1
                                return a > b ? 1 : -1
                            })
                            .map((label) => (
                                <React.Fragment key={label}>
                                    <div
                                        style={{
                                            color: 'rgba(2,16,43,0.60)',
                                            borderBottom: '1px solid #EEF1F6',
                                        }}
                                    >
                                        {label}
                                    </div>
                                    <div
                                        style={{
                                            borderBottom: '1px solid #EEF1F6',
                                            paddingLeft: '20px',
                                        }}
                                    >
                                        {record[label]}
                                    </div>
                                </React.Fragment>
                            ))}
                    </div>
                </Panel>
            </Accordion>
        </div>
    )
}

function EvaluationViewer({ table, filter }: { table: string; filter?: Record<string, any> }) {
    const query = React.useMemo(
        () => ({
            tableName: table,
            start: 0,
            limit: PAGE_TABLE_SIZE,
            rawResult: true,
            ignoreNonExistingTable: true,
            filter,
        }),
        [table, filter]
    )

    const info = useQueryDatastore(query, true)

    const columns = React.useMemo(() => {
        return info.data?.columnTypes?.map((column) => column.name)?.sort((a) => (a === 'id' ? -1 : 1)) ?? []
    }, [info])
    const data = React.useMemo(() => {
        if (!info.data) return []

        return (
            info.data?.records?.map((item) => {
                return columns.map((k) => item?.[k])
            }) ?? []
        )
    }, [info.data, columns])

    if (info.isFetching) {
        return <BusyPlaceholder />
    }

    if (info.isError) {
        return <BusyPlaceholder type='notfound' />
    }

    if (table.includes('/summary')) return <Summary name={table} fetch={info} />

    return (
        <Card outTitle={showTableName(table)} style={{ padding: '20px', background: '#fff', borderRadius: '12px' }}>
            <React.Suspense fallback={<BusyPlaceholder />}>
                <Table
                    columns={columns}
                    data={data}
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
        </Card>
    )
}

function EvaluationWidgetResults() {
    const { project } = useProject()
    const { job } = useJob()

    const queryAllTables = React.useMemo(() => {
        if (!project?.name || !job?.uuid) return ''
        return {
            prefix: tablesOfEvaluation(project?.name as string, job?.uuid),
        }
    }, [project, job])

    const tables = React.useMemo(() => {
        const names = []
        if (project?.name) names.push(tableNameOfSummary(project?.name as string))

        return [...names]
    }, [project])

    return (
        <div style={{ width: '100%', height: 'auto' }}>
            <div
                style={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(800px, 1fr))',
                    gridGap: '16px',
                }}
            >
                {tables.map((name) => {
                    let filter
                    // if (name.includes('/summary') && job?.uuid)
                    //     filter = {
                    //         operator: 'EQUAL',
                    //         operands: [
                    //             {
                    //                 stringValue: job?.uuid,
                    //             },
                    //             {
                    //                 columnName: 'id',
                    //             },
                    //         ],
                    //     }
                    return <EvaluationViewer table={name} key={name} filter={filter} />
                })}
            </div>
            <Editor />
        </div>
    )
}
export default EvaluationWidgetResults
