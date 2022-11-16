import BusyPlaceholder from '@/components/BusyLoaderWrapper/BusyPlaceholder'
import { getRocAucConfig } from '@/components/Indicator/utils'
import { useParseRocAuc } from '@/domain/datastore/hooks/useParseDatastore'
import React, { useCallback, useState } from 'react'
import { WidgetConfig, WidgetProps, WidgetRendererProps } from '../../Widget/const'
import WidgetPlugin from '../../Widget/WidgetPlugin'

const PlotlyVisualizer = React.lazy(
    () => import(/* webpackChunkName: "PlotlyVisualizer" */ '@/components/Indicator/PlotlyVisualizer')
)

export const CONFIG: WidgetConfig = {
    type: 'ui:panel:rocauc',
    group: 'panel',
    name: 'Roc Auc',
}

function PanelRocAucWidget(props: WidgetRendererProps<any, any>) {
    console.log('PanelRocAucWidget', props)

    const { defaults, config, children, data = {} } = props
    const { columnTypes = [], records = [] } = data

    const name = config?.name ?? defaults?.name

    const rocAucData = useParseRocAuc({ records })
    const vizData = getRocAucConfig(name, [], rocAucData)

    return (
        <React.Suspense fallback={<BusyPlaceholder />}>
            <PlotlyVisualizer data={vizData} />
        </React.Suspense>
    )
}

const widget = new WidgetPlugin(PanelRocAucWidget, CONFIG)

export default widget
