import Button from '@/components/Button'
import IconFont from '@/components/IconFont'
import { Panel, PanelProps } from 'baseui/accordion'
import React, { useCallback, useState } from 'react'
import { WidgetProps, WidgetRendererProps } from '../../Widget/const'
import WidgetPlugin from '../../Widget/WidgetPlugin'

const Header = React.forwardRef((props, ref) => {
    // console.log('Header', props)
    const { $expanded, children, onClick, onAdd } = props

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
            <Button onClick={onAdd}>Add</Button>
        </div>
    )
})

function Section(props: PanelProps) {
    const [expanded, setExpanded] = useState(false)
    const { title } = props
    console.log(props)

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
    optionConfig: {
        gutter: 10,
        columnsPerPage: 3,
        rowsPerPage: 2,
        boxWidth: 430,
        heightWidth: 274,
    },
}

type Option = typeof CONFIG['optionConfig']

function SectionWidget(props: WidgetRendererProps<Option, any>) {
    const { defaults, config, children, eventBus } = props
    console.log('SectionWidget', props, children)
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
            onAdd={() =>
                eventBus.publish({
                    type: 'add-panel',
                    payload: {
                        path: props.path,
                    },
                })
            }
        >
            {children}
        </Section>
    )
}

const widget = new WidgetPlugin<Option>(SectionWidget, CONFIG)

export default widget
