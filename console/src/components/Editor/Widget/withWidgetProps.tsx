import React from 'react'
import useSelector, { getWidget } from '../hooks/useSelector'
import BaseWidget from './BaseWidget'

export default function withWidgetProps(WrappedWidget: typeof BaseWidget) {
    return function WrapedPropsWidget(props: any) {
        // todo
        // * add log state
        // * onFieldConfigChange
        const { id } = props
        const state = useSelector(getWidget(id)) ?? {}

        return <WrappedWidget {...props} {...state} />
    }
}
