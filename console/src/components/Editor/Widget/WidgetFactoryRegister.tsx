import { memoize } from 'lodash'
import React, { useEffect, useState } from 'react'
import useSelector, { getWidget } from '../hooks/useSelector'
import BaseWidget from './BaseWidget'
import WidgetFactory, { WidgetConfig, WidgetType } from './WidgetFactory'
import WidgetPlugin from './WidgetPlugin'
import withWidgetProps from './withWidgetProps'
import log from 'loglevel'

export function useWidget(widgetType: string) {
    const [widget, setWidget] = useState<WidgetPlugin | undefined>(WidgetFactory.widgetMap.get(widgetType))

    useEffect(() => {
        if (widget) {
            return
        }

        // @FIXME dynamic Async load the plugin if none exists
        // importPlugin(pluginId)
        //   .then((result) => setPlugin(result))
        //   .catch((err: Error) => {
        //     setError(err.message);
        //   });
    }, [widget, widgetType])

    return {
        widget,
        setWidget,
    }
}

export const registerWidget = (Widget: any, config: WidgetConfig) => {
    WidgetFactory.register(['ui', config.type].join(':'), Widget, config)
}

export const registerCustomWidget = (Widget: any, config: WidgetConfig) => {
    WidgetFactory.register(['custom', config.type].join(':'), Widget, config)
}

export const registerWidgets = async () => {
    // @FIXME store module meta from backend
    // meta was defined by system not user
    const start = performance.now()

    const modules = [
        { type: 'ui:dndList', url: '../widgets/DNDListWidget' },
        { type: 'ui:section', url: '../widgets/SectionWidget' },
    ].filter((v) => !(v.type in WidgetFactory.widgetTypes))

    for await (const module of modules.map(async (m) => await import(m.url))) {
        registerWidget(module.default, module.CONFIG)
    }

    // for (let m in modules) {
    //     const module = await import(modules[m].url)
    //     registerWidget(module.default, module.CONFIG)
    // }

    console.log('Widget registration took: ', performance.now() - start, 'ms')
}
