import React from 'react'
import { RecordSchemaT, isComplexType } from '@starwhale/core/datastore'
import _ from 'lodash'
import { getSummary } from '@starwhale/core/dataset'

export class RecordAttr {
    type: string
    name: string
    value: any

    constructor(
        data: RecordSchemaT,
        public record: Record<string, RecordSchemaT>,
        protected decode?: ReturnType<typeof getSummary>
    ) {
        this.type = data?.type ?? ''
        this.name = data?.name ?? ''
        this.value = data?.value ?? ''
    }

    toString() {
        return ''
    }

    get summary() {
        return this.decode?.summary
    }

    get summaryTypes() {
        return this.decode?.summaryTypes
    }

    static decode(record: Record<string, RecordSchemaT>, key: string, options: any = {}) {
        const data = record?.[key]
        const type = data?.type
        if (isComplexType(type)) {
            const decode = getSummary(record, {
                parseLink: options.parseLink,
                showPrivate: false,
                showLink: false,
            })
            return new RecordComplexAttr(data, record, decode)
        }

        return new RecordBasicAttr(data, record)
    }
}

export class RecordBasicAttr extends RecordAttr {
    constructor(data: RecordSchemaT, record: Record<string, RecordSchemaT>) {
        super(data, record)
    }

    toString() {
        return this.value ?? ''
    }
}

export class RecordComplexAttr extends RecordAttr {
    constructor(data: RecordSchemaT, record: Record<string, RecordSchemaT>, decode: ReturnType<typeof getSummary>) {
        super(data, record, decode)
    }

    toString() {
        return JSON.stringify(this.value, null, 2)
    }
}
