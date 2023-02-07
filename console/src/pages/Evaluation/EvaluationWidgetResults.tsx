import React from 'react'
import Card from '@/components/Card'
import BusyPlaceholder from '@starwhale/ui/BusyLoaderWrapper/BusyPlaceholder'
import { showTableName, tableNameOfSummary } from '@starwhale/core/datastore/utils'
import { useQueryDatastore } from '@starwhale/core/datastore/hooks/useFetchDatastore'
import { useProject } from '@/domain/project/hooks/useProject'
import Table from '@/components/Table'
import { Panel } from 'baseui/accordion'
import Accordion from '@starwhale/ui/Accordion'
import { QueryTableRequest } from '@starwhale/core/datastore'
import { FullTablesEditor } from '@/components/Editor/FullTablesEditor'
import { useParams } from 'react-router-dom'

const PAGE_TABLE_SIZE = 100

function Summary({ fetch }: any) {
    const record: Record<string, string> = fetch?.data?.records?.[0] ?? {}

    return (
        <div className='mb-20'>
            <Accordion accordion>
                <Panel title='Summary'>
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
                            .filter((label) => typeof record[label] !== 'object')
                            .map((label) => {
                                return (
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
                                )
                            })}
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

    const info = useQueryDatastore(query as QueryTableRequest)

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
                <Table columns={columns} data={data} />
            </React.Suspense>
        </Card>
    )
}

function EvaluationWidgetResults() {
    const { jobId } = useParams<{ jobId: string; projectId: string }>()
    const { project } = useProject()

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
                    if (name.includes('/summary') && jobId)
                        filter = {
                            operator: 'EQUAL',
                            operands: [
                                {
                                    stringValue: jobId,
                                },
                                {
                                    columnName: 'id',
                                },
                            ],
                        }
                    return <EvaluationViewer table={name} key={name} filter={filter} />
                })}
            </div>
            <FullTablesEditor />
        </div>
    )
}
export default EvaluationWidgetResults
