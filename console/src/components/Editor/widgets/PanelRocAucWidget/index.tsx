import BusyPlaceholder from '@/components/BusyLoaderWrapper/BusyPlaceholder'
import { getRocAucConfig } from '@/components/Indicator/utils'
import { useParseRocAuc } from '@/domain/datastore/hooks/useParseDatastore'
import React, { useCallback, useState } from 'react'
import { WidgetProps, WidgetRendererProps } from '../../Widget/const'
import WidgetPlugin from '../../Widget/WidgetPlugin'
const PlotlyVisualizer = React.lazy(
    () => import(/* webpackChunkName: "PlotlyVisualizer" */ '@/components/Indicator/PlotlyVisualizer')
)

export const CONFIG = {
    type: 'ui:panel:rocauc',
    group: 'panel',
    name: 'Roc Auc',
}

function PanelTableWidget(props: WidgetRendererProps<any, any>) {
    console.log('PanelTableWidget', props)

    const { defaults, config, children, columnTypes, records } = props
    const name = config?.name ?? defaults?.name

    const rocAucData = useParseRocAuc({ records })
    const data = getRocAucConfig(name, [], rocAucData)

    return (
        <React.Suspense fallback={<BusyPlaceholder />}>
            <PlotlyVisualizer data={data} />
        </React.Suspense>
    )
}

const widget = new WidgetPlugin<any, any>(PanelTableWidget)

export default widget
