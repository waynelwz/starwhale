import { Modal, ModalBody, ModalHeader } from 'baseui/modal'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Button from '@starwhale/ui/Button'
import BusyPlaceholder from '@/components/BusyLoaderWrapper/BusyPlaceholder'
import { WidgetRendererProps, WidgetConfig, WidgetGroupType } from '@starwhale/core/types'
import { GridLayout } from './component/GridBasicLayout'
import SectionAccordionPanel from './component/SectionAccordionPanel'
import SectionForm from './component/SectionForm'
import { PanelAddEvent, PanelEditEvent } from '@starwhale/core/events'
import { WidgetPlugin } from '@starwhale/core/widget'
import IconFont from '@starwhale/ui/IconFont'
import { DragEndEvent, DragStartEvent } from '@starwhale/core/events/common'
import { of, Subscription } from 'rxjs'

const gridLayoutConfig = {
    item: {
        w: 2,
        h: 1,
        // minW: 1,
        // maxW: 3,
        // minH: 1,
        // maxH: 3,
        isBounded: true,
        isDraggable: false,
    },
    cols: 3,
    boxHeight: 274,
    boxMinHeight: 274,
    boxMaxHeight: 800,
    boxMinWidth: 430,
    containerPadding: [20, 0],
    containerMargin: [20, 20],
    // no use for now
    columnsPerPage: 3,
    rowsPerPage: 3,
    gutter: 10,
}
export const CONFIG: WidgetConfig = {
    type: 'ui:section',
    name: 'test',
    group: WidgetGroupType.LIST,
    description: 'ui layout for dynamic grid view',
    optionConfig: {
        title: 'Section',
        isExpaned: true,
        gridLayoutConfig,
        gridLayout: [],
    },
}

type Option = typeof CONFIG['optionConfig']

export const calcLayout = ({
    layout = [],
    config = gridLayoutConfig,
    containerWidth = 0,
    resizeOffsetRect,
    step = 0,
    oldItem,
    newItem,
    savedAttr = ['h', 'w', 'x', 'y', 'minW', 'maxW', 'minH', 'maxH'],
}: {
    layout: ReactGridLayout.Layout[]
    config?: typeof gridLayoutConfig
    containerWidth?: number
    resizeOffsetRect?: { offsetX: number; offsetY: number }
    savedAttr?: any[]
    step?: number
}) => {
    const RESIZE_THRESHOLD = 20
    let items = layout.slice()
    const count = items.length
    let { cols, boxHeight } = config
    let maxWidth = containerWidth - config.containerPadding[0] * 2 - config.containerMargin[0] * (cols - 1)

    // if (containerWidth) {
    //     maxCol = Math.floor(maxWidth / config.boxMinWidth)
    // }

    if (resizeOffsetRect?.offsetY) {
        boxHeight = Math.min(config.boxMaxHeight, Math.max(config.boxMinHeight, boxHeight + resizeOffsetRect?.offsetY))
    }

    if (resizeOffsetRect?.offsetX && Math.abs(resizeOffsetRect?.offsetX) > RESIZE_THRESHOLD) {
        const currentWidth = Math.floor(maxWidth / cols)
        const minCol = 1
        const maxCol = Math.max(1, Math.floor(maxWidth / config.boxMinWidth))
        // const step = Math.floor(Math.abs(resizeOffsetRect?.offsetX / maxWidth) * maxCol)

        let newWidth = Math.max(config.boxMinWidth, currentWidth + resizeOffsetRect?.offsetX)
        let newCol = Math.floor(maxWidth / newWidth)
        console.log('--', maxWidth, newWidth, newCol)
        // if (newCol < count) {
        //     newCol = count
        // } else
        if (newCol <= 0) {
            newCol = 1
        }

        cols = newCol
        if (resizeOffsetRect?.offsetX > 0) {
            // cols += 1
        } else {
            cols -= 1
        }

        if (cols > maxCol) cols = maxCol
        if (cols < minCol) cols = minCol

        cols = 6

        console.log('cols----', minCol, maxCol, resizeOffsetRect?.offsetX, cols, 'newCol=', newCol)
        console.log(maxWidth, currentWidth, newWidth, cols, items, layout)
    }

    let w = 0
    if (resizeOffsetRect?.offsetX > 0) {
        w = newItem.w > cols / count ? cols : newItem.w
    } else {
        w = newItem.w > cols / count ? cols / 2 : newItem.w
    }

    let sum = 0
    let y = 0
    let x = 0

    // reflow: ordered display
    items = items
        .sort((b, a) => {
            if (a.x < b.x) return 1
            if (a.y < b.y) return 1
            return -1
        })
        .map((item, i) => {
            if (i == 0) {
                x = 0
                y = 0
            } else {
                if (x >= cols) {
                    y += item.y
                    x = 0
                } else {
                    x += w
                }
            }
            console.log('list', sum, item.w, y)

            return {
                ...item,
                x: x,
                y: y,
                w: w,
                h: newItem.h,
                maxW: cols,
                minW: 1,
            }
        })

    return {
        boxHeight,
        cols: cols,
        layout: items,
    }
}

// @ts-ignore
function SectionWidget(props: WidgetRendererProps<Option, any>) {
    const { optionConfig, children, eventBus, type } = props

    // @ts-ignore
    const { title = '', isExpaned = false, gridLayoutConfig, gridLayout } = optionConfig as Option
    const [isDragging, setIsDragging] = useState(false)
    const gridRef = useRef(null)
    const resizeRef = useRef({ startX: 0, startY: 0, offsetX: 0, offsetY: 0 })

    const len = React.Children.count(children)
    const { cols, boxHeight, containerPadding, containerMargin } = gridLayoutConfig
    const layout = useMemo(() => {
        console.log('layout memo', gridLayout, len)
        if (gridLayout.length === len) return gridLayout
        return []
        // return new Array(len).fill(0).map((_, i) => ({
        //     // i: String(i),
        //     x: i,
        //     y: 0,
        //     ...gridLayoutConfig.item,
        //     ...(gridLayout[i] ?? {}),
        // }))
    }, [gridLayout, gridLayout.length, gridLayoutConfig, len])

    const [isModelOpen, setIsModelOpen] = useState(false)

    const handleSectionForm = ({ name }: { name: string }) => {
        props.onOptionChange?.({
            title: name,
        })
        setIsModelOpen(false)
    }
    const handleEditPanel = (id: string) => {
        eventBus.publish(new PanelEditEvent({ id }))
    }
    const handleExpanded = (expanded: boolean) => {
        props.onOptionChange?.({
            isExpaned: expanded,
        })
    }
    const handleLayoutChange = (oldLayout: any) => {
        if (gridRef.current) {
            //     const layout = calcLayout({
            //         layout: oldLayout,
            //         gridLayoutConfig,
            //         containerWidth: gridRef.current.state.width,
            //         resizeOffsetRect: resizeRef.current,
            //     })
        }
        //     props.onOptionChange?.({
        //         gridLayout: args,
        //     })
    }
    const handleResize = (oldLayout: any, oldItem, newItem) => {
        if (gridRef.current) {
            console.log('handellayout', oldLayout, gridRef.current, resizeRef.current)
            const config = calcLayout({
                layout: oldLayout,
                config: gridLayoutConfig,
                containerWidth: gridRef.current.state.width,
                resizeOffsetRect: resizeRef.current,
                oldItem,
                newItem,
            })
            console.log('newlayout', config)
            props.onOptionChange?.({
                gridLayoutConfig: {
                    boxHeight: config.boxHeight,
                    cols: config.cols,
                },
                gridLayout: oldLayout,
            })
        }
    }

    // subscription
    useEffect(() => {
        const subscription = new Subscription()
        subscription.add(
            eventBus.getStream(DragStartEvent).subscribe({
                next: (evt) => setIsDragging(true),
            })
        )
        subscription.add(
            eventBus.getStream(DragEndEvent).subscribe({
                next: (evt) => setIsDragging(false),
            })
        )
        return () => {
            subscription.unsubscribe()
        }
    }, [])

    console.log('render', gridLayout, JSON.stringify(layout), cols)

    return (
        <div>
            <SectionAccordionPanel
                childNums={len}
                title={title}
                expanded={isDragging ? false : isExpaned}
                onExpanded={handleExpanded}
                onPanelAdd={() => {
                    console.log('add panel')
                    // @FIXME abatract events
                    eventBus.publish(
                        new PanelAddEvent({
                            // @ts-ignore
                            path: props.path,
                        })
                    )
                }}
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
                {len === 0 && <EmptyPlaceholder />}
                <GridLayout
                    ref={gridRef}
                    rowHeight={boxHeight}
                    className='layout'
                    cols={cols}
                    layout={layout}
                    onLayoutChange={handleLayoutChange}
                    containerPadding={containerPadding}
                    margin={containerMargin}
                    onDragStop={(layout, oldItem, newItem, placeholder, event, dom) => {
                        resizeRef.current.offsetX = 0
                        resizeRef.current.offsetY = 0
                        handleResize(layout, oldItem, newItem)
                    }}
                    onDragStart={() => {}}
                    onResizeStop={(layout, oldItem, newItem, placeholder, event, dom) => {
                        const offsetX = event.clientX - resizeRef.current.startX
                        const offsetY = event.clientY - resizeRef.current.startY
                        resizeRef.current.offsetX = offsetX
                        resizeRef.current.offsetY = offsetY
                        handleResize(layout, oldItem, newItem)
                    }}
                    onResizeStart={(layout, oldItem, newItem, placeholder, event, dom) => {
                        resizeRef.current = {
                            startX: event.clientX,
                            startY: event.clientY,
                            offsetX: 0,
                            offsetY: 0,
                        }
                    }}
                >
                    {/* @ts-ignore */}
                    {React.Children.map(children, (child: React.ReactChild, i: number) => (
                        //  data-grid={layout[i]}
                        <div key={String(child.props.id)}>
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    overflow: 'auto',
                                    padding: '40px 20px 20px',
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
                                        top: '16px',
                                    }}
                                >
                                    <Button
                                        // @FIXME direct used child props here ?
                                        // @ts-ignore
                                        onClick={() => handleEditPanel(child.props.id)}
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
                <ModalHeader>Panel</ModalHeader>
                <ModalBody>
                    <SectionForm onSubmit={handleSectionForm} formData={{ name: title }} />
                </ModalBody>
            </Modal>
        </div>
    )
}

const EmptyPlaceholder = () => {
    return (
        <BusyPlaceholder type='center' style={{ minHeight: '240px' }}>
            <IconFont type='emptyChart' size={64} />
            <span>Click "Add Panel" to add visualizations</span>
        </BusyPlaceholder>
    )
}

// @ts-ignore
const widget = new WidgetPlugin<Option>(SectionWidget, CONFIG)

export default widget
