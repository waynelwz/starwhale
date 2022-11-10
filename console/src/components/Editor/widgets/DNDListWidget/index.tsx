import React from 'react'
import { WidgetProps } from '../../Widget/const'
import WidgetPlugin from '../../Widget/WidgetPlugin'
import DNDList from './component/DNDList'

export const CONFIG = {
    type: 'ui:dndList',
}

function DNDListWidget(props: WidgetProps) {
    console.log('DNDListWidget', props)
    return <DNDList {...props} />
}

const widget = new WidgetPlugin<WidgetProps, any>(DNDListWidget).addConfig(CONFIG)

console.log('----', widget)

export default widget
