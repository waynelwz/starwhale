import useTranslation from '@/hooks/useTranslation'
import { Modal, ModalBody, ModalHeader } from 'baseui/modal'
import React from 'react'
import { getWidget } from '../hooks/useSelector'
import { WidgetEditForm } from './WidgetForm'
import { WidgetRenderer } from '../Widget/WidgetRenderer'

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
                        flexBasis: '616px',
                        minHeight: '348px',
                        height: 'auto',
                    }}
                >
                    {/* id='ui:section-dkwygaa7ts' */}
                    {type && <WidgetRenderer type={type} />}
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
