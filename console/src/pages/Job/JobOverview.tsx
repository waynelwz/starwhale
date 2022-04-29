import React, { useCallback, useMemo, useState } from 'react'
import useTranslation from '@/hooks/useTranslation'
import { useJob, useJobLoading } from '@job/hooks/useJob'
import TaskListCard from './TaskListCard'
import { durationToStr, formatTimestampDateTime } from '@/utils/datetime'
import Card from '@/components/Card'
import { ScrollFollow, LazyLog } from 'react-lazylog'
import { Accordion, Panel } from 'baseui/accordion'
import { Grid, Cell } from 'baseui/layout-grid'
import useWebSocket from '../../hooks/useWebSocket'
import { useQuery } from 'react-query'
import { fetchTaskOfflineFileLog, fetchTaskOfflineLogFiles } from '@/domain/job/services/task'
import { ITaskSchema, TaskStatusType } from '../../domain/job/schemas/task'
import { getToken } from '@/api'

export default function JobOverview() {
    const { job } = useJob()
    const [t] = useTranslation()

    const items = [
        {
            label: t('Job ID'),
            value: job?.id ?? '',
        },
        {
            label: t('Owner'),
            value: job?.owner?.name ?? '-',
        },
        {
            label: t('Run time'),
            value: job?.stopTime && job?.stopTime > 0 ? formatTimestampDateTime(job?.stopTime) : '-',
        },
        {
            label: t('Created time'),
            value: job?.createTime && formatTimestampDateTime(job.createTime),
        },
        ,
        {
            label: t('End time'),
            value: job?.createTime && formatTimestampDateTime(job.createTime),
        },
    ]

    const [currentTask, setCurrentTask] = useState<ITaskSchema | undefined>(undefined)
    const [expanded, setExpanded] = useState(false)
    const [currentLogContent, setCurrentLogContent] = useState('')
    const onAction = useCallback(async (type, task: ITaskSchema) => {
        setCurrentTask(task)
        if ([TaskStatusType.SUCCESS, TaskStatusType.SUCCESS].includes(task.taskStatus)) {
            const data = await fetchTaskOfflineLogFiles(task?.id)
            const content = await fetchTaskOfflineFileLog(task?.id, data[0])
            console.log(content)
            setCurrentLogContent(content)
        }
        setExpanded(true)
    }, [])

    const currentOnlineLogUrl = useMemo(() => {
        return `${window.location.protocol === 'http:' ? 'ws:' : 'wss:'}//${
            //   window.location.host
            'console.pre.intra.starwhale.ai'
        }/api/v1/log/online/${currentTask?.id}?Authorization=${getToken()}`
    }, [currentTask, currentTask?.id])

    useWebSocket({
        debug: true,
        wsUrl: currentOnlineLogUrl,
        onMessage: (e) => {
            console.log('self', e)
        },
    })

    return (
        <>
            <div
                style={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 380px',
                    gridGap: '16px',
                }}
            >
                <div style={{ gridColumnStart: 'span 2' }}>
                    <TaskListCard header={null} onAction={onAction} />

                    <Accordion
                        overrides={{
                            Content: {
                                style: {
                                    height: '800px',
                                    paddingBottom: '20px',
                                },
                            },
                        }}
                        onChange={({ expanded }) => {
                            setExpanded(expanded.includes('0'))
                        }}
                    >
                        <Panel
                            title={`Logs ${currentTask?.uuid ? ':' + currentTask.uuid : ''}`}
                            expanded={expanded ? true : undefined}
                        >
                            <ScrollFollow
                                startFollowing
                                render={({ follow }) => {
                                    if (currentLogContent) {
                                        return (
                                            <LazyLog
                                                enableSearch
                                                selectableLines
                                                text={currentLogContent || ''}
                                                follow={follow}
                                                // scrollToLine={scrollToLine}
                                                // onScroll={handleScroll}
                                            />
                                        )
                                    }
                                    return (
                                        <LazyLog
                                            enableSearch
                                            selectableLines
                                            url={currentOnlineLogUrl}
                                            websocket
                                            websocketOptions={{
                                                formatMessage: (e): any => {
                                                    const msg = JSON.parse(e) as any
                                                    console.log(msg)
                                                    return e
                                                },
                                            }}
                                            follow={follow}
                                            // onScroll={handleScroll}
                                        />
                                    )
                                }}
                            />
                        </Panel>
                    </Accordion>
                </div>

                <Card
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
                        gap: '12px',
                        fontSize: '16px',
                    }}
                >
                    {items.map((v) => (
                        <div key={v?.label} style={{ display: 'flex' }}>
                            <div style={{ flexBasis: '130px' }}>{v?.label}</div>
                            <div>: {v?.value}</div>
                        </div>
                    ))}
                </Card>
            </div>
        </>
    )
}
