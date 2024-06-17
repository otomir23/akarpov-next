"use client"

import { useCallback, useContext, useEffect, useRef } from "react"
import { MusicPlayerContext } from "@/app/music/components/music-player"

export default function Seekbar() {
    const {
        seek,
        currentSong,
        requestMetadata,
    } = useContext(MusicPlayerContext)

    const seekbar = useRef<HTMLDivElement>(null)
    const seekbarControl = useRef<HTMLInputElement>(null)
    const seekbarParent = useRef<HTMLLabelElement>(null)
    const waveCanvas = useRef<HTMLCanvasElement>(null)

    const updateSeekbar = useCallback((pos: number) => {
        if (!seekbar.current || !seekbarParent.current) return

        seekbar.current.style.width = `${pos * seekbarParent.current.clientWidth + 2}px`
    }, [])

    useEffect(() => {
        let lastFrame: number
        const update = () => {
            const { position, fullWaveform } = requestMetadata()

            if (seekbarControl.current) seekbarControl.current.value = `${position * 10000}`
            updateSeekbar(position)

            const ctx = waveCanvas.current?.getContext("2d")
            if (ctx) {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

                const barWidth = Math.ceil(ctx.canvas.width / fullWaveform.length + 0.5)
                const maxWaveformValue = Math.max(...fullWaveform)

                fullWaveform.forEach((barValue, i) => {
                    const barHeight = ctx.canvas.height * (barValue / maxWaveformValue)

                    const barFramePos = i / fullWaveform.length
                    const barPlayed
                        = Math.min(Math.max((position - barFramePos) * fullWaveform.length + 1, 0), 1)

                    if (barPlayed > 0) {
                        ctx.fillStyle = `rgb(220 38 38)`
                        ctx.fillRect(
                            ctx.canvas.width * barFramePos,
                            ctx.canvas.height - barHeight,
                            barWidth * barPlayed,
                            barHeight
                        )
                    }

                    if (barPlayed < 1) {
                        ctx.fillStyle = `rgb(229 229 229)`
                        ctx.fillRect(
                            ctx.canvas.width * barFramePos + barWidth * barPlayed,
                            ctx.canvas.height - barHeight,
                            barWidth * (1 - barPlayed),
                            barHeight
                        )
                    }
                })
            }

            lastFrame = requestAnimationFrame(update)
        }
        lastFrame = requestAnimationFrame(update)

        return () => cancelAnimationFrame(lastFrame)
    }, [requestMetadata, updateSeekbar])

    useEffect(() => {
        const resize = () => {
            if (!waveCanvas.current) return
            waveCanvas.current.width = waveCanvas.current.clientWidth
            waveCanvas.current.height = waveCanvas.current.clientHeight
        }
        resize()
        window.addEventListener("resize", resize)
        return () => window.removeEventListener("resize", resize)
    }, [currentSong])

    return (
        <label
            className="absolute inset-x-0 -top-2 h-2 bg-neutral-200 opacity-80 hover:opacity-100 transition group z-30"
            ref={seekbarParent}
        >
            <canvas className="absolute w-full h-4 -top-4 pointer-events-none" ref={waveCanvas} />
            <div className="absolute left-0 h-2 bg-red-600" ref={seekbar} />
            <input
                type="range"
                min={0}
                max={10000}
                onChange={(e) => {
                    const v = +e.target.value / 10000
                    updateSeekbar(v)
                    seek(v)
                }}
                ref={seekbarControl}
                className="appearance-none h-2 top-0 absolute cursor-pointer seekbar left-0 -right-4
                w-[calc(100%_+_1rem)]"
            />
        </label>
    )
}
