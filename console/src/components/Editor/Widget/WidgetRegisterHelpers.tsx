import { memoize } from 'lodash'
import React from 'react'
import useSelector, { getWidget } from '../hooks/useSelector'
import BaseWidget from './BaseWidget'
import WidgetFactory from './WidgetFactory'
import withWidgetProps from './withWidgetProps'

const generateWidget = memoize(function getWidgetComponent(Widget: typeof BaseWidget) {
    return withWidgetProps(Widget)
})

type WidgetConfiguration = {
    type: string
    editor: any
}
export const registerWidget = (Widget: any, config: WidgetConfiguration) => {
    const ProfiledWidget = generateWidget(Widget)

    WidgetFactory.registerWidgetBuilder(config.type, {
        buildWidget(widgetData: any): JSX.Element {
            return <ProfiledWidget {...widgetData} key={widgetData.widgetId} />
        },
    })
    configureWidget(config)
}

export const configureWidget = (config) => {}

export const registerWidgets = async () => {
    const module = await import('../widgets/DNDListWidget')

    registerWidget(module.default, module.CONFIG)
}
