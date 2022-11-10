import { memoize } from 'lodash'
import React, { useEffect, useState } from 'react'
import useSelector, { getWidget } from '../hooks/useSelector'
import BaseWidget from './BaseWidget'
import WidgetFactory, { WidgetConfig, WidgetType } from './WidgetFactory'
import WidgetPlugin from './WidgetPlugin'
import withWidgetProps from './withWidgetProps'

export function useWidget(widgetType: string) {
    const [widget, setWidget] = useState<WidgetPlugin | undefined>(WidgetFactory.widgetMap.get(widgetType))

    useEffect(() => {
        if (widget) {
            return
        }

        // @FIXME Async load the plugin if nont exists
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
    WidgetFactory.register(config.type, Widget, config)
}

export const registerWidgets = async () => {
    // @FIXME store module meta from backend
    // meta was defined by system not user

    // init by widget & config
    const module = await import('../widgets/DNDListWidget')
    registerWidget(module.default, module.CONFIG)
}
