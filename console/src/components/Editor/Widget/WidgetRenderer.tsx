import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useWidget } from './WidgetFactoryRegister'
import { WidgetProps, WidgetRendererType, WidgetRendererProps } from './const'
import { generateId } from '../utils/generators'
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'
import _ from 'lodash'

const DEBUG = true
const defaultFieldConfig = { defaults: {}, overrides: [] }
export function WidgetRenderer<P extends object = any, F extends object = any>(props: WidgetRendererProps<P, F>) {
    const {
        id,
        type,
        path,
        data,
        name,
        optionConfig = {},
        onOptionChange = () => {},
        fieldConfig = {},
        onFieldChange = () => {},
        onOrderChange = () => {},
        children,
        eventBus,
        ...rest
    } = props

    const { widget } = useWidget(type)
    const [error, setError] = useState<string | undefined>()

    if (error) {
        return <div>Failed to load widget: {error}</div>
    }

    if (!widget) {
        return <div>Loading widget...</div>
    }

    if (!widget.renderer) {
        return <div>Seems like the widget you are trying to load does not have a renderer component.</div>
    }

    // if (!data) {
    //     return <div>No datastore data</div>
    // }

    const WidgetComponent = widget.renderer
    const optionsWithDefaults = _.merge({}, widget.defaults?.optionConfig ?? {}, optionConfig)
    const fieldsWithDefaults = _.merge({}, widget.defaults?.fieldConfig ?? {}, fieldConfig)

    console.log('WidgetComponent', optionsWithDefaults)

    return (
        <div>
            {DEBUG && id}
            <ErrorBoundary>
                <WidgetComponent
                    id={id ?? '0'}
                    path={path}
                    type={type}
                    data={data}
                    // title={title}
                    // transparent={false}
                    // width={width}
                    // height={height}
                    // renderCounter={0}
                    // replaceVariables={(str: string) => str}
                    defaults={widget.defaults ?? {}}
                    optionConfig={optionsWithDefaults}
                    onOptionChange={onOptionChange}
                    //
                    fieldConfig={fieldsWithDefaults}
                    onFieldChange={onFieldChange}
                    //
                    onOrderChange={onOrderChange}
                    eventBus={eventBus}
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
