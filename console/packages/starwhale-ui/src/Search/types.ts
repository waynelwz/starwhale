import { FilterTypeOperators, KIND, OPERATOR } from './constants'
import { ColumnSchemaDesc } from '@starwhale/core/datastore'

export type KindT = keyof typeof KIND

export type FilterSharedPropsT = {
    isDisabled?: boolean
    isEditing?: boolean
}

export interface FilterPropsT extends FilterSharedPropsT {
    value?: ValueT
    onChange?: (newValue: ValueT) => void
    fields: ColumnSchemaDesc[]
}

export type ValueT = {
    property?: string
    op?: string
    value?: any
}

export type FilterValueT = {
    data: ValueT
} & FilterSharedPropsT

export type OperatorT = {
    label: string
    value: string
    key?: string
    buildFilter?: (args: FilterValueT) => (data: any) => any
}

export type FilterT = {
    key?: string
    label?: string
    kind: KindT
    operators: OPERATOR[]

    // buildFilter?: (args: FilterValueT<ValueT>) => (data: any) => any
    renderField?: (args: FilterPropsT) => React.ReactNode
    renderFieldValue?: (args: FilterPropsT) => React.ReactNode
    renderOperator?: (args: FilterPropsT) => React.ReactNode
}
