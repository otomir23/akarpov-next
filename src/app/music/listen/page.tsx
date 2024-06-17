"use client"

import { useContext } from "react"
import { MusicPlayerContext } from "@/app/music/components/music-player"
import {
    ChevronFirstIcon,
    ChevronLastIcon, DownloadIcon,
    ListXIcon,
    PauseIcon,
    PlayIcon,
    Repeat1Icon, RepeatIcon,
    ShuffleIcon,
    XIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Queue from "@/app/music/components/queue"
import Link from "next/link"
import Seekbar from "@/app/music/components/seekbar"
import Volume from "@/app/music/components/volume"

export default function NowPlaying() {
    const {
        playing,
        next,
        previous,
        togglePlaying,
        currentSong,
        clear,
        shuffleQueue,
        toggleLooping,
        looping,
    } = useContext(MusicPlayerContext)
    const router = useRouter()

    return (
        <div className="w-full">
            <button onClick={() => router.back()}>
                <XIcon />
            </button>
            {currentSong ? (
                <div className="flex flex-col lg:flex-row w-full gap-8 py-6 max-lg:items-center lg:p-12">
                    <div className="w-fit flex flex-col gap-1">
                        {
                            currentSong.image_cropped ? (
                                <Image
                                    src={currentSong.image_cropped}
                                    height={384}
                                    width={384}
                                    className="object-cover w-96 h-96 aspect-square rounded mb-4"
                                    alt={`"${currentSong.album.name}" Album Art`}
                                />
                            ) : <div className="rounded bg-neutral-300 w-16 aspect-square mb-4" />
                        }
                        <div className="relative mt-4 mb-2">
                            <Seekbar />
                        </div>
                        <Link
                            href={`/music/albums/${currentSong.album.slug}#${currentSong.slug}`}
                            className="font-semibold text-2xl"
                        >
                            {currentSong.name}
                        </Link>
                        <p className="text-lg text-neutral-800">
                            {currentSong.authors.map((a, i) => (
                                <Link href={`/music/authors/${a.slug}`} key={a.slug}>
                                    {a.name}{i !== currentSong.authors.length - 1 && ", "}
                                </Link>
                            ))}
                        </p>
                        <div className="w-full flex gap-4 mt-6 items-center">
                            <Link href={currentSong.file} target="_blank">
                                <DownloadIcon />
                            </Link>
                            <div className="grow" />
                            <button onClick={previous}>
                                <ChevronFirstIcon size={48} />
                            </button>
                            <button onClick={togglePlaying}>
                                {playing ? <PauseIcon size={48} /> : <PlayIcon size={48} />}
                            </button>
                            <button onClick={next}>
                                <ChevronLastIcon size={48} />
                            </button>
                            <div className="grow" />
                            <Volume />
                        </div>
                    </div>
                    <div className="flex-1 max-lg:max-w-[24rem] w-full lg:h-[48rem] lg:overflow-y-auto">
                        <div className="flex items-center sticky top-0 left-0 z-10 bg-white pb-2 gap-4">
                            <h2 className="font-bold text-xl">Queue</h2>
                            <div className="flex-1" />
                            <button
                                onClick={() => {
                                    clear()
                                    router.back()
                                }}
                            >
                                <ListXIcon />
                            </button>
                            <button onClick={shuffleQueue}>
                                <ShuffleIcon />
                            </button>
                            <button onClick={toggleLooping}>
                                {looping ? <Repeat1Icon /> : <RepeatIcon />}
                            </button>
                        </div>
                        <Queue />
                    </div>
                </div>
            ) : <p className="font-bold text-sm animate-pulse">Nothing playing.</p>}
        </div>
    )
}
