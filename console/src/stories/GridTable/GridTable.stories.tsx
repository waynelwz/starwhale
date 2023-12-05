import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { config } from '@storybook/addon-designs'

import GridTable from './Evaluation'

type Story = StoryObj<typeof GridTable>

const meta: Meta<typeof GridTable> = {
    title: 'Gird/GridTable',
    component: GridTable,
    argTypes: {},
    parameters: {
        // layout: 'fullscreen',
    },
}

export default meta

export const Primary = {
    parameters: {},
    render: (args) => (
        <div className='h-800px py-20px'>
            <GridTable />
        </div>
    ),
}
