import React from 'react'
import { Input } from '@starwhale/ui'
import type { Meta, StoryObj } from '@storybook/react'

type Story = StoryObj<typeof Input>

export default {
    title: 'Component/Input',
    component: Input,
    argTypes: {},
}

export const Primary: Story = {
    args: {
        size: 'compact',
    },
}

export const Clearable: Story = {
    args: {
        clearable: true,
        disabled: false,
        size: 'compact',
    },
}
