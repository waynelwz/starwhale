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
 * @typeParam C - Config type for the widget being rendered.
 * @typeParam F - Field options type for the widget being rendered.
 *
 * @internal
 */
export interface WidgetRendererProps<C extends object = any, F extends object = any> {
    id: string
    type: string
    data?: any
    defaults?: Partial<C>
    config?: Partial<C>
    onConfigChange?: (options: C) => void
    onOrderChange?: (oldIndex: number, newIndex: number) => void
    onChildrenAdd?: (widgets: any) => void
    // onFieldConfigChange?: (config: FieldConfigSource<F>) => void
    // fieldConfig?: FieldConfigSource<Partial<F>>
    // timeZone?: string
    width: number
    height: number
    children?: React.ReactNode
}

export type WidgetRendererType<C extends object = any, F extends object = any> = React.ComponentType<
    WidgetRendererProps<C, F>
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
