import React from 'react'
import { WidgetProps, WidgetRendererProps } from '../../Widget/const'
import WidgetPlugin from '../../Widget/WidgetPlugin'
import DNDList from './component/DNDList'

export const CONFIG = {
    type: 'dndList',
}
type DNDProps = typeof CONFIG

function DNDListWidget(props: WidgetRendererProps) {
    return <DNDList {...props} />
}

// @FIXME type error
const widget = new WidgetPlugin<DNDProps, any>(DNDListWidget).addConfig(CONFIG)

export default widget
