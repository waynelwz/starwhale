import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { config } from '@storybook/addon-designs'

import DataViewer from '@starwhale/ui/Viewer/DataViewer'

type Story = StoryObj<typeof DataViewer>

const meta: Meta<typeof DataViewer> = {
    title: 'Viewer/DataViewer',
    component: DataViewer,
    render: (args) => <div className='p-20px'>123</div>,
    argTypes: {},
    parameters: {
        layout: 'fullscreen',
    },
}

export default meta

export const Primary = {
    parameters: {
        // design: config({
        //     type: 'iframe',
        //     url: 'https://www.youtube.com/embed/JhpyGdvsApo',
        //     allowFullscreen: true,
        // }),
    },
}
