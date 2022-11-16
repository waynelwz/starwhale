import AutoSizer from 'react-virtualized-auto-sizer'
import Button from '@/components/Button'
import IconFont from '@/components/IconFont'
import { Panel, PanelProps } from 'baseui/accordion'
import React, { useCallback, useState } from 'react'
import { WidgetProps, WidgetRendererProps } from '../../Widget/const'
import WidgetPlugin from '../../Widget/WidgetPlugin'
import { GridLayout } from './component/GridBasicLayout'
import { expandPadding } from '@/utils'
import SectionPopover from './component/SectionPopover'

const Header = React.forwardRef((props, ref) => {
    // console.log('Header', props)
    const { $expanded, children, onClick, onPanelAdd } = props

    const actions = {
        rename: props.onSectionRename,
        addAbove: props.onSectionAddAbove,
        addBelow: props.onSectionAddBelow,
        delete: props.onSectionDelete,
    }

    return (
        <div
            ref={ref}
            style={{
                height: '48px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 20px 0 8px',
                gap: '12px',
            }}
        >
            <Button
                onClick={onClick}
                startEnhancer={() => (
                    <IconFont
                        type='arrow2'
                        style={{
                            transform: $expanded ? 'rotate(0)' : 'rotate(-90deg)',
                            transition: 'ease 1s',
                            color: 'rgba(2,16,43,0.40)',
                        }}
                    />
                )}
                overrides={{
                    BaseButton: {
                        style: {
                            'fontSize': '14px',
                            'color': '#02102B',
                            'fontWeight': 'bold',
                            ':hover': { color: '#02102B' },
                        },
                    },
                }}
                as='transparent'
            >
                {children}
            </Button>
            <div style={{ flex: 1 }} />
            <SectionPopover
                onOptionSelect={(item) => {
                    console.log(item)
                    actions[item.type]?.()
                }}
            />
            <Button
                kind='secondary'
                onClick={onPanelAdd}
                overrides={{
                    BaseButton: {
                        style: {
                            backgroundColor: '#fff',
                            fontSize: '14px',
                            color: '#02102B',
                            height: '32px',
                            margin: '0',
                        },
                    },
                }}
            >
                Add Chart
            </Button>
        </div>
    )
})

function Section(props: PanelProps) {
    const [expanded, setExpanded] = useState(false)
    const { title, children, childNums, ...rest } = props
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
                        {childNums ? (
                            <span
                                style={{
                                    backgroundColor: '#F0F5FF',
                                    color: 'rgba(2,16,43,0.60)',
                                    fontWeight: 'normal',
                                    borderRadius: '12px',
                                    padding: '3px 10px',
                                    marginLeft: '8px',
                                    fontSize: '12px ',
                                }}
                            >
                                {childNums}
                            </span>
                        ) : null}
                    </Header>
                ),
                PanelContainer: {
                    style: {
                        backgroundColor: '#FAFBFC;',
                        ...expandPadding('0', '0', '0', '0'),
                        borderBottomWidth: '0px',
                    },
                },
                Content: {
                    style: {
                        backgroundColor: '#FAFBFC;',
                        borderBottomWidth: '0px',
                        ...expandPadding('0', '0', '20px', '0'),
                    },
                },
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
    const layoutDefault = [
        { i: '0', x: 0, y: 0, w: 1, h: 2, minW: 1, maxW: 3, isBounded: true },
        { i: '1', x: 1, y: 0, w: 1, h: 2, minW: 1, maxW: 3, isBounded: true },
    ]
    const len = children?.length
    const cols = 2 //Math.min(3, Math.max(1, len))

    console.log(cols)
    const [layout, setLayout] = useState(layoutDefault)

    return (
        <Section
            childNums={len}
            title={name}
            onRename={() => {
                console.log('rename', props)
                props.onConfigChange?.({
                    ...config,
                    name: '123',
                })
            }}
            onPanelAdd={() =>
                eventBus.publish({
                    type: 'add-panel',
                    payload: {
                        path: props.path,
                    },
                })
            }
            onSectionRename={() => {}}
            onSectionAddAbove={() => {}}
            onSectionAddBelow={() => {}}
            onSectionDelete={() => {}}
        >
            {/* {children} */}
            <GridLayout
                rowHeight={300}
                className='layout'
                cols={cols}
                layout={layout}
                onLayoutChange={(args) => {
                    console.log(args)

                    setLayout(args)
                }}
                containerPadding={[20, 0]}
                margin={[20, 20]}
            >
                {children?.map((child, i) => (
                    <div key={i}>
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                overflow: 'auto',
                                padding: '20px',
                                backgroundColor: '#fff',
                                border: '1px solid #CFD7E6',
                                borderRadius: '4px',
                            }}
                        >
                            {child}
                        </div>
                    </div>
                ))}
            </GridLayout>
        </Section>
    )
}

const widget = new WidgetPlugin<Option>(SectionWidget, CONFIG)

export default widget
