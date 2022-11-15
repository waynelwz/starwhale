import React from 'react'
import { WidgetProps } from './const'
import log from 'loglevel'
import WidgetPlugin from './WidgetPlugin'
import config from '../../../../playwright/playwright.config'
export type DerivedPropertiesMap = Record<string, string>
export type WidgetType = typeof WidgetFactory.widgetTypes[number]
export type WidgetConfigProps = Record<string, unknown>
export type WidgetConfig = Partial<WidgetProps> & WidgetConfigProps & { type: string }
export interface WidgetCreationException {
    message: string
}

class WidgetFactory {
    static widgetTypes: Record<string, string> = {}
    static widgetMap: Map<WidgetType, WidgetPlugin> = new Map()
    static widgetConfigMap: Map<WidgetType, Partial<WidgetProps> & WidgetConfigProps & { type: string }> = new Map()

    static register(widgetType: string, widget: WidgetPlugin, defaultConfig: WidgetConfig) {
        if (!this.widgetTypes[widgetType]) {
            this.widgetTypes[widgetType] = widgetType
            this.widgetMap.set(widgetType, widget)
            this.widgetConfigMap.set(widgetType, Object.freeze(defaultConfig))
        }
    }

    static updateWidgetConfig(widgetType: string, config: WidgetConfig) {
        this.widgetConfigMap.set(widgetType, Object.freeze(config))
    }

    static getWidgetTypes(): WidgetType[] {
        return Array.from(this.widgetMap.keys())
    }

    static getPanels() {
        return Array.from(this.widgetConfigMap.values()).filter((config) => config.group === 'panel')
    }
}

export default WidgetFactory
