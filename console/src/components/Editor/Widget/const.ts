import { WidgetStoreState, WidgetTreeNode } from "../context/store"

export type WidgetType = string

export interface WidgetBaseProps {
    widgetId: string
    type: WidgetType
    widgetName: string
    parentId?: string
    version: number
    childWidgets?: WidgetTreeNode[]
}

export interface WidgetProps extends WidgetBaseProps {}
    

export type WidgetState = Record<string, unknown>;
export interface WidgetBuilder<
  T extends WidgetProps,
  S extends WidgetState
> {
  buildWidget(widgetProps: T): JSX.Element;

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
