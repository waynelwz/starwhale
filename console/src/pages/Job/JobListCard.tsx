import React, { useCallback, useState } from 'react'
import Card from '@/components/Card'
import { createJob, doJobAction, pinJob } from '@job/services/job'
import { usePage } from '@/hooks/usePage'
import { ICreateJobSchema, JobActionType, JobStatusType } from '@job/schemas/job'
import JobForm from '@job/components/JobForm'
import { durationToStr, formatTimestampDateTime } from '@/utils/datetime'
import useTranslation from '@/hooks/useTranslation'
import User from '@/domain/user/components/User'
import { Modal, ModalHeader, ModalBody } from 'baseui/modal'
import Table from '@/components/Table/index'
import { useHistory, useParams } from 'react-router-dom'
import { useFetchJobs } from '@job/hooks/useFetchJobs'
import { toaster } from 'baseui/toast'
import { TextLink } from '@/components/Link'
import { MonoText } from '@/components/Text'
import JobStatus from '@/domain/job/components/JobStatus'
import Button from '@starwhale/ui/Button'
import { useAuthPrivileged, WithCurrentAuth } from '@/api/WithAuth'
import { IconTooltip } from '@starwhale/ui/Tooltip'
import IconFont from '@starwhale/ui/IconFont'
import { useProjectRole } from '@project/hooks/useProjectRole'
import { ConfigurationOverride } from '@starwhale/ui/base/helpers/overrides'

export default function JobListCard() {
    const [t] = useTranslation()
    const history = useHistory()
    const [page] = usePage()
    const { projectId } = useParams<{ projectId: string }>()
    const jobsInfo = useFetchJobs(projectId, page)
    const [isCreateJobOpen, setIsCreateJobOpen] = useState(false)
    const { isPrivileged: canPinOrUnpin } = useAuthPrivileged({ role: useProjectRole().role, id: 'job.pinOrUnpin' })

    const handleCreateJob = useCallback(
        async (data: ICreateJobSchema) => {
            await createJob(projectId, data)
            setIsCreateJobOpen(false)
            jobsInfo.refetch()
        },
        [jobsInfo, projectId]
    )
    const handleAction = useCallback(
        async (jobId, type: JobActionType) => {
            await doJobAction(projectId, jobId, type)
            toaster.positive(t('job action done'), { autoHideDuration: 2000 })
            setIsCreateJobOpen(false)
            jobsInfo.refetch()
        },
        [jobsInfo, projectId, t]
    )

    const handlePin = useCallback(
        async (jobId, pinned) => {
            if (!canPinOrUnpin) return
            await pinJob(projectId, jobId, pinned)
            jobsInfo.refetch()
        },
        [canPinOrUnpin, jobsInfo, projectId]
    )

    return (
        <>
            <Card
                title={t('Jobs')}
                extra={
                    <WithCurrentAuth id='evaluation.create'>
                        <Button
                            onClick={() => {
                                history.push('new_job')
                            }}
                            isLoading={jobsInfo.isLoading}
                        >
                            {t('create')}
                        </Button>
                    </WithCurrentAuth>
                }
            >
                <Table
                    isLoading={jobsInfo.isLoading}
                    columns={[
                        <div key='jobid' style={{ paddingLeft: '12px' }}>
                            {t('Job ID')}
                        </div>,
                        t('Resource Pool'),
                        t('sth name', [t('Model')]),
                        t('Version'),
                        t('Owner'),
                        t('Created'),
                        t('Elapsed Time'),
                        t('End Time'),
                        t('Status'),
                        t('Action'),
                    ]}
                    data={
                        jobsInfo.data?.list.map((job) => {
                            const actions: Partial<Record<JobStatusType, React.ReactNode>> = {
                                [JobStatusType.CREATED]: (
                                    <>
                                        <Button
                                            kind='tertiary'
                                            onClick={() => handleAction(job.id, JobActionType.CANCEL)}
                                        >
                                            {t('Cancel')}
                                        </Button>
                                        <WithCurrentAuth id='job-pause'>
                                            <Button
                                                kind='tertiary'
                                                onClick={() => handleAction(job.id, JobActionType.PAUSE)}
                                            >
                                                {t('Pause')}
                                            </Button>
                                        </WithCurrentAuth>
                                    </>
                                ),
                                [JobStatusType.RUNNING]: (
                                    <>
                                        <Button
                                            kind='tertiary'
                                            onClick={() => handleAction(job.id, JobActionType.CANCEL)}
                                        >
                                            {t('Cancel')}
                                        </Button>
                                        <WithCurrentAuth id='job-pause'>
                                            <Button
                                                kind='tertiary'
                                                onClick={() => handleAction(job.id, JobActionType.PAUSE)}
                                            >
                                                {t('Pause')}
                                            </Button>
                                        </WithCurrentAuth>
                                    </>
                                ),
                                [JobStatusType.PAUSED]: (
                                    <>
                                        <Button
                                            kind='tertiary'
                                            onClick={() => handleAction(job.id, JobActionType.CANCEL)}
                                        >
                                            {t('Cancel')}
                                        </Button>
                                        <WithCurrentAuth id='job-resume'>
                                            <Button
                                                kind='tertiary'
                                                onClick={() => handleAction(job.id, JobActionType.RESUME)}
                                            >
                                                {t('Resume')}
                                            </Button>
                                        </WithCurrentAuth>
                                    </>
                                ),
                                [JobStatusType.FAIL]: (
                                    <>
                                        <WithCurrentAuth id='job-resume'>
                                            <Button
                                                kind='tertiary'
                                                onClick={() => handleAction(job.id, JobActionType.RESUME)}
                                            >
                                                {t('Resume')}
                                            </Button>
                                        </WithCurrentAuth>
                                    </>
                                ),
                            }

                            const pinBtnStyle: ConfigurationOverride = {
                                'position': 'absolute',
                                'top': 0,
                                'bottom': 0,
                                'left': '-8px',
                                'display': job.pinnedTime ? 'block' : 'none',
                                '& .iconfont': {
                                    color: '#666',
                                },
                            }
                            if (canPinOrUnpin) {
                                pinBtnStyle[':hover .iconfont'] = {
                                    color: '#FFB23D !important',
                                }
                                pinBtnStyle[':active .iconfont'] = {
                                    color: '#F29200  !important',
                                }
                            }

                            return [
                                <div key='id' style={{ gap: '8px', position: 'relative', paddingLeft: '12px' }}>
                                    <Button
                                        key='pin'
                                        as='link'
                                        onClick={() => handlePin(job.id, !job.pinnedTime)}
                                        overrides={{
                                            BaseButton: {
                                                props: {
                                                    className: 'pin-button',
                                                },
                                                style: pinBtnStyle,
                                            },
                                        }}
                                    >
                                        {(canPinOrUnpin || job.pinnedTime) && (
                                            <IconTooltip
                                                content={
                                                    // eslint-disable-next-line no-nested-ternary
                                                    canPinOrUnpin
                                                        ? job.pinnedTime
                                                            ? t('job.unpin')
                                                            : t('job.pin')
                                                        : null
                                                }
                                                icon='top'
                                            />
                                        )}
                                    </Button>
                                    <TextLink key={job.id} to={`/projects/${projectId}/jobs/${job.id}/actions`}>
                                        <MonoText>{job.id}</MonoText>
                                    </TextLink>
                                </div>,
                                job.resourcePool,
                                job.modelName,
                                <MonoText key='modelVersion'>{job.modelVersion}</MonoText>,
                                job.owner && <User user={job.owner} />,
                                job?.createdTime && job?.createdTime > 0 && formatTimestampDateTime(job?.createdTime),
                                typeof job.duration === 'string' ? '-' : durationToStr(job.duration),
                                job?.stopTime && job?.stopTime > 0 ? formatTimestampDateTime(job?.stopTime) : '-',
                                <JobStatus key='jobStatus' status={job.jobStatus as any} />,
                                <div key='action' style={{ display: 'flex', gap: '8px' }}>
                                    <Button
                                        kind='tertiary'
                                        onClick={() => history.push(`/projects/${projectId}/jobs/${job.id}/tasks`)}
                                    >
                                        {t('View Tasks')}
                                    </Button>
                                    {actions[job.jobStatus] ?? ''}
                                    {job.exposedLinks?.map((link) => {
                                        return (
                                            <a
                                                key={link}
                                                target='_blank'
                                                href={link}
                                                rel='noreferrer'
                                                title={t('job.expose.title')}
                                            >
                                                <IconFont type='global' size={16} />
                                            </a>
                                        )
                                    })}
                                </div>,
                            ]
                        }) ?? []
                    }
                    paginationProps={{
                        start: jobsInfo.data?.pageNum,
                        count: jobsInfo.data?.pageSize,
                        total: jobsInfo.data?.total,
                        afterPageChange: () => {
                            jobsInfo.refetch()
                        },
                    }}
                />
                <Modal isOpen={isCreateJobOpen} onClose={() => setIsCreateJobOpen(false)} closeable animate autoFocus>
                    <ModalHeader>{t('create sth', [t('Job')])}</ModalHeader>
                    <ModalBody>
                        <JobForm onSubmit={handleCreateJob} />
                    </ModalBody>
                </Modal>
            </Card>
        </>
    )
}
