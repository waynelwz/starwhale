import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useWidget } from './WidgetFactoryRegister'
import { WidgetProps, WidgetRendererType, WidgetRendererProps } from './const'
import { generateId } from '../utils/generators'
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'

const DEBUG = true
const defaultFieldConfig = { defaults: {}, overrides: [] }
export function WidgetRenderer<P extends object = any, F extends object = any>(props: WidgetRendererProps<P, F>) {
    const {
        id,
        type,
        path,
        data,
        width,
        height,
        defaults = {},
        config = {},
        onConfigChange = () => {},
        children,
        ...rest
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

    console.log('WidgetComponent', id, defaults, config)

    return (
        <div>
            {DEBUG && id}
            <ErrorBoundary>
                <WidgetComponent
                    id={id ?? '0'}
                    path={path}
                    data={data}
                    // data={dataWithOverrides}
                    // title={title}
                    // transparent={false}
                    // width={width}
                    // height={height}
                    // renderCounter={0}
                    // replaceVariables={(str: string) => str}
                    //
                    defaults={defaults}
                    config={config}
                    onConfigChange={onConfigChange}
                    //
                    // fieldConfig={fieldConfig}
                    // onFieldConfigChange={onFieldConfigChange}
                    //
                    // onOrderChange=(oldIndex, newIndex) {}
                    // eventBus={appEvents}
                    {...rest}
                >
                    {children}
                </WidgetComponent>
            </ErrorBoundary>
        </div>
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
