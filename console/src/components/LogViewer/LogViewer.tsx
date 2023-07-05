import '@patternfly/react-core/dist/styles/base.css'

import React from 'react'
import { LogViewer, LogViewerSearch } from '@patternfly/react-log-viewer'
import {
    Button,
    Tooltip,
    Toolbar,
    ToolbarContent,
    ToolbarGroup,
    ToolbarItem,
    ToolbarToggleGroup,
} from '@patternfly/react-core'
import OutlinedPlayCircleIcon from '@patternfly/react-icons/dist/esm/icons/outlined-play-circle-icon'
import ExpandIcon from '@patternfly/react-icons/dist/esm/icons/expand-icon'
import PauseIcon from '@patternfly/react-icons/dist/esm/icons/pause-icon'
import PlayIcon from '@patternfly/react-icons/dist/esm/icons/play-icon'
import EllipsisVIcon from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon'
import DownloadIcon from '@patternfly/react-icons/dist/esm/icons/download-icon'
import HistoryIcon from '@patternfly/react-icons/dist/esm/icons/history-icon'
import useWebSocket from '@/hooks/useWebSocket'
import SWSelect from '@starwhale/ui/Select'
import './LogView.scss'
import useTranslation from '@/hooks/useTranslation'
import _ from 'lodash'
import { useEventCallback } from '@starwhale/core'

const empty: any[] = []

function useSourceData({ ws = '', data }: { ws?: string; data?: string }) {
    const [content, setContent] = React.useState<any[]>([])
    const ref = React.useRef<any[]>([])

    React.useEffect(() => {
        ref.current = []
    }, [ws])

    React.useEffect(() => {
        if (data) {
            ref.current = data.split('\n')
            setContent(data.split('\n'))
        }
    }, [data])

    // @ts-ignore
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const throttle = React.useCallback(
        _.throttle(
            (tmp: any) => {
                setContent([...tmp])
            },
            500,
            { leading: false }
        ),
        []
    )

    // useInterval(() => {
    //     console.log('useInterval')
    //     ref.current.push('test')
    //     throttle(ref.current)
    // }, 100)

    useWebSocket({
        wsUrl: ws,
        onMessage: useEventCallback((d) => {
            ref.current.push(d)
            throttle(ref.current)
        }),
        onClose: useEventCallback(() => {
            setContent(empty)
            ref.current = empty
        }),
    })

    return {
        content,
    }
}

const ComplexToolbarLogViewer = ({
    sources: dataSources,
}: {
    sources: {
        type: string
        id: string
        data?: string
        ws?: string
    }[]
}) => {
    const [isPaused, setIsPaused] = React.useState(false)
    const [isFullScreen, setIsFullScreen] = React.useState(false)
    const [currentItemCount, setCurrentItemCount] = React.useState(0)
    const [renderData, setRenderData] = React.useState('')
    const [selectedDataSource, setSelectedDataSource] = React.useState(dataSources[0]?.id)
    const [buffer, setBuffer] = React.useState([])
    const [linesBehind, setLinesBehind] = React.useState(0)
    const logViewerRef = React.useRef<any>()
    const [t] = useTranslation()

    const selectedDataSourceObj = React.useMemo(
        () => dataSources?.find((d) => d.id === selectedDataSource) || {},
        [dataSources, selectedDataSource]
    )
    const { content: selectedData } = useSourceData(selectedDataSourceObj)

    const reset = React.useCallback(() => {
        setLinesBehind(0)
        setBuffer([])
        setCurrentItemCount(0)
        if (logViewerRef && logViewerRef.current) {
            logViewerRef.current?.scrollToBottom()
        }
    }, [logViewerRef])

    React.useEffect(() => {
        reset()
        setSelectedDataSource(dataSources[0]?.id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataSources])

    React.useEffect(() => {
        if (currentItemCount < selectedData.length) {
            setBuffer(selectedData as any)
        }
    }, [currentItemCount, selectedData])

    React.useEffect(() => {
        // console.log({ isPaused, currentItemCount, len: selectedData.length, buffer: buffer.length })
        if (!isPaused && buffer.length > 0) {
            setCurrentItemCount(buffer.length)
            setRenderData(buffer.join('\n'))
            if (logViewerRef && logViewerRef.current) {
                logViewerRef.current?.scrollToBottom()
            }
        } else if (buffer.length !== currentItemCount) {
            setLinesBehind(Math.max(buffer.length - currentItemCount, 0))
        } else {
            setLinesBehind(0)
        }
    }, [isPaused, buffer, currentItemCount, logViewerRef, selectedData.length])

    // @ts-ignore
    const onExpandClick = () => {
        const element = document.querySelector('#complex-toolbar-demo')
        if (!isFullScreen) {
            if (element?.requestFullscreen) {
                element.requestFullscreen()
                // @ts-ignore
            } else if (element?.mozRequestFullScreen) {
                // @ts-ignore
                element?.mozRequestFullScreen()
                // @ts-ignore
            } else if (element?.webkitRequestFullScreen) {
                // @ts-ignore
                element?.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
            }
            setIsFullScreen(true)
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
                // @ts-ignore
            } else if (document.webkitExitFullscreen) {
                /* Safari */
                // @ts-ignore
                document.webkitExitFullscreen()
                // @ts-ignore
            } else if (document.msExitFullscreen) {
                /* IE11 */
                // @ts-ignore
                document.msExitFullscreen()
            }
            setIsFullScreen(false)
        }
    }

    const onDownloadClick = () => {
        const element = document.createElement('a')
        const dataToDownload = [selectedData.join('\n')]
        const file = new Blob(dataToDownload, { type: 'text/plain' })
        element.href = URL.createObjectURL(file)
        element.download = `${selectedDataSource}.txt`
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    }

    const onScrollTop = () => {
        if (logViewerRef && logViewerRef.current) {
            logViewerRef.current?.scrollToItem(0)
        }
    }

    // @ts-ignore
    const onScroll = ({ scrollOffsetToBottom, scrollUpdateWasRequested }) => {
        if (!scrollUpdateWasRequested) {
            if (scrollOffsetToBottom > 2) {
                setIsPaused(true)
            } else {
                setIsPaused(false)
            }
        }
    }

    const handleClick = useEventCallback(() => {
        setIsPaused(!isPaused)
        if (!isPaused)
            if (logViewerRef && logViewerRef.current) {
                logViewerRef.current?.scrollToBottom()
            }
    })

    const ControlButton = React.useCallback(
        () => (
            <Button variant={isPaused ? 'plain' : 'link'} onClick={handleClick}>
                {isPaused ? <PlayIcon /> : <PauseIcon />}
                {isPaused ? t('log.resume') : t('log.pause')}
            </Button>
        ),
        [handleClick, isPaused, t]
    )

    const leftAlignedToolbarGroup = (
        <>
            <ToolbarToggleGroup toggleIcon={<EllipsisVIcon />} breakpoint='md'>
                <ToolbarItem variant='search-filter' style={{ minWidth: '280px', maxWidth: '500px' }}>
                    <SWSelect
                        clearable={false}
                        options={dataSources.map(({ id }) => ({ label: id, id }))}
                        value={selectedDataSource ? [{ id: selectedDataSource }] : []}
                        onChange={(params) => {
                            if (!params.option) {
                                return
                            }
                            reset()
                            const selection = params.option.id
                            setSelectedDataSource(selection as any)
                        }}
                    />
                </ToolbarItem>
                <ToolbarItem variant='search-filter'>
                    <LogViewerSearch
                        onChange={(e) => {
                            if ((e.target as any).value?.length === 0) {
                                setIsPaused(false)
                            }
                        }}
                        onFocus={() => setIsPaused(true)}
                        placeholder='Search'
                        minSearchChars={1}
                    />
                </ToolbarItem>
            </ToolbarToggleGroup>
            <ToolbarItem>
                <ControlButton />
            </ToolbarItem>
        </>
    )

    const rightAlignedToolbarGroup = (
        <>
            <ToolbarGroup variant='icon-button-group'>
                <ToolbarItem>
                    <Tooltip position='top' content={<div>Top</div>}>
                        <Button onClick={onScrollTop} variant='plain' aria-label='Scroll to TOP'>
                            <HistoryIcon />
                        </Button>
                    </Tooltip>
                </ToolbarItem>
                <ToolbarItem>
                    <Tooltip position='top' content={<div>Download</div>}>
                        <Button onClick={onDownloadClick} variant='plain' aria-label='Download current logs'>
                            <DownloadIcon />
                        </Button>
                    </Tooltip>
                </ToolbarItem>
                <ToolbarItem>
                    <Tooltip position='top' content={<div>Expand</div>}>
                        <Button onClick={onExpandClick} variant='plain' aria-label='View log viewer in full screen'>
                            <ExpandIcon />
                        </Button>
                    </Tooltip>
                </ToolbarItem>
            </ToolbarGroup>
        </>
    )

    const handleContinue = useEventCallback(() => {
        setIsPaused(false)
    })

    const FooterButton = React.useCallback(() => {
        return (
            <Button
                onClick={handleContinue}
                isBlock
                style={{
                    visibility: isPaused ? 'visible' : 'hidden',
                }}
            >
                <OutlinedPlayCircleIcon />
                {t('log.resume')} {linesBehind === 0 ? null : t('log.behind.lines', [linesBehind])}
            </Button>
        )
    }, [handleContinue, isPaused, linesBehind, t])

    return (
        <LogViewer
            data={renderData}
            theme='dark'
            // @ts-ignore
            id='complex-toolbar-demo'
            scrollToRow={currentItemCount}
            innerRef={logViewerRef}
            height='100%'
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                minHeight: '500px',
                flex: 'auto',
            }}
            toolbar={
                <Toolbar>
                    <ToolbarContent>
                        <ToolbarGroup alignment={{ default: 'alignLeft' }}>{leftAlignedToolbarGroup}</ToolbarGroup>
                        <ToolbarGroup alignment={{ default: 'alignRight' }}>{rightAlignedToolbarGroup}</ToolbarGroup>
                    </ToolbarContent>
                </Toolbar>
            }
            overScanCount={10}
            footer={isPaused && <FooterButton />}
            onScroll={onScroll}
        />
    )
}

export default ComplexToolbarLogViewer
