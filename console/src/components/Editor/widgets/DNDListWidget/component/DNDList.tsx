import * as React from 'react'
import type { ListProps, SharedStylePropsArgT } from 'baseui/dnd-list'
import { List, arrayMove, arrayRemove, StyledItem, StyledDragHandle } from 'baseui/dnd-list'
import Accordion from '@/components/Accordion'
import { Panel, StatefulPanel, StatelessAccordion } from 'baseui/accordion'
import { StyledListItem } from 'baseui/menu'
import IconFont from '@/components/IconFont'
import { createUseStyles } from 'react-jss'
import { expandPadding } from '@/utils'
import { StyledLabel } from 'baseui/checkbox'
import { useEditorContext } from '@/components/Editor/context/EditorContextProvider'
import useSelector, { getTree } from '../../../hooks/useSelector'
import { get, set } from 'lodash'

const useStyles = createUseStyles({
    dragHandle: {},
})

export function PanelWrapper({ children, $isDragged, ...rest }) {
    const [expanded, setExpanded] = React.useState<React.Key[]>(['P1'])

    React.useEffect(() => {
        setExpanded($isDragged ? [] : ['p1'])
    }, [$isDragged])

    console.log('PanelWrapper', $isDragged, rest, expanded)

    return (
        <StatelessAccordion
            expanded={expanded}
            onChange={({ key, expanded }) => {
                setExpanded(expanded)
            }}
        >
            <Panel key='P1' title='Panel 1' renderAll={false} expanded={false}>
                {children}
            </Panel>
        </StatelessAccordion>
    )
}

export function DragHandle({ children, ...rest }: SharedStylePropsArgT & { children: React.ReactNode }) {
    // console.log(rest)
    return (
        <StyledDragHandle
            {...rest}
            style={{
                position: 'absolute',
                margin: 'auto',
                top: '14px',
                left: 0,
                right: 0,
                zIndex: '10',
            }}
        >
            <IconFont type='drag' size={20} />
        </StyledDragHandle>
    )
}

export function Label({ children, ...rest }: SharedStylePropsArgT & { children: React.ReactNode }) {
    console.log('label', rest)
    return (
        <StyledLabel {...rest} style={{ flex: '1' }}>
            <StatefulPanel {...rest}>{children}</StatefulPanel>
        </StyledLabel>
    )
}
export const Item = React.forwardRef(({ style, ...rest }: SharedStylePropsArgT, ref) => {
    console.log(rest)
    return (
        <StyledItem
            ref={ref}
            {...rest}
            style={{ ...expandPadding('0', '0', '0', '0'), width: '100%', position: 'relative', ...style }}
        />
    )
})

export default function DNDList(props) {
    const [items, setItems] = React.useState(['Item 3', 'Item 1', 'Item 2'])
    console.log(props.children.length, props)
    const { path } = props
    const tree = useSelector(getTree)
    const { store } = useEditorContext()
    const paths = [...path, 'children']
    const nodes = get(tree, paths)
    const state = store.getState()
    console.log(nodes)

    const $items = props.children.map((child) => {
        return child
    })

    return (
        <List
            // @ts-ignore
            overrides={
                {
                    DragHandle,
                    // Item,
                    Label,
                } as any
            }
            items={$items}
            onChange={({ oldIndex, newIndex }) => {
                const changedItems =
                    newIndex === -1 ? arrayRemove(nodes, oldIndex) : arrayMove(nodes, oldIndex, newIndex)

                set(tree, [...paths], changedItems)

                store.setState({
                    tree,
                })

                console.log('changed', changedItems, nodes, [...paths], state)

                // setItems(newIndex === -1 ? arrayRemove(items, oldIndex) : arrayMove(items, oldIndex, newIndex))
            }}
        />
    )
}
