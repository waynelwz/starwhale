import { FloatingMenuPlugin, FloatingMenuPluginProps } from '../extension-floating-menu'
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
            console.log(editor.view.state.selection)

            return editor.view.state.selection.content().size === 0
        },
        tippyOptions: {
            moveTransition: 'transform 0.15s ease-out',
            onHidden: () => {},
        },
    }

    return <HoverMenu {...menuProps}>123</HoverMenu>
}
