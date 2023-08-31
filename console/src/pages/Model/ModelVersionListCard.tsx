import React, { useCallback, useState } from 'react'
import Card from '@/components/Card'
import {
    addModelVersionTag,
    createModelVersion,
    deleteModelVersionTag,
    revertModelVersion,
} from '@model/services/modelVersion'
import { usePage } from '@/hooks/usePage'
import { ICreateModelVersionSchema } from '@model/schemas/modelVersion'
import ModelVersionForm from '@model/components/ModelVersionForm'
import { formatTimestampDateTime } from '@/utils/datetime'
import useTranslation from '@/hooks/useTranslation'
import { Modal, ModalHeader, ModalBody } from 'baseui/modal'
import Table from '@/components/Table'
import { useHistory, useParams } from 'react-router-dom'
import { useFetchModelVersions } from '@model/hooks/useFetchModelVersions'
import { toaster } from 'baseui/toast'
import { ButtonGroup, ExtendButton } from '@starwhale/ui/Button'
import { useAccess, WithCurrentAuth } from '@/api/WithAuth'
import CopyToClipboard from '@/components/CopyToClipboard/CopyToClipboard'
import { TextLink } from '@/components/Link'
import { MonoText } from '@/components/Text'
import useCliMate from '@/hooks/useCliMate'
import { getReadableStorageQuantityStr } from '@starwhale/ui/utils'
import { EditableAlias } from '@/components/Alias'
import Shared from '@/components/Shared'
import { VersionText } from '@starwhale/ui'

export default function ModelVersionListCard() {
    const [page] = usePage()
    const { modelId, projectId } = useParams<{ modelId: string; projectId: string }>()
    const history = useHistory()

    const modelsInfo = useFetchModelVersions(projectId, modelId, page)
    const [isCreateModelVersionOpen, setIsCreateModelVersionOpen] = useState(false)
    const handleCreateModelVersion = useCallback(
        async (data: ICreateModelVersionSchema) => {
            await createModelVersion(projectId, modelId, data)
            await modelsInfo.refetch()
            setIsCreateModelVersionOpen(false)
        },
        [modelsInfo, projectId, modelId]
    )
    const [t] = useTranslation()
    const { hasCliMate, doPull } = useCliMate()
    const tagReadOnly = !useAccess('tag.edit')

    const handleAction = useCallback(
        async (modelVersionId) => {
            await revertModelVersion(projectId, modelId, modelVersionId)
            toaster.positive(t('model version reverted'), { autoHideDuration: 2000 })
            await modelsInfo.refetch()
        },
        [modelsInfo, projectId, modelId, t]
    )

    const handleTagAdd = useCallback(
        async (modelVersionId: string, tag: string) => {
            await addModelVersionTag(projectId, modelId, modelVersionId, tag)
            await modelsInfo.refetch()
        },
        [modelId, modelsInfo, projectId]
    )

    const handelTagRemove = useCallback(
        async (modelVersionId: string, tag: string) => {
            await deleteModelVersionTag(projectId, modelId, modelVersionId, tag)
            await modelsInfo.refetch()
        },
        [modelId, modelsInfo, projectId]
    )

    return (
        <Card title={t('model versions')}>
            <Table
                isLoading={modelsInfo.isLoading}
                columns={[t('Model Version'), t('Alias'), t('Shared'), t('Size'), t('Created'), t('Action')]}
                data={
                    modelsInfo.data?.list.map((model, i) => {
                        return [
                            <TextLink
                                key={modelId}
                                to={`/projects/${projectId}/models/${modelId}/versions/${model.id}/overview`}
                            >
                                <VersionText version={model.name} />
                            </TextLink>,
                            <EditableAlias
                                key='alias'
                                readOnly={tagReadOnly}
                                resource={model}
                                onAddTag={(tag) => handleTagAdd(model.id, tag)}
                                onRemoveTag={(tag) => handelTagRemove(model.id, tag)}
                            />,
                            <Shared key='shared' shared={model.shared} isTextShow />,
                            model.size && getReadableStorageQuantityStr(Number(model.size)),
                            model.createdTime && formatTimestampDateTime(model.createdTime),
                            <ButtonGroup key='action'>
                                <CopyToClipboard
                                    content={`${window.location.protocol}//${window.location.host}/projects/${projectId}/models/${modelId}/versions/${model.id}/`}
                                />
                                <WithCurrentAuth id='online-eval'>
                                    {(isPrivileged: boolean, isCommunity: boolean) => {
                                        if (!isPrivileged) return null
                                        if (!isCommunity)
                                            return (
                                                <ExtendButton
                                                    tooltip={t('online eval')}
                                                    icon='a-onlineevaluation'
                                                    as='link'
                                                    onClick={() =>
                                                        history.push(
                                                            `/projects/${projectId}/new_job/?modelId=${model.id}&modelVersionHandler=serving`
                                                        )
                                                    }
                                                />
                                            )

                                        return (
                                            <ExtendButton
                                                tooltip={t('online eval')}
                                                icon='a-onlineevaluation'
                                                as='link'
                                                onClick={() =>
                                                    history.push(`/projects/${projectId}/online_eval/${model.id}`)
                                                }
                                            />
                                        )
                                    }}
                                </WithCurrentAuth>
                                {i ? (
                                    <WithCurrentAuth id='model.version.revert'>
                                        <ExtendButton
                                            tooltip={t('Revert')}
                                            icon='revert'
                                            as='link'
                                            onClick={() => handleAction(model.id)}
                                        />
                                    </WithCurrentAuth>
                                ) : null}
                                {hasCliMate && (
                                    <ExtendButton
                                        tooltip={t('Pull resource to local with cli mate')}
                                        icon='a-Pushlocal'
                                        as='link'
                                        onClick={() => {
                                            const url = `projects/${projectId}/models/${modelId}/versions/${model.id}/`
                                            doPull({ resourceUri: url })
                                        }}
                                    />
                                )}
                            </ButtonGroup>,
                        ]
                    }) ?? []
                }
                paginationProps={{
                    start: modelsInfo.data?.pageNum,
                    count: modelsInfo.data?.pageSize,
                    total: modelsInfo.data?.total,
                    afterPageChange: () => {
                        modelsInfo.refetch()
                    },
                }}
            />
            <Modal
                isOpen={isCreateModelVersionOpen}
                onClose={() => setIsCreateModelVersionOpen(false)}
                closeable
                animate
                autoFocus
            >
                <ModalHeader>{t('create sth', [t('Model Version')])}</ModalHeader>
                <ModalBody>
                    <ModelVersionForm onSubmit={handleCreateModelVersion} />
                </ModalBody>
            </Modal>
        </Card>
    )
}
