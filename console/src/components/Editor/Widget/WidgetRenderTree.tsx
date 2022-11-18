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
import { fetchPanelSetting, updatePanelSetting } from '@/domain/panel/services/panel'
import { useParams } from 'react-router'
import { toaster } from 'baseui/toast'
import { useFetchPanelSetting } from '../../../domain/panel/hooks/useSettings'

export const WrapedWidgetNode = withWidgetDynamicProps(function WidgetNode(props: any) {
    const { childWidgets, path } = props
    return (
        <WidgetRenderer {...props}>
            {childWidgets &&
                childWidgets.length > 0 &&
                childWidgets.map(({ children: childChildren, ...childRest }, i) => (
                    <WrapedWidgetNode
                        key={[...path, 'children', i]}
                        path={[...path, 'children', i]}
                        childWidgets={childChildren}
                        {...childRest}
                    />
                ))}
        </WidgetRenderer>
    )
})

enum PanelEditAction {
    ADD = 'add-panel',
    EDIT = 'edit-panel',
}

export function WidgetRenderTree() {
    const { projectId, jobId } = useParams<{ projectId: string; jobId: string }>()
    const { store, eventBus } = useEditorContext()
    const api = store()
    const tree = store((state) => state.tree, deepEqual)
    const [editWidget, setEditWidget] = useState<{ type: PanelEditAction; payload: any }>(null)
    const [isPanelModalOpen, setisPanelModalOpen] = React.useState(false)
    const key = `evaluation/${jobId}`

    console.log('Tree', tree)

    // useBusEvent(eventBus, { type: 'add-panel' }, (evt) => {
    //     console.log(evt)
    // })

    const handleAddSection = ({ path, type }) => {
        api.onLayoutChildrenChange(['tree', ...path], ['tree', ...path, 'children'], {
            type,
        })
    }

    const handleAddPanel = (formData: any) => {
        const { path } = editWidget?.payload
        if (path && path.length > 0)
            api.onLayoutChildrenChange(['tree', ...path], ['tree', ...path, 'children'], {
                type: formData.chartType,
                fieldConfig: {
                    data: formData,
                },
            })
    }

    const handleEditPanel = (formData: any) => {
        const { id } = editWidget?.payload
        api.onWidgetChange(id, {
            type: formData.chartType,
            fieldConfig: {
                data: formData,
            },
        })
    }

    const actions = {
        [PanelEditAction.ADD]: handleAddPanel,
        [PanelEditAction.EDIT]: handleEditPanel,
    }

    // use  api store
    const setting = useFetchPanelSetting(projectId, key)
    useEffect(() => {
        if (setting.data) {
            try {
                const data = JSON.parse(setting.data)
                console.log('-----', data, data.time, store.getState().time)
                if (store.getState().time < data?.time) store.setState(data)
            } catch (e) {
                console.log(e)
            }
        }
    }, [setting])

    // subscription
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
        subscription.add(
            eventBus.getStream({ type: 'save' }).subscribe({
                next: async (evt) => {
                    try {
                        store.setState({
                            time: Date.now(),
                        })
                        await updatePanelSetting(projectId, key, store.getState())
                        toaster.positive('Panel setting saved')
                    } catch (e) {
                        console.log(e)
                    }
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
                handleFormSubmit={({ formData }: any) => {
                    actions[editWidget.type]?.(formData)
                    setisPanelModalOpen(false)
                }}
            />
        </div>
    )
}

export default WidgetRenderTree
