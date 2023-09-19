import { Editor, posToDOMRect } from '@tiptap/core'
import { EditorState, Plugin, PluginKey } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'
import tippy, { Instance, Props, sticky } from 'tippy.js'
import _ from 'lodash'

export interface FloatingMenuPluginProps {
    pluginKey: PluginKey | string
    editor: Editor
    element: HTMLElement
    tippyOptions?: Partial<Props>
    shouldShow?:
        | ((props: { editor: Editor; view: EditorView; state: EditorState; oldState?: EditorState }) => boolean)
        | null
}

export type FloatingMenuViewProps = FloatingMenuPluginProps & {
    view: EditorView
}

export class FloatingMenuView {
    public editor: Editor

    public element: HTMLElement

    public view: EditorView

    public preventHide = false

    public preventShow = false

    public shouldShow: Exclude<FloatingMenuPluginProps['shouldShow'], null> = ({ view, state }) => {
        const { selection } = state
        const { $anchor, empty } = selection
        const isRootDepth = $anchor.depth === 1
        const isEmptyTextBlock =
            $anchor.parent.isTextblock && !$anchor.parent.type.spec.code && !$anchor.parent.textContent

        if (!view.hasFocus() || !empty || !isRootDepth || !isEmptyTextBlock || !this.editor.isEditable) {
            return false
        }

        return true
    }

    constructor({ editor, element, view, shouldShow }: FloatingMenuViewProps) {
        this.editor = editor
        this.element = element
        this.view = view

        if (shouldShow) {
            this.shouldShow = shouldShow
        }

        this.element.addEventListener('mousedown', this.mousedownHandler, { capture: true })
        this.editor.on('focus', this.focusHandler)
        this.editor.on('blur', this.blurHandler)
        // Detaches menu content from its current parent
        this.element.remove()
        // Attaches menu content to high level parent
        document.body.appendChild(this.element)
        Object.assign(this.element.style, {
            'position': 'absolute',
            'z-index': 9999,
            'visibility': 'visible',
            'transition': 'all 0.15s ease-out',
        })
    }

    mousedownHandler = () => {
        this.preventHide = true
    }

    mouseoverHandler = () => {
        this.show()
    }

    focusHandler = () => {
        // we use `setTimeout` to make sure `selection` is already updated
        setTimeout(() => this.update(this.editor.view))
    }

    blurHandler = ({ event }: { event: FocusEvent }) => {
        if (this.preventHide) {
            this.preventHide = false

            return
        }

        if (event?.relatedTarget && this.element.parentNode?.contains(event.relatedTarget as Node)) {
            return
        }

        console.log('blur')

        this.hide()
    }

    tippyBlurHandler = (event: FocusEvent) => {
        this.blurHandler({ event })
    }

    createTooltip() {
        const { element: editorElement } = this.editor.options
        const editorIsAttached = !!editorElement.parentElement

        if (!editorIsAttached) {
            return
        }

        // editorElement.appendChild(this.element)

        // maybe we have to hide tippy on its own blur event as well
        // if (this.tippy.popper.firstChild) {
        //     console.log('blur')
        //     ;(this.tippy.popper.firstChild as HTMLElement).addEventListener('blur', this.tippyBlurHandler)
        // }
    }

    update(view: EditorView, oldState?: EditorState) {
        const { state } = view
        const { doc, selection } = state
        const { from, to } = selection
        const isSame = oldState && oldState.doc.eq(doc) && oldState.selection.eq(selection)

        if (isSame) {
            return
        }

        console.log('update')

        this.createTooltip()

        const shouldShow = this.shouldShow?.({
            editor: this.editor,
            view,
            state,
            oldState,
        })

        this.preventShow = !shouldShow

        if (!shouldShow) {
            this.hide()
            return
        }

        // this.tippy?.setProps({
        //     getReferenceClientRect: this.tippyOptions?.getReferenceClientRect || (() => posToDOMRect(view, from, to)),
        // })

        // this.show()
    }

    updatePosition(view: EditorView, rect, dom) {
        if (this.preventShow) return

        const { element: editorElement } = this.editor.options
        if (dom.classList.contains('tiptap')) {
            return
        }

        const editorRect = editorElement.getBoundingClientRect()

        // console.log(this.element, rect, this.element.getBoundingClientRect())

        Object.assign(this.element.style, {
            'top': `${rect.y}px`,
            'left': `${rect.x - 50}px`,
            'position': 'absolute',
            'z-index': 9999,
            'visibility': 'visible',
        })
    }

    show() {
        this.element.style.visibility = 'visible'
    }

    hide() {
        this.element.style.visibility = 'hidden'
    }

    destroy() {
        // if (this.tippy?.popper.firstChild) {
        //     ;(this.tippy.popper.firstChild as HTMLElement).removeEventListener('blur', this.tippyBlurHandler)
        // }
        // this.tippy?.destroy()
        this.element.removeEventListener('mousedown', this.mousedownHandler, { capture: true })
        this.editor.off('focus', this.focusHandler)
        this.editor.off('blur', this.blurHandler)
    }
}

const getBoundingClientRect = (element) => {
    const { top, right, bottom, left, width, height, x, y } = element.getBoundingClientRect()
    return { top, right, bottom, left, width, height, x, y } as DOMRect
}

function isBlockNode(dom: Node) {
    if (!dom) return false
    const desc = dom.pmViewDesc
    if (!desc) return false
    return desc && desc.node && desc.node.isBlock
}

export const FloatingMenuPlugin = (options: FloatingMenuPluginProps) => {
    let domView: FloatingMenuView | null = null
    let debouceUpdate: ((view: EditorView, rect: DOMRect, finale: Node) => void) | null = null
    return new Plugin({
        key: typeof options.pluginKey === 'string' ? new PluginKey(options.pluginKey) : options.pluginKey,
        view: (view) => {
            domView = new FloatingMenuView({ view, ...options }) as FloatingMenuView
            debouceUpdate = _.debounce((v, rect, finale) => {
                console.log(finale.pmViewDesc)
                domView?.updatePosition(v, rect, finale)
            }, 10)
            return domView
        },
        props: {
            handleDOMEvents: {
                mousemove(view, event) {
                    if (!domView) return
                    if (!event.target) return
                    const pos = view.posAtDOM(event.target as Node, 0, 1)
                    const { node, offset } = view.domAtPos(pos)
                    let final: Node
                    if (isBlockNode(node) && !offset) {
                        final = node
                    } else {
                        final = node.childNodes[offset]
                    }
                    // console.log(final.pmViewDesc)
                    // FIXME code/
                    if (!isBlockNode(final)) return

                    // console.log(
                    //     pos,
                    //     nodeDom,
                    //     node,
                    //     node.pmViewDesc?.children[node.offset],
                    //     // hasBlockDesc(node.node),
                    //     final
                    // )
                    const rect = getBoundingClientRect(final)
                    debouceUpdate?.(view, rect, final)
                },
            },
        },
    })
}
