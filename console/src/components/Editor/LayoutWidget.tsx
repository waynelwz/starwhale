import * as React from 'react'
import { List, arrayMove, arrayRemove } from 'baseui/dnd-list'

export default (props) => {
    const [items, setItems] = React.useState(['Item 3', 'Item 1', 'Item 2'])
    console.log(props.children.length)
    return (
        <List
            items={props.children}
            // overrides={{
            //     Item: ({ $index }) => {
            //         console.log(props.children, $index)
            //         return <div>{props.children[$index]}</div>
            //     },
            // }}
            onChange={({ oldIndex, newIndex }) =>
                setItems(newIndex === -1 ? arrayRemove(items, oldIndex) : arrayMove(items, oldIndex, newIndex))
            }
        />
    )
}
