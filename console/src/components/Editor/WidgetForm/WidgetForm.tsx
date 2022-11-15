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
    const { tables } = useDatastoreTables('mnist-exp', '880e369d971d40b6ad08c6197fc3323a')
    console.log('panels', WidgetFactory.getPanels(), tables)

    const panels = WidgetFactory.getPanels()
    if (panels.length === 0) return <></>

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
            tableName: {
                type: 'string',
                oneOf:
                    tables.map((v) => ({
                        const: v.name,
                        title: v.short,
                    })) ?? [],
            },
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
