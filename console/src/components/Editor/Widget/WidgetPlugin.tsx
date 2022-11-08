import React, { Component, ReactNode } from 'react'
import { EditorContext } from '../context/EditorContextProvider'
import BaseWidget from './BaseWidget'
import { WidgetProps } from './const'
export type WidgetState = Record<string, unknown>

class WidgetPlugin<T extends WidgetProps, K extends WidgetState> extends BaseWidget<T, K> {
    constructor() {
        super()
    }
}

export default WidgetPlugin
