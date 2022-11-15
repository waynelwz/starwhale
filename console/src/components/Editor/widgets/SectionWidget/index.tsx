import Button from '@/components/Button'
import IconFont from '@/components/IconFont'
import { Panel, PanelProps } from 'baseui/accordion'
import React, { useCallback, useState } from 'react'
import { WidgetProps, WidgetRendererProps } from '../../Widget/const'
import WidgetPlugin from '../../Widget/WidgetPlugin'

const Header = React.forwardRef((props, ref) => {
    // console.log('Header', props)
    const { $expanded, children, onClick, onRename } = props

    return (
        <div ref={ref} style={{ height: '48px', display: 'flex', justifyContent: 'space-between' }}>
            <Button
                onClick={onClick}
                startEnhancer={() => (
                    <IconFont
                        type='arrow2'
                        style={{
                            transform: $expanded ? 'rotate(0)' : 'rotate(-90deg)',
                            transition: 'ease 1s',
                        }}
                    />
                )}
                as='transparent'
            >
                {children}
            </Button>
            <Button onClick={onRename}>Add</Button>
        </div>
    )
})

function Section(props: PanelProps) {
    const [expanded, setExpanded] = useState(false)
    const { title } = props
    // console.log(props)

    const handleChange = useCallback(
        ({ expanded }) => {
            setExpanded(expanded)
        },
        [setExpanded]
    )

    return (
        <Panel
            {...props}
            overrides={{
                Header: (headerProps: any) => (
                    <Header {...props} {...headerProps}>
                        {title}
                    </Header>
                ),
            }}
            expanded={expanded}
            onChange={handleChange}
        />
    )
}

export const CONFIG = {
    type: 'ui:section',
    name: 'test',
    isExpaned: true,
    layoutConfig: {
        gutter: 10,
        columnsPerPage: 3,
        rowsPerPage: 2,
        boxWidth: 430,
        heightWidth: 274,
    },
}

type SectionProps = typeof CONFIG

function SectionWidget(props: WidgetRendererProps<SectionProps, any>) {
    const { defaults, config, children } = props
    console.log('SectionWidget', props)
    const name = config?.name ?? defaults?.name

    return (
        <Section
            title={name}
            onRename={() => {
                console.log('rename', props)
                props.onConfigChange?.({
                    ...config,
                    name: '123',
                })
            }}
        >
            {children}
        </Section>
    )
}

const widget = new WidgetPlugin<SectionProps, any>(SectionWidget)

export default widget
