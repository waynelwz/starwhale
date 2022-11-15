import Widgets from '@/components/RJSF/widgets'
import Form from '@rjsf/core'
import { RegistryWidgetsType, RJSFSchema, UiSchema } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'
import WidgetFactory from '../Widget/WidgetFactory'

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
    console.log('panels', WidgetFactory.getPanels())

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
