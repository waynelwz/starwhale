import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import ImageSegmentationViewer from '@starwhale/ui/Viewer/ImageSegmentationViewer.demo'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Component/Viewer/ImageSegmentationViewer',
    component: ImageSegmentationViewer,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    // argTypes: {},
    parameters: {
        // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
        layout: 'fullscreen',
    },
} as Meta<typeof ImageSegmentationViewer>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
/* eslint-disable */
// @ts-ignore
const Template = (args) => (
    <div
        style={{
            minHeight: '800px',
            padding: '20px',
        }}
    >
        <ImageSegmentationViewer {...args} />
    </div>
)

export const Primary = Template.bind({})

// @ts-ignore
Primary.args = {}
