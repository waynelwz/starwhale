import Widgets from '@/components/RJSF/widgets'
import Form from '@rjsf/core'
import { RegistryWidgetsType, RJSFSchema, UiSchema } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'
import WidgetFactory from '../Widget/WidgetFactory'
import useDatastoreTables from '../datastore/useDatastoreTables'

const uiSchema: UiSchema = {
    name: {
        classNames: 'custom-class-name',
        // "ui:widget": "radio" // could also be "select"
    },
    age: {
        classNames: 'custom-class-age',
    },
    tableName: {
        'ui:widget': 'SelectWidget',
    },
    // 'ui:order': ['bar', '*'],
    // "ui:options":  {
    //     expandable: false
    //   }
}

const formData = {
    title: 'First task',
    done: true,
}

export function WidgetEditForm({ formData, onChange }) {
    // 0165a7ec2b994458b79b016d72cf6394
    const { tables = [] } = useDatastoreTables('starwhale', '90138e6fde2a480888531526b7b65dfe')
    console.log('panels', WidgetFactory.getPanels(), tables)

    const panels = WidgetFactory.getPanels()
    if (panels.length === 0) return <></>

    const tableName = {
        type: 'string',
        oneOf:
            tables.map((v) => ({
                const: v.name,
                title: v.short,
            })) ?? [],
    }
    const multiTableName = {
        type: 'array',
        uniqueItems: true,
        items: {
            type: 'object',
            oneOf:
                tables.map((v) => ({
                    const: v.name,
                    title: v.short,
                })) ?? [],
        },
    }

    const tableNameSchema = tableName // formData.chartType === 'ui:panel:table' ? tableName : multiTableName

    const schema: RJSFSchema = {
        // title: 'My title',
        // description: 'My description',
        type: 'object',
        properties: {
            chartType: {
                type: 'string',
                oneOf:
                    WidgetFactory.getPanels().map((v) => ({
                        const: v.type,
                        title: v.name,
                    })) ?? [],
            },
            tableName: { ...tableNameSchema },
            chartTitle: {
                type: 'string',
            },
        },
        //   "required": ["name"],
        //   "dependencies": {
        //     "credit_card": ["billing_address"]
        //   }
    }
    return (
        <Form
            schema={schema}
            widgets={Widgets}
            uiSchema={uiSchema}
            formData={formData}
            validator={validator}
            onChange={(e) => onChange?.(e.formData)}
        />
    )
}
