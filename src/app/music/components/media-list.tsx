"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export type SongListElement = {
    slug: string,
    name: string,
}

type Props<E extends SongListElement> = {
    songs: E[],
    onSwitch: (el: E, i: number) => void,
    isPlayingProvider: (el: E) => boolean,
    linkProvider: (el: E) => string,
    addIds?: boolean,
}

export default function MediaList<E extends SongListElement>(
    { songs, onSwitch, isPlayingProvider, linkProvider, addIds }: Props<E>
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
                    className={`rounded-lg py-2 px-4 hover:bg-neutral-200 transition-colors flex gap-2 items-center
                    ${hash === `#${el.slug}` && addIds ? "bg-neutral-100" : ""}`}
                >
                    <button onClick={() => onSwitch(el, i)}>
                        {isPlayingProvider(el) ? "❚❚" : "▶"}
                    </button>
                    <Link href={linkProvider(el)}>
                        {el.name}
                    </Link>
                </div>
            ))}
        </div>
    )
}
