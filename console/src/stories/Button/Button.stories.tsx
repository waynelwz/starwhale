import React from 'react'

import { Button } from '@starwhale/ui'
import { IconFont } from '@starwhale/ui'
import type { Meta, StoryObj } from '@storybook/react'

type Story = StoryObj<typeof Button>

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Component/Button',
    component: Button,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        // backgroundColor: { control: 'color' },
    },
}

export const Primary: Story = {
    args: {
        kind: 'primary',
        children: 'Button',
    },
}

export const Secondary: Story = {
    args: {
        kind: 'secondary',
        children: 'Button',
    },
}

export const ButtonWithIcon: Story = {
    args: {
        size: 'compact',
        kind: 'tertiary',
        icon: 'runtime',
        children: 'Button',
    },
}

export const ButtonWithIconOnly: Story = {
    args: {
        size: 'compact',
        kind: 'primary',
        icon: 'runtime',
        children: <IconFont type='runtime' />,
    },
}

export const ButtonAsLink: Story = {
    args: {
        as: 'link',
        children: 'Button',
    },
}
