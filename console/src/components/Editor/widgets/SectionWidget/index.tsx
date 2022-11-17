import { Modal, ModalBody, ModalHeader } from 'baseui/modal'
import React, { useCallback, useState } from 'react'
import { WidgetProps, WidgetRendererProps } from '../../Widget/const'
import WidgetPlugin from '../../Widget/WidgetPlugin'
import { GridLayout } from './component/GridBasicLayout'
import SectionAccordionPanel from './component/SectionAccordionPanel'
import SectionForm from './component/SectionForm'
import IconFont from '@/components/IconFont'
import Button from '@/components/Button'

export const CONFIG = {
    type: 'ui:section',
    name: 'test',
    optionConfig: {
        title: 'Section',
        isExpaned: true,
        layout: {
            gutter: 10,
            columnsPerPage: 3,
            rowsPerPage: 2,
            boxWidth: 430,
            heightWidth: 274,
        },
    },
}

type Option = typeof CONFIG['optionConfig']

function SectionWidget(props: WidgetRendererProps<Option, any>) {
    const { optionConfig, fieldConfig, children, eventBus, type, id } = props
    const title = optionConfig?.title

    const layoutDefault = [
        { i: '0', x: 0, y: 0, w: 1, h: 2, minW: 1, maxW: 3, isBounded: true },
        { i: '1', x: 1, y: 0, w: 1, h: 2, minW: 1, maxW: 3, isBounded: true },
    ]
    const len = React.Children.count(children)
    const cols = 2 //Math.min(3, Math.max(1, len))

    const [layout, setLayout] = useState(layoutDefault)
    const [isModelOpen, setIsModelOpen] = useState(false)

    const onRename = ({ name }: { name: string }) => {
        props.onOptionChange?.({
            title: name,
        })
        setIsModelOpen(false)
    }
    const handleEditPanel = (id) => {
        eventBus.publish({
            type: 'edit-panel',
            payload: {
                id,
            },
        })
    }

    return (
        <div>
            <SectionAccordionPanel
                childNums={len}
                title={title}
                onPanelAdd={() =>
                    // @FIXME abatract events
                    eventBus.publish({
                        type: 'add-panel',
                        payload: {
                            path: props.path,
                        },
                    })
                }
                onSectionRename={() => {
                    setIsModelOpen(true)
                }}
                onSectionAddAbove={() => {
                    props.onLayoutCurrentChange?.({ type }, { type: 'addAbove' })
                }}
                onSectionAddBelow={() => {
                    props.onLayoutCurrentChange?.({ type }, { type: 'addBelow' })
                }}
                onSectionDelete={() => {
                    props.onLayoutCurrentChange?.({ type }, { type: 'delete', id: props.id })
                }}
            >
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
                                    position: 'relative',
                                }}
                            >
                                {child}
                                <div
                                    style={{
                                        position: 'absolute',
                                        right: '20px',
                                        top: '20px',
                                    }}
                                >
                                    <Button
                                        // @FIXME direct used child props here ?
                                        onClick={(i) => handleEditPanel(child.props.id)}
                                        size='compact'
                                        kind='secondary'
                                        overrides={{
                                            BaseButton: {
                                                style: {
                                                    'display': 'flex',
                                                    'fontSize': '12px',
                                                    'backgroundColor': '#F4F5F7',
                                                    'width': '20px',
                                                    'height': '20px',
                                                    'textDecoration': 'none',
                                                    'color': 'gray !important',
                                                    'paddingLeft': '10px',
                                                    'paddingRight': '10px',
                                                    ':hover span': {
                                                        color: ' #5181E0  !important',
                                                    },
                                                    ':hover': {
                                                        backgroundColor: '#F0F4FF',
                                                    },
                                                },
                                            },
                                        }}
                                    >
                                        <IconFont type='edit' size={10} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </GridLayout>
            </SectionAccordionPanel>
            <Modal isOpen={isModelOpen} onClose={() => setIsModelOpen(false)} closeable animate autoFocus>
                <ModalHeader>{'Panel'}</ModalHeader>
                <ModalBody>
                    <SectionForm onSubmit={onRename} formData={{ name: title }} />
                </ModalBody>
            </Modal>
        </div>
    )
}

const widget = new WidgetPlugin<Option>(SectionWidget, CONFIG)

export default widget
