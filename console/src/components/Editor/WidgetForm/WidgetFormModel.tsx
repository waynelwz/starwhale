import useTranslation from '@/hooks/useTranslation'
import { Modal, ModalBody, ModalHeader } from 'baseui/modal'
import React from 'react'
import { getWidget } from '../hooks/useSelector'
import { WidgetEditForm } from './WidgetForm'
import { WidgetRenderer } from '../Widget/WidgetRenderer'
import { useQueryDatastore } from '@/domain/datastore/hooks/useFetchDatastore'

export default function WidgetFormModel({ store }) {
    // @FIXME use event bus handle global state
    const [t] = useTranslation()
    const [isPanelModalOpen, setisPanelModalOpen] = React.useState(true)
    const [editWidgetId, setEditWidgetId] = React.useState('')
    const config = store(getWidget(editWidgetId)) ?? {}
    const [formData, setFormData] = React.useState({})

    const handleFormChange = (formData) => {
        console.log(formData)
        setFormData(formData)
    }

    const type = formData?.chartType
    const tableName = formData?.tableName
    const filter = undefined
    const PAGE_TABLE_SIZE = 100

    const query = React.useMemo(
        () => ({
            tableName,
            start: 0,
            limit: PAGE_TABLE_SIZE,
            rawResult: true,
            ignoreNonExistingTable: true,
            // filter,
        }),
        [tableName]
    )

    const info = useQueryDatastore(query, true)
    console.log(query, info)

    return (
        <Modal
            isOpen={isPanelModalOpen}
            // onClose={() => setisPanelModalOpen(false)}
            closeable
            animate
            autoFocus
            overrides={{
                Dialog: {
                    style: {
                        width: '90vw',
                        maxWidth: '1080px',
                        display: 'flex',
                        flexDirection: 'column',
                    },
                },
            }}
        >
            <ModalHeader>
                Add Panel
                {/* {editProject ? t('edit sth', [t('Project')]) : t('create sth', [t('Project')])} */}
            </ModalHeader>
            <ModalBody style={{ display: 'flex', gap: '30px' }}>
                <div
                    style={{
                        flexBasis: '600px',
                        flexGrow: '1',
                        minHeight: '348px',
                        height: 'auto',
                        overflow: 'auto',
                    }}
                >
                    {type && <WidgetRenderer type={type} data={info.data} />}
                </div>
                <WidgetEditForm
                    formData={formData}
                    onChange={handleFormChange}
                    // onSubmit={editProject ? handleEditProject : handleCreateProject}
                />
            </ModalBody>
        </Modal>
    )
}
