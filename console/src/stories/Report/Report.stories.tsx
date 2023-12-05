import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { config } from '@storybook/addon-designs'

import TiptapEditor, { SaveStatus } from '@starwhale/ui/TiptapEditor'
import API from './report.json'
import useTranslation from '@/hooks/useTranslation'

type Story = StoryObj<typeof TiptapEditor>

const meta: Meta<typeof TiptapEditor> = {
    title: 'Editor/Report',
    component: TiptapEditor,
    argTypes: {},
    parameters: {
        // layout: 'fullscreen',
    },
}

export default meta

export const Primary = {
    parameters: {},
    render: (args) => {
        const [readonly, setReadonly] = React.useState(false)
        const [content, setContent] = React.useState('')
        const [status, setStatus] = React.useState(SaveStatus.SAVED)
        const [t] = useTranslation()

        const statusT = {
            [SaveStatus.SAVED]: t('report.save.saved'),
            [SaveStatus.SAVING]: t('report.save.saving'),
            [SaveStatus.UNSAVED]: t('report.save.unsaved'),
        }

        return (
            <div className='min-h-800px py-20px w-full'>
                <TiptapEditor
                    id={'1'}
                    initialContent={API}
                    onContentChange={(tmp: string) => setContent(tmp)}
                    editable={!readonly}
                    onSaveStatusChange={(tmp: SaveStatus) => setStatus(tmp)}
                />{' '}
            </div>
        )
    },
}
