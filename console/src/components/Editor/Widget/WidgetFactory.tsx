import React from 'react'
import { WidgetBuilder, WidgetProps, WidgetState } from './const'
import log from 'loglevel'
export type DerivedPropertiesMap = Record<string, string>
export type WidgetType = typeof WidgetFactory.widgetTypes[number]
export type WidgetConfigProps = Record<string, unknown>
export interface WidgetCreationException {
    message: string
}

class WidgetFactory {
    static widgetTypes: Record<string, string> = {}
    static widgetMap: Map<WidgetType, WidgetBuilder<WidgetProps, WidgetState>> = new Map()
    static widgetConfigMap: Map<WidgetType, Partial<WidgetProps> & WidgetConfigProps & { type: string }> = new Map()

    static registerWidgetBuilder(widgetType: string, widgetBuilder: WidgetBuilder<WidgetProps, WidgetState>) {
        if (!this.widgetTypes[widgetType]) {
            this.widgetTypes[widgetType] = widgetType
            this.widgetMap.set(widgetType, widgetBuilder)
        }
    }

    static storeWidgetConfig(widgetType: string, config: Partial<WidgetProps> & WidgetConfigProps & { type: string }) {
        this.widgetConfigMap.set(widgetType, Object.freeze(config))
    }

    static createWidget(widgetData: WidgetProps): React.ReactNode {
        const widgetProps = {
            key: widgetData.widgetId,
            isVisible: true,
            ...widgetData,
        }
        const widgetBuilder = this.widgetMap.get(widgetData.type)
        if (widgetBuilder) {
            const widget = widgetBuilder.buildWidget(widgetProps)
            return widget
        } else {
            const ex: WidgetCreationException = {
                message: 'Widget Builder not registered for widget type' + widgetData.type,
            }
            log.error(ex)
            return null
        }
    }

    static getWidgetTypes(): WidgetType[] {
        return Array.from(this.widgetMap.keys())
    }
}

export default WidgetFactory
