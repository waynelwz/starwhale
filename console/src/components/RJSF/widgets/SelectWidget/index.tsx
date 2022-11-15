import React from 'react'
import { processSelectValue, WidgetProps } from '@rjsf/utils'
import { SelectProps, SIZE } from 'baseui/select'
import Select from '@/components/Select'

const SELECT_STYLE = {
    width: '100%',
    minWidth: '280px',
}

const SelectWidget = ({
    autofocus,
    disabled,
    formContext,
    id,
    multiple,
    onBlur,
    onChange,
    onFocus,
    options,
    placeholder,
    readonly,
    schema,
    value,
}: WidgetProps) => {
    const { readonlyAsDisabled = true } = formContext

    const { enumOptions, enumDisabled } = options

    const handleChange = (nextValue: any) =>
        onChange(processSelectValue(schema, nextValue?.option?.id as string, options))

    const handleBlur = () => onBlur(id, processSelectValue(schema, value, options))

    const handleFocus = () => onFocus(id, processSelectValue(schema, value, options))

    const stringify = (currentValue: any) =>
        Array.isArray(currentValue) ? value.map((v: any) => ({ id: String(v) })) : [{ id: String(value) }]

    // Antd's typescript definitions do not contain the following props that are actually necessary and, if provided,
    // they are used, so hacking them in via by spreading `extraProps` on the component to avoid typescript errors
    const extraProps = {
        name: id,
    }
    const $options = React.useMemo(() => {
        if (!Array.isArray(enumOptions)) return []
        return enumOptions.map(({ value: optionValue, label: optionLabel }) => {
            return {
                id: optionValue,
                label: optionLabel,
            }
        })
    }, [enumOptions, value])

    return (
        <Select
            multi={multiple}
            overrides={{
                ControlContainer: {
                    style: {
                        ...SELECT_STYLE,
                    },
                },
            }}
            size={SIZE.compact}
            autoFocus={autofocus}
            disabled={disabled || (readonlyAsDisabled && readonly)}
            id={id}
            onBlur={!readonly ? handleBlur : undefined}
            onChange={!readonly ? handleChange : undefined}
            onFocus={!readonly ? handleFocus : undefined}
            placeholder={placeholder}
            value={typeof value !== 'undefined' ? stringify(value) : undefined}
            options={$options}
            {...extraProps}
        />
    )
}

SelectWidget.defaultProps = {
    formContext: {},
}

export default SelectWidget
