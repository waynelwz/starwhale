import { themedWithStyle } from '@starwhale/ui/theme/styletron'
import { Editor, posToDOMRect } from '@tiptap/core'
import { EditorState, Plugin, PluginKey } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'
import tippy, { Instance, Props, sticky } from 'tippy.js'

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

    public tippy: Instance | undefined

    public tippyOptions?: Partial<Props>

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

    constructor({ editor, element, view, tippyOptions = {}, shouldShow }: FloatingMenuViewProps) {
        this.editor = editor
        this.element = element
        this.view = view

        console.log(editor, element, view)

        if (shouldShow) {
            this.shouldShow = shouldShow
        }

        this.element.addEventListener('mousedown', this.mousedownHandler, { capture: true })
        this.editor.on('focus', this.focusHandler)
        this.editor.on('blur', this.blurHandler)
        this.tippyOptions = tippyOptions
        // Detaches menu content from its current parent
        this.element.remove()
        this.element.style.visibility = 'visible'
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

        if (this.tippy || !editorIsAttached) {
            return
        }

        this.tippy = tippy(editorElement, {
            duration: 0,
            getReferenceClientRect: null,
            content: this.element,
            interactive: true,
            trigger: 'manual',
            placement: 'left-start',
            hideOnClick: 'toggle',
            ...this.tippyOptions,
            sticky: 'popper',
            plugins: [sticky],
        })

        // maybe we have to hide tippy on its own blur event as well
        if (this.tippy.popper.firstChild) {
            console.log('blur')
            ;(this.tippy.popper.firstChild as HTMLElement).addEventListener('blur', this.tippyBlurHandler)
        }
    }

    update(view: EditorView, oldState?: EditorState) {
        const { state } = view
        const { doc, selection } = state
        const { from, to } = selection
        const isSame = oldState && oldState.doc.eq(doc) && oldState.selection.eq(selection)

        if (isSame) {
            return
        }

        this.createTooltip()

        const shouldShow = this.shouldShow?.({
            editor: this.editor,
            view,
            state,
            oldState,
        })

        if (!shouldShow) {
            this.hide()
            return
        }

        // this.tippy?.setProps({
        //     getReferenceClientRect: this.tippyOptions?.getReferenceClientRect || (() => posToDOMRect(view, from, to)),
        // })

        // this.show()
    }

    updatePosition(view: EditorView, rect) {
        const { state } = view

        // console.log(rect)

        this.createTooltip()

        this.tippy?.setProps({
            getReferenceClientRect: () => rect,
        })

        this.show()
    }

    show() {
        this.tippy?.show()
    }

    hide() {
        this.tippy?.hide()
    }

    destroy() {
        if (this.tippy?.popper.firstChild) {
            ;(this.tippy.popper.firstChild as HTMLElement).removeEventListener('blur', this.tippyBlurHandler)
        }
        this.tippy?.destroy()
        this.element.removeEventListener('mousedown', this.mousedownHandler, { capture: true })
        this.editor.off('focus', this.focusHandler)
        this.editor.off('blur', this.blurHandler)
    }
}

const getBoundingClientRect = (element) => {
    const { top, right, bottom, left, width, height, x, y } = element.getBoundingClientRect()
    return { top, right, bottom, left, width, height, x, y }
}

export const FloatingMenuPlugin = (options: FloatingMenuPluginProps) => {
    let domView = null
    return new Plugin({
        key: typeof options.pluginKey === 'string' ? new PluginKey(options.pluginKey) : options.pluginKey,
        view: (view) => {
            domView = new FloatingMenuView({ view, ...options })
            return domView
        },
        props: {
            handleDOMEvents: {
                mousemove(view, event) {
                    const viewportCoordinates = {
                        left: event.clientX,
                        top: event.clientY - 24,
                    }
                    const viewportPos = view.posAtCoords(viewportCoordinates)
                    const { pos, inside } = viewportPos || {}

                    console.log(pos, inside, viewportCoordinates, view.dom.getBoundingClientRect())

                    if (!pos) return
                    const node = view.domAtPos(pos, inside)
                    const nodeDom = view.nodeDOM(pos)

                    if (!domView) return
                    if (!nodeDom) {
                        // console.log(nodeDom, event.target)
                        // domView.hide()
                        return
                    }

                    // view.state.doc.descendants((node, pos) => {
                    //     if (node.contains(event.target)) {
                    //         console.log(node)
                    //     }
                    // })

                    const rect = getBoundingClientRect(nodeDom)

                    domView.updatePosition(view, {
                        ...rect,
                        x: 0,
                        left: 0,
                    })

                    // console.log(pos, node, nodeDom)
                    // console.log(nodeDom)
                    console.log(nodeDom, {
                        domView,
                        pos,
                        inside,
                        view,
                        viewportCoordinates,
                        node,
                        nodeDom,
                        nodeDomRect: nodeDom.getBoundingClientRect(),
                        viewportPos,
                        docRect: node.node.getBoundingClientRect(),
                    })

                    // console.log(view.nodeDOM(viewportPos?.pos))
                    // console.log(posAtCoords({ left: event.clientX, top: event.clientY }), { view, event })
                    // console.log(this)
                },
            },
        },
    })
}
