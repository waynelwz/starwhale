import React from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import Button from '@/components/Button'
import normalLogoImg from '@/assets/logo_normal_en_white.svg'
import test from './test.jpg'
import ZoomWrapper from './ZoomWrapper'
import { useEffect } from 'react'
import _ from 'lodash'
import Color from 'color'
import { CanvasRef } from 'reaflow'

const COLORS = ['#df672a', '#c1433c', '#3d9e3e', '#ecbb33', '#926ccb', '#6bb59b', '#ad825c', '#c66b9e', '#a7b756'].map(
    (c) => Color(c).rgb().array() as [number, number, number]
)

const loadImage = (label: any, url: string) => {
    const src = url.startsWith('http') || url.startsWith('data:image') ? url : 'data:image/png;base64,' + url
    return new Promise<{ label: any; img: ImageData }>((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            if (ctx) {
                ctx.drawImage(img, 0, 0)
                resolve({
                    label,
                    img: ctx.getImageData(0, 0, img.width, img.height),
                })
            }
        }
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = src
    })
}

const useImageData = (src: string) => {
    const [imageData, setImageData] = React.useState<ImageData | null>(null)

    useEffect(() => {
        const img = new Image()
        img.src = src
        img.crossOrigin = 'anonymous'
        img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            if (ctx) {
                ctx.drawImage(img, 0, 0)
                setImageData(ctx.getImageData(0, 0, img.width, img.height))
            }
        }
    }, [src])

    return {
        imageData,
    }
}

const clearCanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    ctx?.clearRect(0, 0, canvas.width, canvas.height)
}

const drawSegment = (canvas: HTMLCanvasElement, imgDatas: IImageData[], rawDatas: any[]) => {
    const ctx = canvas.getContext('2d')
    const newImageData = new ImageData(canvas.width, canvas.height)
    for (let i = 0; i < newImageData.data.length; i += 4) {
        const rawIndex = imgDatas.findIndex((v) => v.img.data[i + 0] > 0)
        if (rawIndex < 0) continue
        const [r, g, b, a = 255] = rawDatas[rawIndex]?.color //?? COLORS[rawIndex % COLORS.length]
        // const isHover = rect ? rect.x + rect.y * imageData.width * 4 === i : false
        newImageData.data[i] = r
        newImageData.data[i + 1] = g
        newImageData.data[i + 2] = b
        newImageData.data[i + 3] = rawDatas[rawIndex]?.isShow ? a : 0
    }
    ctx?.putImageData(newImageData, 0, 0)
    return newImageData
}

type IImageData = { label: any; img: ImageData }
export default function ImageSegmentationViewer({ isZoom = true }) {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
    const [rect, setHoverRect] = React.useState<{ x: number; y: number } | null>(null)
    const [isHover, setIsHover] = React.useState(true)
    const Wrapper = isZoom ? ZoomWrapper : React.Fragment
    const [imgDatas, setImgDatas] = React.useState<IImageData[]>([])
    const { imageData: originalData } = useImageData(test)
    const [hiddenLabels, setHiddenLabels] = React.useState(new Set<any>())
    const [layout, setLayout] = React.useState(1)
    // console.log(imageData, originalData)

    const $masks = React.useMemo(
        () =>
            masks.map((v, i) => ({
                mask: v.mask,
                label: v.label,
                isShow: !hiddenLabels.has(v.label),
                color: [...COLORS[i % COLORS.length], 255 * (isHover ? 0.8 : 0.6)],
            })),
        [isHover, hiddenLabels]
    )

    React.useEffect(() => {
        if (!originalData) return
        const getImages = async () => {
            return await Promise.all($masks.map((m) => loadImage(m.label, m.mask)))
        }
        getImages().then((d) => setImgDatas(d))
    }, [$masks, originalData, hiddenLabels])

    useEffect(() => {
        if (originalData && imgDatas.length > 0 && canvasRef.current) {
            drawSegment(canvasRef.current, imgDatas, $masks)
        }
    }, [canvasRef, originalData, imgDatas, $masks])

    useEffect(() => {
        if (canvasRef.current && originalData) {
            const canvas = canvasRef.current
            canvas.width = originalData.width
            canvas.height = originalData.height
        }
    }, [canvasRef, originalData])

    const handleHover = _.throttle((event: any) => {
        console.log(event.layerX, event.layerY)
        // @ts-ignore
        // var pixel = ctx.getImageData(event.layerX, event.layerY, 1, 1)
        setHoverRect({ x: event.layerX, y: event.layerY })
        // setIsHover(true)
    }, 600)
    const handleLeave = () => {
        // setIsHover(false)
        setHoverRect({ x: -1, y: -1 })
    }
    useEffect(() => {
        const canvas = canvasRef.current
        canvas?.addEventListener('mousemove', handleHover)
        canvas?.addEventListener('mouseleave', handleLeave)
        return () => {
            canvas?.removeEventListener('mousemove', handleHover)
            canvas?.removeEventListener('mouseleave', handleLeave)
        }
    }, [])

    return (
        <div className='flowContainer fullsize'>
            {/* label bar */}
            <div
                style={{
                    display: 'flex',
                    gap: '5px',
                }}
            >
                {$masks.map((m) => (
                    <Button
                        key={m.label}
                        overrides={{
                            BaseButton: {
                                style: {
                                    'backgroundColor': hiddenLabels.has(m.label) ? 'transparent' : Color(m.color).hex(),
                                    ':hover': {
                                        backgroundColor: Color(m.color).darken(0.1).hex(),
                                    },
                                },
                            },
                        }}
                        onClick={() => {
                            setHiddenLabels((labels) => {
                                if (labels.has(m.label)) {
                                    labels.delete(m.label)
                                } else {
                                    labels.add(m.label)
                                }
                                return new Set(labels)
                            })
                        }}
                    >
                        {m.label}
                    </Button>
                ))}
            </div>
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    right: '15px',
                }}
            >
                <Button
                    onClick={() => {
                        setLayout((layout) => {
                            return layout == 1 ? 2 : 1
                        })
                    }}
                >
                    Layout
                </Button>
            </div>
            <Wrapper>
                <canvas
                    ref={canvasRef}
                    className={layout == 1 ? 'fullsize' : ''}
                    style={{
                        zIndex: 1,
                        objectFit: 'contain',
                    }}
                />
                <img
                    style={{
                        margin: '0 auto',
                        width: '100%',
                    }}
                    src={test}
                    alt='logo'
                />
            </Wrapper>
        </div>
    )
}

// data:image/png;base64,
const masks = [
    {
        score: 1,
        label: 'wall',
        mask: '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',
    },
    {
        score: 1,
        label: 'sky',
        mask: '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',
    },
    {
        score: 1,
        label: 'floor',
        mask: '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',
    },
    {
        score: 1,
        label: 'person',
        mask: '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',
    },
    {
        score: 1,
        label: 'earth',
        mask: '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',
    },
    {
        score: 1,
        label: 'box',
        mask: 'iVBORw0KGgoAAAANSUhEUgAAApYAAAKWCAAAAADWmYbWAAADOUlEQVR4nO3d3U6DQBSF0cH4/q+MF/WnIpQEGLtPZ60bbarJSebzULloWwMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2vTsAehvvn0pdNaFRuWY+fu7OoddZ1KOme8fVDnuKnOy5Zbd1jnOi8dFzrvImGzYuUIvq6xy4DWmZMPOFfpvlUVOvMSQrPtT3bTz/NoPRaowI+vWq7uZHjxf4MwLjMiqR1HuCz/3t2cPwDHnqjz7672F/9Ww6XRYyUdvWw5rDt6YsqzqgmWX26UsRxbbZfILDDZcWFPo+duWYwvdl7IcXGaXsqwns6RLybKci6uMjFyW1URmdLXQ/8TY0CPKwAZsy1KGWJVNlkS2LksCybKSTnstb13KkkCyJJAsCbyKy7KSwDuMfciSlrcuZUkgWRJIlrQWdxWXJYFkWUnYTutHlrQWd+tJlgSSJS1uWcqSRLIkb1nKspS4fHqRJYG1y5JAsiRvWcqylh4FBVbZ3p89AM+VGKVtObrMKm3LoYVGGTwY617/nYBbsy3HFRylLAcV3WTLn4+ll/6YqC8VZuSXl/6wx09uEJVzKqwaVXptOZIiTbZKk/LjyHW81EmXGpZ7D9qcFs86ZQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4B98AFWxK2rbYxhdAAAAAElFTkSuQmCC',
    },
    {
        score: 1,
        label: 'tent',
        mask: 'iVBORw0KGgoAAAANSUhEUgAAApYAAAKWCAAAAADWmYbWAAAC9klEQVR4nO3bwW6DMBQEQFz1/3/ZPTSKQjFgno2NqplDcggHtNo8G0KWBQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYSbNP4JnyIpqZZF+UX+/imeNr9gnAlloWmZJzqeWhfH4IN1BLHkgtjxmXU6hl2XtzqZczqGUd7RxKLc/k3xe9HMmdkLJtCyU1kGlZVJiNxuVAZsDWXgFlNYyoi8rNFNYokt5X6Ka4xrC33Je2JazYYNqDduDrfyIvS1o17TgxD2p2IcJTOf0dgPuh5bMDqCLACsV1Oa0+TuvjxNpGfjWOLsxdtN9AfDUClzGCbeFKnAdSy5u4T9RCLWtYkQdTSx5ILasExqVVvIHl6aILbZNtmOguqy+mcKMkF1BdTOkG2VsGFB4toiu1DKnrpfZGSS7ofCEXbZzsonZ6KdAeLOJR+ncjtQzTy/vItsH7WfQL/6qghgy7+OylSNtZxLv4rKIfw9upZXemZTu17MKE7Ot79gn8N2ZlD6ZlX1oJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAs/wAUEgpRvkGouYAAAAASUVORK5CYII=',
    },
    {
        score: 1,
        label: 'flag',
        mask: 'iVBORw0KGgoAAAANSUhEUgAAApYAAAKWCAAAAADWmYbWAAADkklEQVR4nO3cS27jMBBAQWvuf2fNwhP5JzJNmWwSmKpFgABZGI2XJmXEud0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAun2f/Qr+T39mv4Cl7bebLmeQZYUkZ5ElC5Jl2f70lVSyZEHb7BewrMeWNKN0Rn7mnuT2U6YhZXOIn3i/TrpeZpNlmRqnkSULkmWEvZlMlixIlixIlp9OjmyneC5ZfjhNUJepvFP8ptifSSWyLV/ZikuwAx6qSRpUJtM+1Ko0plwO8QhVJpMlC5JlxP0DkB6H0jieDoHqTCuJbXnQ3Dpk2cJ/M0hiRRyCyZlYAtuylYWZQJbNdDmeLNvpcjhZXuDJZzRZXqLLsWTJgmR5jXU5lCwPbW9I6nIkbw4/a2rN6MaxLZ9tUluDLF/pcgmyvMztchxZvmlYl7ocRpYsyF3qQ8sSNL4xbMsPLak5x8fw636moTYDHMFUzwlzKjMtcMOcyd2yAzfM3mRZ0LQBddmZLLvQZV+yZEGyLPHnlxPJssjz9TyyLPPUM40sK3Q5i5Oqqq01w+zFtqwS2hyyrNPlFLL8hS5nkOVvfIpiAssgIJ6bcfZhWwbEY7Mv+5BlhCWYTJZ9WZddyLIzXfYgyxCP47lk2Z0uvyfLGB8eTyXLIA/jmWQ5gHX5LVlGWZeJZBnmaTyPLOPsyzSybOBfq2eRZZNAl9LtwBBb1e+N2/0njPU75ndBucx/49yN9Tvmd9Wjze3nO8PsxSSvu4dpggAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwKu/nsFFd/0sj+YAAAAASUVORK5CYII=',
    },
]
