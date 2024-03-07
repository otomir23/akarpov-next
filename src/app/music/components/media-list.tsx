"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"

export type SongListElement = {
    slug: string,
    name: string,
    image_cropped: string | null,
}

type Props<E extends SongListElement> = {
    songs: E[],
    onSwitch: (el: E, i: number) => void,
    isPlayingProvider: (el: E) => boolean,
    linkProvider: (el: E) => string,
    addIds?: boolean,
    showCovers?: boolean,
}

export default function MediaList<E extends SongListElement>(
    { songs, onSwitch, isPlayingProvider, linkProvider, addIds, showCovers = true }: Props<E>
) {
    const [hash, setHash] = useState("")
    const params = useParams()

    useEffect(() => {
        setHash(window.location.hash)
    }, [params])

    return (
        <div className="flex flex-col gap-1">
            {songs.map((el, i) => (
                <div
                    key={el.slug}
                    id={addIds ? el.slug : undefined}
                    className={`rounded-lg py-2 hover:bg-neutral-200 transition-colors flex items-center
                    ${hash === `#${el.slug}` && addIds ? "bg-neutral-100" : ""}
                    ${showCovers ? "px-2 gap-3" : "px-4 gap-4"}`}
                >
                    <button
                        className={`relative ${showCovers ? "w-full max-w-[32px]" : ""}`}
                        onClick={() => onSwitch(el, i)}
                    >
                        {
                            showCovers && (el.image_cropped ? (
                                <Image
                                    src={el.image_cropped}
                                    height={32}
                                    width={32}
                                    className="object-cover w-8 aspect-square rounded"
                                    alt=""
                                />
                            ) : <div className="bg-neutral-300 w-full max-w-[32px] aspect-square rounded" />)
                        }
                        <div
                            className={`absolute inset-0 hover:opacity-100 bg-black/50 transition-opacity rounded
                            flex items-center justify-center ${showCovers ? "text-white opacity-0" : ""}`}
                        >
                            {isPlayingProvider(el) ? "❚❚" : "▶"}
                        </div>
                    </button>
                    <Link href={linkProvider(el)}>
                        {el.name}
                    </Link>
                </div>
            ))}
        </div>
    )
}
