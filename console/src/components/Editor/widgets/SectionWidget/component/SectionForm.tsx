import React, { useCallback, useEffect, useState } from 'react'
import { createForm } from '@/components/Form'
import { Input } from 'baseui/input'
import useTranslation from '@/hooks/useTranslation'
import { isModified } from '@/utils'
import { RadioGroup, Radio, ALIGN } from 'baseui/radio'
import Button from '@/components/Button'
import { ICreateModelSchema } from '@/domain/model/schemas/model'

const { Form, FormItem } = createForm<ICreateModelSchema>()

export default function SectionForm({ formData = {}, onSubmit }) {
    const [values, setValues] = useState<any | undefined>(formData)

    console.log(values, formData)
    useEffect(() => {
        if (!formData) {
            return
        }
        setValues({
            name: formData?.name,
        })
    }, [formData?.name])

    const [loading, setLoading] = useState(false)

    const handleValuesChange = useCallback((_changes, values_) => {
        setValues(values_)
    }, [])

    const handleFinish = useCallback(
        async (values_) => {
            setLoading(true)
            try {
                await onSubmit(values_)
            } finally {
                setLoading(false)
            }
        },
        [onSubmit]
    )

    const [t] = useTranslation()

    return (
        <Form initialValues={values} onFinish={handleFinish} onValuesChange={handleValuesChange}>
            <FormItem name='name' label={'Name'}>
                <Input size='compact' />
            </FormItem>
            <FormItem>
                <div style={{ display: 'flex' }}>
                    <div style={{ flexGrow: 1 }} />
                    <Button isLoading={loading}>{t('submit')}</Button>
                </div>
            </FormItem>
        </Form>
    )
}
