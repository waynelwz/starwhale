import IconFont from '@starwhale/ui/IconFont'
import classNames from 'classnames'
import React, { useCallback, useState } from 'react'
import { useStyletron } from 'styletron-react'

const gridDefaultLayout = [
    // RIGHT:
    '0px 40px 1fr',
    // MIDDLE:
    '1fr 40px 1fr',
    // LEFT:
    '1fr 40px 0px',
]
const RESIZEBAR_WIDTH = 40
export type GridResizerPropsT = {
    left: () => React.ReactNode
    right: () => React.ReactNode
    gridLayout?: string[]
}

function GridResizer({ left, right, gridLayout = gridDefaultLayout }: GridResizerPropsT) {
    const [gridMode, setGridMode] = useState(1)
    const resizeRef = React.useRef<HTMLDivElement>(null)
    const gridRef = React.useRef<HTMLDivElement>(null)
    const leftRef = React.useRef<HTMLDivElement | null>(null)

    const grdiModeRef = React.useRef(1)
    const resize = useCallback(
        (e: MouseEvent) => {
            window.requestAnimationFrame(() => {
                if (resizeRef.current && leftRef.current) {
                    const offset = resizeRef.current.getBoundingClientRect().left - e.clientX
                    // leftRef.current!.style.width = `${leftRef.current?.getBoundingClientRect().width - offset}px`
                    // leftRef.current!.style.flexBasis = `${leftRef.current?.getBoundingClientRect().width - offset}px`
                    // console.log('resize', leftRef.current?.getBoundingClientRect(), e.clientX, offset)
                    const newWidth = leftRef.current?.getBoundingClientRect().width - offset
                    // eslint-disable-next-line
                    if (newWidth + 300 > gridRef.current!.getBoundingClientRect().width) {
                        grdiModeRef.current = 2
                        setGridMode(2)
                    } else if (newWidth < 440) {
                        grdiModeRef.current = 0
                        setGridMode(0)
                    } else if (grdiModeRef.current === 1) {
                        // eslint-disable-next-line
                        gridRef.current!.style.gridTemplateColumns = `${Math.max(
                            newWidth,
                            440
                        )}px ${RESIZEBAR_WIDTH}px minmax(400px, 1fr)`
                    }
                }
            })
        },
        [grdiModeRef, setGridMode]
    )
    const resizeEnd = () => {
        document.body.style.userSelect = 'unset'
        document.body.style.cursor = 'unset'
        document.removeEventListener('mouseup', resizeEnd)
        document.removeEventListener('mousemove', resize)
    }
    const resizeStart = () => {
        if (gridMode !== 1) return
        grdiModeRef.current = 1
        document.body.style.userSelect = 'none'
        document.body.style.cursor = 'col-resize'
        document.addEventListener('mouseup', resizeEnd)
        document.addEventListener('mousemove', resize)
    }

    React.useEffect(() => {
        return resizeEnd
    })

    const handleResize = useCallback(
        (dir) => {
            let next = Math.min(gridLayout.length - 1, gridMode + dir)
            next = Math.max(0, next)
            grdiModeRef.current = next
            setGridMode(next)
        },
        [gridMode, setGridMode, grdiModeRef]
    )
    return (
        <div
            ref={gridRef}
            style={{
                display: 'grid',
                gridTemplateColumns: gridLayout[gridMode],
                overflow: 'hidden',
                width: '100%',
                flex: 1,
            }}
        >
            <div
                ref={leftRef}
                style={{
                    display: 'flex',
                    overflow: 'hidden',
                    width: '100%',
                    flex: 1,
                }}
            >
                {left()}
            </div>
            <ResizeBar ref={resizeRef} onResizeStart={resizeStart} onModeChange={handleResize} />
            {right()}
        </div>
    )
}
export default GridResizer

export type ResizeBarPropsT = {
    mode: number
    onResizeStart: () => void
    onModeChange: (mode: number) => void
}

const ResizeBar = React.forwardRef<React.MutableRefObject<HTMLElement>, ResizeBarPropsT>(
    ({ mode: gridMode = 2, onResizeStart, onModeChange }, ref) => {
        const [css] = useStyletron()

        return (
            <div
                ref={ref}
                className={classNames(
                    'resize-bar',
                    css({
                        width: `${RESIZEBAR_WIDTH}px`,
                        flexBasis: `${RESIZEBAR_WIDTH}px`,
                        cursor: 'col-resize',
                        paddingTop: '25px',
                        zIndex: 20,
                        overflow: 'visible',
                        backgroundColor: '#fff',
                        position: 'relative',
                        right: gridMode === 2 ? '14px' : undefined,
                        left: gridMode === 0 ? '0px' : undefined,
                    })
                )}
                role='button'
                tabIndex={0}
                onMouseDown={onResizeStart}
            >
                <i
                    role='button'
                    tabIndex={0}
                    className='resize-left resize-left--hover'
                    onClick={() => onModeChange(1)}
                >
                    <IconFont
                        type='fold2'
                        size={12}
                        style={{
                            color: gridMode !== 2 ? undefined : '#ccc',
                            transform: 'rotate(-90deg) translateY(-2px)',
                            marginBottom: '2px',
                        }}
                    />
                </i>
                <i
                    role='button'
                    tabIndex={0}
                    className='resize-right resize-right--hover'
                    onClick={() => onModeChange(-1)}
                >
                    <IconFont
                        type='unfold2'
                        size={12}
                        style={{
                            color: gridMode !== 0 ? undefined : '#ccc',
                            transform: 'rotate(-90deg) translateY(2px)',
                        }}
                    />
                </i>
            </div>
        )
    }
)
