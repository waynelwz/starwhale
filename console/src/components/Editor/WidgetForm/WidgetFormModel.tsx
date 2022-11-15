import useTranslation from '@/hooks/useTranslation'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'baseui/modal'
import React, { useEffect } from 'react'
import { getWidget } from '../hooks/useSelector'
import { WidgetRenderer } from '../Widget/WidgetRenderer'
import { useQueryDatastore } from '@/domain/datastore/hooks/useFetchDatastore'
import { Button } from '@/components/Button'
import WidgetEditForm from './WidgetForm'

export default function WidgetFormModel({ store }) {
    // @FIXME use event bus handle global state
    const [t] = useTranslation()
    const [isPanelModalOpen, setisPanelModalOpen] = React.useState(true)
    const [editWidgetId, setEditWidgetId] = React.useState('')
    const config = store(getWidget(editWidgetId)) ?? {}
    const [formData, setFormData] = React.useState({})

    const handleFormChange = (formData) => {
        console.log('handleFormChange', formData)
        setFormData(formData)
    }

    const handleFormSubmit = ({ formData }) => {
        console.log('handleFormSubmit', formData)
    }

    const type = formData?.chartType
    const tableName = Array.isArray(formData?.tableName) ? formData?.tableName[0] : formData?.tableName
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

    const info = useQueryDatastore(query, false)

    useEffect(() => {
        if (tableName) info.refetch()
    }, [tableName, type])

    console.log(query, info)

    const formRef = React.useRef(null)

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
                    // ref={formRef}
                    formData={formData}
                    onChange={handleFormChange}
                    onSubmit={handleFormSubmit}

                    // onSubmit={editProject ? handleEditProject : handleCreateProject}
                />
            </ModalBody>
            <ModalFooter>
                <div style={{ display: 'flex' }}>
                    <div style={{ flexGrow: 1 }} />
                    <Button
                        size='compact'
                        kind='secondary'
                        onClick={() => {
                            setisPanelModalOpen(false)
                        }}
                    >
                        {t('Cancel')}
                    </Button>
                    &nbsp;&nbsp;
                    <Button
                        size='compact'
                        onClick={() => {
                            // formRef.current?.onSubmit()
                            // setisPanelModalOpen(false)
                        }}
                    >
                        Submit
                    </Button>
                </div>
            </ModalFooter>
        </Modal>
    )
}
