import { traceCreator, useEventCallback } from '@starwhale/core'
import React, { useReducer } from 'react'
import { ValueT } from './types'

enum ActionType {
    setIsEditing = 'setIsEditing',
    setEditingIndex = 'setEditingIndex',
    setItems = 'setItems',
    setFocusTarget = 'setFocusTarget',
    setFocusValues = 'setFocusValues',
    createItem = 'createItem',
    updateItem = 'updateItem',
    removeItem = 'removeItem',
    reset = 'reset',
}

// type FilterValueT = { type: string; value: any }
// const initialFocusState = {
//     focusedRemoving: false,
//     focusedTarget: 0,
//     focusedValues: [] as FilterValueT[],
//     focusedResetValues: [] as FilterValueT[],
// }

const initialState = {
    isEditing: false,
    items: [] as ValueT,
    // editing item status
    editingIndex: null,
}

const isValueExist = (value: any) => {
    if (value === 0) return true
    return !!value
}

const trace = traceCreator('search-state')

const reducer = (state, action) => {
    let next = { ...state }
    switch (action.type) {
        case ActionType.setIsEditing:
            next = {
                ...state,
                isEditing: action.payload,
            }
            break
        case ActionType.setEditingIndex:
            next = {
                ...state,
                editingIndex: action.payload.index,
            }
            break
        case ActionType.setItems:
            next = {
                ...state,
                items: action.payload,
            }
            break
        case ActionType.setFocusTarget:
            next = {
                ...state,
                focusedTarget: action.payload,
            }
            break
        case ActionType.setFocusValues:
            next = {
                ...state,
                focusedValues: action.payload,
            }
            break
        case ActionType.createItem: {
            const { value, onChange } = action.payload
            let newItems = [...state.items]
            newItems.push(value)
            newItems = newItems.filter((tmp) => tmp && tmp.property && tmp.op && isValueExist(tmp.value))
            next = {
                ...state,
                items: newItems,
            }
            onChange?.(newItems)
            break
        }
        // confirm then move to lastest edit
        case ActionType.updateItem: {
            const { index, value, onChange } = action.payload
            let newItems: any[] = []
            if (!value) {
                newItems = state.items.filter((key, i) => i !== index)
            } else {
                newItems = state.items.map((tmp, i) => (i === index ? value : tmp))
            }
            newItems = newItems.filter((tmp) => tmp && tmp.property && tmp.op && isValueExist(tmp.value))
            next = {
                ...state,
                items: newItems,
                editingIndex: -1,
            }
            onChange?.(newItems)
            break
        }
        // remove
        case ActionType.removeItem: {
            const { index, blur, onChange } = action.payload
            const newItems = [...state.items]
            newItems.splice(index, 1)
            next = {
                ...state,
                items: newItems,
                editingIndex: state.editingIndex - 1,
                isEditing: !blur,
            }
            onChange?.(newItems)
            break
        }
        case ActionType.reset: {
            const { items } = action.payload
            next = {
                ...initialState,
                items,
            }
            break
        }
        default:
            throw new Error('Unexpected action')
    }
    trace('✅', { type: action.type }, action.payload, { next })
    return next
}

function useSearchState({ onChange }) {
    const [state, dispatch] = useReducer(reducer, initialState)

    const focusToEnd = React.useCallback(() => {
        if (state.editingIndex === -1) return
        dispatch({ type: ActionType.setEditingIndex, payload: { index: -1 } })
    }, [state.editingIndex])

    const focusToPrevItem = React.useCallback(() => {
        const index = state.items.length - 1
        dispatch({ type: ActionType.setEditingIndex, payload: { index } })
    }, [state.items])

    const onFocus = React.useCallback(
        (index) => {
            if (state.editingIndex === index) return
            dispatch({ type: ActionType.setEditingIndex, payload: { index } })
        },
        [state.editingIndex]
    )

    const checkIsFocus = React.useCallback(
        (index) => {
            if (!state.isEditing) return false
            return state.editingIndex === index
        },
        [state]
    )

    const setIsEditing = React.useCallback(
        (isEditing) => {
            if (state.isEditing === isEditing) return
            dispatch({ type: ActionType.setIsEditing, payload: isEditing })
        },
        [state]
    )

    const setEditingIndex = React.useCallback((index) => {
        dispatch({ type: ActionType.setEditingIndex, payload: { index } })
    }, [])

    const onRemove = useEventCallback((index) => {
        dispatch({
            type: ActionType.removeItem,
            payload: {
                index,
                blur: false,
                onChange,
            },
        })
    })

    const onRemoveThenBlur = useEventCallback((index) => {
        dispatch({
            type: ActionType.removeItem,
            payload: {
                index,
                blur: true,
                onChange,
            },
        })
    })

    const onItemCreate = useEventCallback((newValue: any) => {
        dispatch({
            type: ActionType.createItem,
            payload: {
                value: newValue,
                onChange,
            },
        })
    })

    const onItemChange = useEventCallback((index, newValue: any) => {
        dispatch({
            type: ActionType.updateItem,
            payload: {
                index,
                value: newValue,
                onChange,
            },
        })
    })

    const setItems = React.useCallback((items) => {
        dispatch({
            type: ActionType.setItems,
            payload: items,
        })
    }, [])

    const reset = React.useCallback((tmp) => {
        dispatch({
            type: ActionType.reset,
            payload: { items: tmp },
        })
    }, [])

    return {
        ...state,
        focusToEnd,
        focusToPrevItem,
        onFocus,
        checkIsFocus,
        setIsEditing,
        setEditingIndex,
        onRemove,
        onRemoveThenBlur,
        onItemCreate,
        onItemChange,
        reset,
        setItems,
        dispatch,
    }
}

export { ActionType }

export default useSearchState
