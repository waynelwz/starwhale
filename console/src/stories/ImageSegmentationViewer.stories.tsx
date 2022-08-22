import React from 'react'
import { ComponentStory, ComponentMeta, Story } from '@storybook/react'

import ImageSegmentationViewer from '../components/Viewer/ImageSegmentationViewer'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Example/ImageSegmentationViewer',
    component: ImageSegmentationViewer,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    // argTypes: {},
} as ComponentMeta<typeof ImageSegmentationViewer>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
/* eslint-disable */
// @ts-ignore
const Template: ComponentStory<typeof ImageSegmentationViewer> = (args) => <ImageSegmentationViewer {...args} />

export const Primary = Template.bind({})

Primary.args = {}
