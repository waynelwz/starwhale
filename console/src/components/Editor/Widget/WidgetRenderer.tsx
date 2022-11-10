import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useWidget } from './WidgetFactoryRegister'
import { WidgetProps, WidgetRendererType, WidgetRendererProps } from './const'
import { generateId } from '../utils/generators'

const defaultFieldConfig = { defaults: {}, overrides: [] }
export function WidgetRenderer<P extends object = any, F extends object = any>(props: WidgetRendererProps<P, F>) {
    const {
        type,
        path,
        data,
        options = {},
        width,
        height,
        title,
        onOptionsChange = () => {},
        onFieldConfigChange = () => {},
        fieldConfig = defaultFieldConfig,
        children,
    } = props

    const { widget } = useWidget(type)
    const [error, setError] = useState<string | undefined>()
    const optionsWithDefaults = {}
    const dataWithOverrides = {}

    if (error) {
        return <div>Failed to load widget: {error}</div>
    }

    if (!widget) {
        return <div>Loading widget...</div>
    }

    if (!widget.renderer) {
        return <div>Seems like the widget you are trying to load does not have a renderer component.</div>
    }

    if (!dataWithOverrides) {
        return <div>No datastore data</div>
    }

    const WidgetComponent = widget.renderer

    const WidgetId = useMemo(() => {
        return generateId(type)
    }, [type])

    return (
        <WidgetComponent
            id={WidgetId}
            path={path}
            // data={dataWithOverrides}
            // title={title}
            // transparent={false}
            // width={width}
            // height={height}
            // renderCounter={0}
            // replaceVariables={(str: string) => str}
            //
            // options={optionsWithDefaults!.options}
            // onOptionsChange={onOptionsChange}
            //
            fieldConfig={fieldConfig}
            onFieldConfigChange={onFieldConfigChange}
            //
            // onOrderChange=(oldIndex, newIndex) {}
            // eventBus={appEvents}
        >
            {children}
        </WidgetComponent>
    )
}

// export let PanelRenderer: WidgetRendererType = () => {
//     return <div>WidgetRenderer can only be used instance has been started.</div>
// }

// /**
//  * Used to bootstrap the PanelRenderer during application start so the PanelRenderer
//  * is exposed via runtime.
//  *
//  * @internal
//  */
// export function setPanelRenderer(renderer: WidgetRendererType) {
//     PanelRenderer = renderer
// }
