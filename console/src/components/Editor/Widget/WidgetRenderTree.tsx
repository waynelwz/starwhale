import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useEditorContext } from '../context/EditorContextProvider'
import withWidgetDynamicProps from './withWidgetDynamicProps'
import deepEqual from 'fast-deep-equal'
import { WidgetRenderer } from '../Widget/WidgetRenderer'
import { Modal, ModalBody, ModalHeader } from 'baseui/modal'
import useTranslation from '@/hooks/useTranslation'
import useSelector, { getWidget } from '../hooks/useSelector'
import WidgetFormModel from '../WidgetForm/WidgetFormModel'
import { Subscription } from 'rxjs'
import { useBusEvent } from '../events/useBusEvent'
import { getTreePath } from '../utils/path'

export const WrapedWidgetNode = withWidgetDynamicProps(function WidgetNode(props: any) {
    const { childWidgets, path } = props
    return (
        <WidgetRenderer {...props}>
            {childWidgets &&
                childWidgets.length > 0 &&
                childWidgets.map(({ children: childChildren, ...childRest }, i) => (
                    <WrapedWidgetNode path={[...path, 'children', i]} childWidgets={childChildren} {...childRest} />
                ))}
        </WidgetRenderer>
    )
})

export function WidgetRenderTree() {
    const { store, eventBus } = useEditorContext()
    const api = store()
    const tree = store((state) => state.tree, deepEqual)
    const [editWidget, setEditWidget] = useState(null)
    const [isPanelModalOpen, setisPanelModalOpen] = React.useState(false)

    console.log('Tree', tree, editWidget)

    // useBusEvent(eventBus, { type: 'add-panel' }, (evt) => {
    //     console.log(evt)
    // })

    const handleAddSection = ({ path, type }) => {
        api.onLayoutChildrenChange(['tree', ...path], ['tree', ...path, 'children'], {
            type,
        })
    }

    const handleAddPanel = (formData) => {
        const { path } = editWidget?.payload
        if (path && path.length > 0)
            api.onLayoutChildrenChange(['tree', ...path], ['tree', ...path, 'children'], {
                type: formData.chartType,
                fieldConfig: {
                    data: formData,
                },
            })
    }

    const handleEditPanel = (formData) => {
        const { id } = editWidget?.payload
        api.onWidgetChange(id, {
            type: formData.chartType,
            fieldConfig: {
                data: formData,
            },
        })
    }

    const actions = {
        'add-panel': handleAddPanel,
        'edit-panel': handleEditPanel,
    }

    useEffect(() => {
        const subscription = new Subscription()
        subscription.add(
            eventBus.getStream({ type: 'add-panel' }).subscribe({
                next: (evt) => {
                    console.log(evt)
                    setisPanelModalOpen(true)
                    setEditWidget(evt)
                },
            })
        )
        subscription.add(
            eventBus.getStream({ type: 'edit-panel' }).subscribe({
                next: (evt) => {
                    console.log(evt)
                    setisPanelModalOpen(true)
                    setEditWidget(evt)
                },
            })
        )
        subscription.add(
            eventBus.getStream({ type: 'add-section' }).subscribe({
                next: (evt) => {
                    console.log(evt)
                    handleAddSection(evt.payload)
                },
            })
        )
        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const Nodes = useMemo(() => {
        return tree.map((node, i) => (
            <WrapedWidgetNode key={node.id} id={node.id} type={node.type} path={[i]} childWidgets={node.children} />
        ))
    }, [tree])

    return (
        <div>
            {Nodes}
            <WidgetFormModel
                id={editWidget?.payload?.id}
                isShow={isPanelModalOpen}
                setIsShow={setisPanelModalOpen}
                store={store}
                handleFormSubmit={({ formData }) => {
                    actions[editWidget.type]?.(formData)
                    setisPanelModalOpen(false)
                }}
            />
        </div>
    )
}

export default WidgetRenderTree
