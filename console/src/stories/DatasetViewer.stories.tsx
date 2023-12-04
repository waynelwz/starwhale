import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { DataViewer } from '@starwhale/ui/Viewer'

type Story = StoryObj<typeof DataViewer>

const meta: Meta<typeof DataViewer> = {
    title: 'Viewer/DataViewer',
    component: DataViewer,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    // argTypes: {},
    parameters: {
        // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
        layout: 'fullscreen',
    },
}

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default meta
// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

/* eslint-disable */
// @ts-ignore
const Template: ComponentStory<typeof DataViewer> = (args) => (
    <div
        style={{
            minHeight: '800px',
            padding: '20px',
        }}
    >
        <DataViewer {...args} />
    </div>
)

export const Primary: Story = {
    render: (args) => (
        <div
            style={{
                minHeight: '800px',
                padding: '20px',
            }}
        >
            <DataViewer {...args} />
        </div>
    ),
}

Primary.args = {}
