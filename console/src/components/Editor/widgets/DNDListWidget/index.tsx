import BusyPlaceholder from '@/components/BusyLoaderWrapper/BusyPlaceholder'
import Button from '@/components/Button'
import React from 'react'
import { WidgetProps, WidgetRendererProps } from '../../Widget/const'
import WidgetPlugin from '../../Widget/WidgetPlugin'
import DNDList from './component/DNDList'

export const CONFIG = {
    type: 'ui:dndList',
}
type DNDProps = typeof CONFIG

function DNDListWidget({ onOrderChange, onConfigChange, onChildrenAdd, ...rest }: WidgetRendererProps) {
    console.log('DNDListWidget', rest)
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
            <DNDList {...rest} onChange={onOrderChange} onConfigChange={onConfigChange} />
            <Button onClick={() => onChildrenAdd({ type: 'ui:section' })}>Add Section</Button>
        </div>
    )
}

// @FIXME type error
const widget = new WidgetPlugin<DNDProps, any>(DNDListWidget)

export default widget
