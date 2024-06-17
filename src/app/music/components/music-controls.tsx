"use client"

import { useContext } from "react"
import { MusicPlayerContext } from "@/app/music/components/music-player"
import Image from "next/image"
import Link from "next/link"
import {
    ChevronFirstIcon,
    ChevronLastIcon,
    DownloadIcon,
    ChevronUpIcon,
    PauseIcon,
    PlayIcon,
} from "lucide-react"
import Volume from "@/app/music/components/volume"
import Seekbar from "@/app/music/components/seekbar"
import { usePathname } from "next/navigation"

export function useContextForMusicControls() {
    const { currentSong, ...ctx } = useContext(MusicPlayerContext)
    const path = usePathname()
    if (path === "/music/listen")
        return { ...ctx, currentSong: null }
    return { ...ctx, currentSong }
}

export default function MusicControls() {
    const {
        playing,
        next,
        previous,
        togglePlaying,
        currentSong,
    } = useContextForMusicControls()

    if (!currentSong) return null
    return (
        <div
            className="fixed inset-x-0 bottom-0 w-full flex gap-4 justify-center items-center p-3 z-40
            after:backdrop-blur-lg after:bg-white/90 after:absolute after:inset-0 after:-z-10"
        >
            <Seekbar />
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
            <Volume />
            <Link href="/music/listen">
                <ChevronUpIcon />
            </Link>
        </div>
    )
}
