import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
// import API from './table.json'
import SETTINGS from './panel-settings.json'
import useTranslation from '@/hooks/useTranslation'
import FullTablesEditor from '@/components/Editor/FullTablesEditor'
import { tryParseSimplified } from '@/domain/panel/utils'
import { WidgetRenderTree, withDefaultWidgets } from '@starwhale/core/widget'
import { withEditorContext } from '@/components/Editor/Editor'

type Story = StoryObj<typeof FullTablesEditor>

const Editor = withDefaultWidgets(withEditorContext(WidgetRenderTree, {}))

const meta: Meta<typeof FullTablesEditor> = {
    title: 'Editor/Panel',
    component: FullTablesEditor,
    argTypes: {},
    parameters: {},
}

export default meta

export const Primary = {
    parameters: {},
    render: (args) => {
        const [t] = useTranslation()
        const dynamicVars = { prefix: 'prefix', storeKey: 'storeKey', projectId: 'projectId' }

        console.log(tryParseSimplified(JSON.parse(SETTINGS.data)))

        return (
            <div className='min-h-800px py-20px'>
                <Editor dynamicVars={dynamicVars} />
            </div>
        )
    },
}
