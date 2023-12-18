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
    PlayIcon,
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
        clear,
    } = useContext(MusicPlayerContext)
    const seekbar = useRef<HTMLDivElement>(null)
    const seekbarControl = useRef<HTMLInputElement>(null)
    const seekbarParent = useRef<HTMLLabelElement>(null)
    const [queueOpen, setQueueOpen] = useState(false)

    const updateSeekbar = useCallback((pos: number) => {
        if (!seekbar.current || !seekbarParent.current) return

        seekbar.current.style.width = `${pos * seekbarParent.current.clientWidth + 2}px`
    }, [])

    useEffect(() => {
        let lastFrame: number
        const update = () => {
            const { position } = requestMetadata()
            if (seekbarControl.current) seekbarControl.current.value = `${position * 1000}`
            updateSeekbar(position)
            lastFrame = requestAnimationFrame(update)
        }
        lastFrame = requestAnimationFrame(update)

        return () => cancelAnimationFrame(lastFrame)
    }, [requestMetadata, updateSeekbar])

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
                <div className="absolute left-0 h-2 bg-red-600" ref={seekbar} />
                <input
                    type="range"
                    min={0}
                    max={1000}
                    onChange={(e) => {
                        const v = +e.target.value / 1000
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
                    by {
                    currentSong.authors.map((a, i) => (
                        <Link href={`/music/authors/${a.slug}`} key={a.slug}>
                            {a.name}{i !== currentSong.authors.length - 1 && ", "}
                        </Link>
                    ))
                }
                </p>
            </div>
            <button onClick={previous}>
                <ChevronFirstIcon />
            </button>
            <button onClick={togglePlaying}>
                {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button onClick={next}>
                <ChevronLastIcon />
            </button>
            <Link href={currentSong.file} target="_blank">
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
        </div>
    )
}
