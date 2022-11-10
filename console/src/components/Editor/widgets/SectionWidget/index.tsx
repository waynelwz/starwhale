import React from 'react'
import { WidgetProps, WidgetRendererProps } from '../../Widget/const'
import WidgetPlugin from '../../Widget/WidgetPlugin'

export const CONFIG = {
    type: 'section',
}
type DNDProps = typeof CONFIG

function Section(props: WidgetRendererProps<DNDProps, any>) {
    return <div>{props.children}</div>
}

const widget = new WidgetPlugin<DNDProps, any>(Section).addConfig(CONFIG)

export default widget
