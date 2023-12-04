import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { config } from '@storybook/addon-designs'

import DataViewer from '@starwhale/ui/Viewer/DataViewer'

type Story = StoryObj<typeof DataViewer>

const meta: Meta<typeof DataViewer> = {
    title: 'Viewer/DataViewer',
    component: DataViewer,
    // argTypes: {},
    parameters: {
        layout: 'fullscreen',
    },
}
export default meta

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const Template = (args) => <div className='p-20px'>123</div>

export const Primary: Story = Template.bind({})

Primary.parameters = {
    design: config({
        type: 'iframe',
        url: 'https://www.youtube.com/embed/JhpyGdvsApo',
        allowFullscreen: true,
    }),
}
