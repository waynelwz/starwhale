import _ from 'lodash'
import { PANEL_DYNAMIC_MATCHES, replacer } from '../utils/replacer'
import { useDeepEffect } from '../../utils/useDeepEffects'
import { tranformState } from '../utils'
import React from 'react'
import produce from 'immer'
import { useStore, useStoreApi } from '@starwhale/core/store'
import shallow from 'zustand/shallow'

const selector = (s: any) => ({
    initialState: s.initialState,
})

export default function useRestoreState(dynamicVars: Record<string, any>) {
    const { initialState } = useStore(selector, shallow)
    const store = useStoreApi()

    const toSave = React.useCallback(() => {
        let data = store.getState()
        Object.keys(data?.widgets).forEach((id) => {
            data = produce(data, (temp) => {
                _.set(temp.widgets, id, replacer(PANEL_DYNAMIC_MATCHES).toTemplate(temp.widgets[id]))
            })
        })

        return data
    }, [store])

    // use  api store
    const inited = React.useRef(false)
    useDeepEffect(() => {
        if (!initialState) return
        if (inited.current) return

        // @FIXME check this
        // const novalidVars = PANEL_DYNAMIC_MATCHES.find((match) => !(match.injectKey in dynamicVars))
        // if (novalidVars) {
        //     // eslint-disable-next-line no-console
        //     // console.warn('missing vars', novalidVars)
        //     return
        // }

        try {
            let data = typeof initialState === 'string' ? JSON.parse(initialState) : initialState

            // for origin data
            const isOrigin = !_.get(data, 'tree.0.id')
            if (isOrigin) data = tranformState(data)

            Object.keys(data?.widgets).forEach((id) => {
                const origin = replacer(PANEL_DYNAMIC_MATCHES).toOrigin(data.widgets[id], dynamicVars)
                _.set(data.widgets, id, origin)
            })

            store.getState().setRawConfigs(data)
            inited.current = true
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e)
        }
    }, [initialState, dynamicVars])

    return {
        toSave,
    }
}
