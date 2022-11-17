import BusyPlaceholder from '@/components/BusyLoaderWrapper/BusyPlaceholder'
import Button from '@/components/Button'
import React from 'react'
import { WidgetConfig, WidgetProps, WidgetRendererProps } from '../../Widget/const'
import WidgetPlugin from '../../Widget/WidgetPlugin'
import DNDList from './component/DNDList'

export const CONFIG: WidgetConfig = {
    type: 'ui:dndList',
    name: 'Dragging Section',
    group: 'layout',
}

function DNDListWidget(props: WidgetRendererProps) {
    console.log('DNDListWidget', props)
    const { onOrderChange, onOptionChange, onChildrenAdd, eventBus, ...rest } = props
    // if (rest.children?.length === 0 || 1)
    //     return (
    //         <div
    //             style={{
    //                 display: 'flex',
    //                 flexDirection: 'column',
    //                 alignItems: 'center',
    //                 justifyContent: 'center',
    //                 gap: 8,
    //                 height: 300,
    //             }}
    //         >
    //             <BusyPlaceholder type='empty' />
    //         </div>
    //     )

    return (
        <div>
            <DNDList {...rest} onChange={onOrderChange} onOptionChange={onOptionChange} />
            <Button
                onClick={() =>
                    eventBus.publish({
                        type: 'add-section',
                        payload: {
                            path: props.path,
                        },
                    })
                }
            >
                Add Section
            </Button>
        </div>
    )
}

// @FIXME type error
const widget = new WidgetPlugin(DNDListWidget, CONFIG)

export default widget
