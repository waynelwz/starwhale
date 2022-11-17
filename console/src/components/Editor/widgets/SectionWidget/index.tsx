import { Modal, ModalBody, ModalHeader } from 'baseui/modal'
import React, { useCallback, useState } from 'react'
import { WidgetProps, WidgetRendererProps } from '../../Widget/const'
import WidgetPlugin from '../../Widget/WidgetPlugin'
import { GridLayout } from './component/GridBasicLayout'
import SectionAccordionPanel from './component/SectionAccordionPanel'
import SectionForm from './component/SectionForm'

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
    const { optionConfig, fieldConfig, children, eventBus } = props
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
        console.log('rename', name)
        props.onOptionChange?.({
            title: name,
        })
        setIsModelOpen(false)
    }

    console.log('ismodelopen', isModelOpen)

    return (
        <div>
            <SectionAccordionPanel
                childNums={len}
                title={title}
                onPanelAdd={() =>
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
                onSectionAddAbove={() => {}}
                onSectionAddBelow={() => {}}
                onSectionDelete={() => {}}
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
                                }}
                            >
                                {child}
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
