import React, { Component, ComponentType, ReactNode } from 'react'
import { EditorContext } from '../context/EditorContextProvider'
import { WidgetMeta, WidgetProps } from './const'
import { WidgetConfigProps } from './WidgetFactory'
export type WidgetState = Record<string, unknown>

class BaseWidget<T extends WidgetMeta = WidgetMeta> {
    static contextType = EditorContext
    declare context: React.ContextType<typeof EditorContext>
    meta?: T
    // abstract getPageView(): ReactNode
}

class WidgetPlugin<
    T extends WidgetProps = WidgetProps,
    S extends WidgetConfigProps = WidgetConfigProps
> extends BaseWidget<WidgetMeta> {
    renderer: ComponentType<T> | null

    private _defaults: WidgetConfigProps = {}
    private _overrides: WidgetConfigProps = {}

    constructor(renderer: ComponentType<T>) {
        super()
        this.renderer = renderer
    }

    addConfig(config: any) {
        this._defaults = config
        return this
    }

    get defaults() {
        return this._defaults
    }

    get type() {
        return this._defaults.type
    }
}

export default WidgetPlugin
