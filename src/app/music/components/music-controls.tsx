"use client"

import { useContext, useEffect, useRef, useCallback, useState } from "react"
import { MusicPlayerContext } from "@/app/music/components/music-player"
import Image from "next/image"
import Link from "next/link"
import {
    ChevronFirstIcon,
    ChevronLastIcon,
    DownloadIcon,
    ListMusicIcon,
    ListXIcon,
    PauseIcon,
    PlayIcon, Volume2Icon, VolumeXIcon,
} from "lucide-react"
import Queue from "@/app/music/components/queue"

export default function MusicControls() {
    const {
        seek,
        playing,
        next,
        previous,
        togglePlaying,
        currentSong,
        requestMetadata,
        updateVolume,
        clear,
    } = useContext(MusicPlayerContext)
    const seekbar = useRef<HTMLDivElement>(null)
    const seekbarControl = useRef<HTMLInputElement>(null)
    const seekbarParent = useRef<HTMLLabelElement>(null)
    const waveCanvas = useRef<HTMLCanvasElement>(null)
    const volumeControl = useRef<HTMLInputElement>(null)
    const [queueOpen, setQueueOpen] = useState(false)
    const [muted, setMuted] = useState(false)

    const VolumeIcon = muted ? VolumeXIcon : Volume2Icon

    const updateSeekbar = useCallback((pos: number) => {
        if (!seekbar.current || !seekbarParent.current) return

        seekbar.current.style.width = `${pos * seekbarParent.current.clientWidth + 2}px`
    }, [])

    const updateVolumeControl = useCallback((vol: number) => {
        if (!volumeControl.current) return

        volumeControl.current.value = `${vol * 100}`
    }, [])

    useEffect(() => {
        let lastFrame: number
        const update = () => {
            const { position, volume, fullWaveform } = requestMetadata()

            if (seekbarControl.current) seekbarControl.current.value = `${position * 10000}`
            updateSeekbar(position)
            updateVolumeControl(volume)
            setMuted(volume === 0)

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
                        ctx.fillStyle = `rgb(220 220 220)`
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
    }, [requestMetadata, updateSeekbar, updateVolumeControl])

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

    if (!currentSong) return null
    return (
        <div
            className="fixed inset-x-0 bottom-0 w-full flex gap-4 justify-center items-center p-3 z-40
            after:backdrop-blur-lg after:bg-white/90 after:absolute after:inset-0 after:-z-10"
        >
            <label
                className="absolute inset-x-0 -top-2 h-2 bg-white opacity-80 hover:opacity-100
                transition-opacity group z-30"
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
            {
                currentSong.image_cropped ? (
                    <Image
                        src={currentSong.image_cropped}
                        height={64}
                        width={64}
                        className="object-cover w-16 aspect-square rounded"
                        alt={`"${currentSong.album.name}" Album Art`}
                    />
                ) : <div className="rounded bg-neutral-300 w-16 aspect-square" />
            }
            <div>
                <Link href={`/music/albums/${currentSong.album.slug}#${currentSong.slug}`} className="font-semibold">
                    {currentSong.name}
                </Link>
                <p className="text-sm text-neutral-400">
                    {currentSong.authors.map((a, i) => (
                        <Link href={`/music/authors/${a.slug}`} key={a.slug}>
                            {a.name}{i !== currentSong.authors.length - 1 && ", "}
                        </Link>
                    ))}
                </p>
            </div>
            <button onClick={previous} className="max-sm:hidden">
                <ChevronFirstIcon />
            </button>
            <button onClick={togglePlaying}>
                {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button onClick={next}>
                <ChevronLastIcon />
            </button>
            <Link href={currentSong.file} target="_blank" className="max-sm:hidden">
                <DownloadIcon />
            </Link>
            <button onClick={() => setQueueOpen(o => !o)}>
                <ListMusicIcon />
            </button>
            <div
                className={`absolute -top-0 inset-x-0 bg-white/80 -z-20 backdrop-blur-lg p-4 rounded-t right-4 
                transition ${queueOpen
                ? "-translate-y-full opacity-100"
                : "-translate-y-3/4 opacity-0 pointer-events-none"}`}
            >
                <div className="w-full max-w-xl mx-auto">
                    <Queue />
                </div>
                <button onClick={clear} className="absolute right-2 bottom-6">
                    <ListXIcon />
                </button>
            </div>
            <div className="relative flex gap-4 items-center group">
                <button
                    onClick={() => updateVolume(muted ? 1 : 0)}
                >
                    <VolumeIcon />
                </button>
                <div className="w-4 h-full absolute -right-4" />
                <input
                    type="range"
                    className="absolute -right-4 translate-x-full opacity-0 pointer-events-none transition py-8
                    group-hover:opacity-100 group-hover:pointer-events-auto"
                    min={0}
                    max={100}
                    ref={volumeControl}
                    onChange={(e) => {
                        const v = +e.target.value / 100
                        updateVolume(v)
                    }}
                />
            </div>
        </div>
    )
}
