import BusyPlaceholder from '@/components/BusyLoaderWrapper/BusyPlaceholder'
import { getHeatmapConfig, getRocAucConfig } from '@/components/Indicator/utils'
import { useParseConfusionMatrix, useParseRocAuc } from '@/domain/datastore/hooks/useParseDatastore'
import React, { useCallback, useState } from 'react'
import { WidgetConfig, WidgetProps, WidgetRendererProps } from '../../Widget/const'
import WidgetPlugin from '../../Widget/WidgetPlugin'

const PlotlyVisualizer = React.lazy(
    () => import(/* webpackChunkName: "PlotlyVisualizer" */ '@/components/Indicator/PlotlyVisualizer')
)

export const CONFIG: WidgetConfig = {
    type: 'ui:panel:heatmap',
    group: 'panel',
    name: 'Heatmap',
}

function PanelHeatmapWidget(props: WidgetRendererProps<any, any>) {
    console.log('PanelHeatmapWidget', props)

    const { defaults, config, children, data = {} } = props
    const { columnTypes = [], records = [] } = data

    const name = config?.name ?? defaults?.name

    const { labels, binarylabel } = useParseConfusionMatrix(data)
    const heatmapData = getHeatmapConfig(name, labels, binarylabel)

    console.log(heatmapData)

    return (
        <React.Suspense fallback={<BusyPlaceholder />}>
            <PlotlyVisualizer data={heatmapData} />
        </React.Suspense>
    )
}

const widget = new WidgetPlugin(PanelHeatmapWidget, CONFIG)

export default widget
