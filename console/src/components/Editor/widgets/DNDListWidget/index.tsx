import React from 'react'
import { WidgetProps, WidgetRendererProps } from '../../Widget/const'
import WidgetPlugin from '../../Widget/WidgetPlugin'
import DNDList from './component/DNDList'

export const CONFIG = {
    type: 'ui:dndList',
}
type DNDProps = typeof CONFIG

function DNDListWidget({ onOrderChange, onConfigChange, ...rest }: WidgetRendererProps) {
    console.log('DNDListWidget', rest)
    return <DNDList {...rest} onChange={onOrderChange} onConfigChange={onConfigChange} />
}

// @FIXME type error
const widget = new WidgetPlugin<DNDProps, any>(DNDListWidget).addConfig(CONFIG)

export default widget
