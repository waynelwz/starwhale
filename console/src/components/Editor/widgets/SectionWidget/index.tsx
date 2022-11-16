import AutoSizer from 'react-virtualized-auto-sizer'
import Button from '@/components/Button'
import IconFont from '@/components/IconFont'
import { Panel, PanelProps } from 'baseui/accordion'
import React, { useCallback, useState } from 'react'
import { WidgetProps, WidgetRendererProps } from '../../Widget/const'
import WidgetPlugin from '../../Widget/WidgetPlugin'
import { GridLayout } from './component/GridBasicLayout'

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
    const { title, children, ...rest } = props
    console.log('Section', props, children)

    const handleChange = useCallback(
        ({ expanded }) => {
            setExpanded(expanded)
        },
        [setExpanded]
    )

    return (
        <Panel
            {...rest}
            overrides={{
                Header: (headerProps: any) => (
                    <Header {...rest} {...headerProps}>
                        {title}
                    </Header>
                ),
            }}
            expanded={expanded}
            onChange={handleChange}
        >
            {children}
        </Panel>
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
            {/* <AutoSizer key={i} defaultHeight={100} defaultWidth={100}>
                {({ width = 100, height = 100 }) => props.defaults.name}
            </AutoSizer> */}
            {/* {children} */}
            <GridLayout rowHeight={300} className='layout' cols={3} onLayoutChange={() => {}}>
                {children}
            </GridLayout>

            {/* {children?.map((child, i) => {
                console.log(child, '----', typeof child)
                return (
                    <div style={{ width: '100%', height: 'auto', minHeight: '280px', overflow: 'auto' }}>
                        <AutoSizer key={i}>
                            {({ width = 100, height = 100 }) => {
                                console.log(width, height, '12312312')
                                return (
                                    <div
                                        style={{
                                            width: `${width}px`,
                                            height: `${height}px`,
                                        }}
                                    >
                                        {child}
                                    </div>
                                )
                            }}
                        </AutoSizer>
                        123
                    </div>
                )
            })} */}
        </Section>
    )
}

const widget = new WidgetPlugin<Option>(SectionWidget, CONFIG)

export default widget
