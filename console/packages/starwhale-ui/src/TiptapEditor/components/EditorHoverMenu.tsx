import IconFont from '@starwhale/ui/IconFont'
import { FloatingMenuPlugin, FloatingMenuPluginProps } from '../extensions/FloatingMenu'
import React, { useEffect, useState } from 'react'

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export type FloatingMenuProps = Omit<Optional<FloatingMenuPluginProps, 'pluginKey' | 'editor'>, 'element'> & {
    className?: string
    children: React.ReactNode
}

export const HoverMenu = (props: FloatingMenuProps) => {
    const [element, setElement] = useState<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!element) {
            return
        }

        if (props.editor?.isDestroyed) {
            return
        }

        const { pluginKey = 'floatingMenu', editor, tippyOptions = {}, shouldShow = null } = props

        const menuEditor = editor

        if (!menuEditor) {
            console.warn(
                'FloatingMenu component is not rendered inside of an editor component or does not have editor prop.'
            )
            return
        }

        const plugin = FloatingMenuPlugin({
            pluginKey,
            editor: menuEditor,
            element,
            tippyOptions,
            shouldShow,
        })

        menuEditor.registerPlugin(plugin)
        return () => menuEditor.unregisterPlugin(pluginKey)
    }, [props.editor, element])

    return (
        <div ref={setElement} className={props.className} style={{ visibility: 'hidden' }}>
            {props.children}
        </div>
    )
}

export const EditorHoverMenu = (props: FloatingMenuProps) => {
    const menuProps: FloatingMenuProps = {
        ...props,
        shouldShow: ({ editor }) => {
            return editor.view.state.selection.content().size === 0
        },
        tippyOptions: {
            moveTransition: 'transform 0.15s ease-out',
            onHidden: () => {},
        },
    }

    return (
        <HoverMenu {...menuProps}>
            <div className='hover-menu h-28 relative mx-auto w-full max-w-4xl ml-10px'>
                {/* Container for buttons that appear on hover */}
                <div
                    className='absolute left-0 top-0 flex w-12 gap-1 opacity-100 transition-opacity duration-300 ease-in-out group-hover:opacity-100'
                    aria-label='left-menu'
                >
                    {/* Button to add a new node after the current node */}
                    <button type='button' className=''>
                        <IconFont type='add' />
                    </button>
                    {/* Draggable handle button to allow rearranging nodes: contentEditable = false !!! */}
                    {/* <button
                        draggable
                        data-drag-handle
                        className='cursor-grab'
                        type='button'
                        contentEditable='false'
                        suppressContentEditableWarning
                    >
                        <IconFont type='drag' />
                    </button> */}
                </div>
            </div>
        </HoverMenu>
    )
}
