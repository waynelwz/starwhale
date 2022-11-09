import React from 'react'
import useSelector, { getWidget } from '../hooks/useSelector'
import BaseWidget from './BaseWidget'

export default function withWidgetProps(WrappedWidget: typeof BaseWidget) {
    function WrapedPropsWidget(props: any) {
        // todo
        // * add log state
        // * onFieldConfigChange
        const { id, ...rest } = props
        const state = useSelector(getWidget(id)) ?? {}

        console.log('WrapedPropsWidget', typeof WrappedWidget, id, props, state)

        return <WrappedWidget {...props} config={state} />
    }
    return WrapedPropsWidget
}
