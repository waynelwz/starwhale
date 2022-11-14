import Form from '@rjsf/core'
import { RJSFSchema, UiSchema } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'

const schema: RJSFSchema = {
    // title: 'My title',
    // description: 'My description',
    type: 'object',
    properties: {
        selectWidgetOptions: {
            title: 'Custom select widget with options, overriding the enum titles.',
            type: 'string',
            oneOf: [
                {
                    const: 'foo',
                    title: 'Foo',
                },
                {
                    const: 'bar',
                    title: 'Bar',
                },
            ],
        },
    },
    //   "required": ["name"],
    //   "dependencies": {
    //     "credit_card": ["billing_address"]
    //   }
}
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

export function WidgetEditForm() {
    return (
        <Form
            schema={schema}
            uiSchema={uiSchema}
            formData={formData}
            validator={validator}
            // onChange={(e) => setFormData(e.formData)}
        />
    )
}
