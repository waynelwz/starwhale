import { WidgetStoreState, WidgetTreeNode } from '../context/store'
import { WidgetConfig, WidgetType } from './WidgetFactory'

export type WidgetMeta = Record<string, unknown>

export interface WidgetBase {
    type: WidgetType
    name: string
}

export interface WidgetConfigProps {
    defaults?: WidgetConfig
    meta?: WidgetMeta
    config: WidgetConfig
}

export interface WidgetBaseProps {
    // @FIXME namepath
    id: string
    path?: any[]
    childWidgets?: WidgetTreeNode[]
}

export interface WidgetActions {
    onOrderChange?: () => any
}

export type WidgetProps = WidgetBase & WidgetBaseProps & WidgetActions

/**
 * Describes the properties that can be passed to the PanelRenderer.
 *
 * @typeParam P - Panel options type for the panel being rendered.
 * @typeParam F - Field options type for the panel being rendered.
 *
 * @internal
 */
export interface WidgetRendererProps<P extends object = any, F extends object = any> {
    id: string
    type: string
    data?: any
    options?: Partial<P>
    onOptionsChange?: (options: P) => void
    // onFieldConfigChange?: (config: FieldConfigSource<F>) => void
    // fieldConfig?: FieldConfigSource<Partial<F>>
    // timeZone?: string
    width: number
    height: number
}

export type WidgetRendererType<P extends object = any, F extends object = any> = React.ComponentType<
    WidgetRendererProps<P, F>
>

// export type WidgetState = Record<string, unknown>
// export interface WidgetBuilder<
//   T extends WidgetProps,
//   S extends WidgetState
// > {
//   buildWidget(widgetProps: T): JSX.Element;
// }
// type ISection = {
// 	id: string // section-xfasddf
// 	name: string,
// 	type: 'section'
// 	isOpen: boolean,
//   // is expaned
// 	isExpaned: boolean,
//   // section order
// 	order: number,
// 	panels: IPanel[]
// }

// type ILayout = {}
// type ILayoutGrid = {
// 	// layout
// 	type: 'grid' | 'draggble-layout'
// 	custom: true,
// 	layoutConfig: {
// 		gutter: number,
// 		columnsPerPage: number,
// 		rowsPerPage: number,
// 		boxWidth: number,
// 		heightWidth: number,
// 	}
// }

// type IPanel = {
// 	type: 'data table' | 'line chart' | 'heatmap',
// 	id: '',
// 	name: '',
// 	description: '',
// 	dataStore: [
// 		{ tableName, records}
// 	],
// 	title: ''
// }

// type IPanelPlugin = {

// }

// type IDataSource = {

// }
