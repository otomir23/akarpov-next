"use client"

import MediaGrid from "@/app/music/components/media-grid"
import { fetchAuthors } from "@/data/music"
import { useMemo, useCallback, useContext } from "react"
import { MusicPlayerContext, usePlayMediaTypes } from "@/app/music/components/music-player"

const convert = (data: Awaited<ReturnType<typeof fetchAuthors>>) => ({
    ...data,
    results: data.results.map(album => ({
        ...album,
        authors: [],
    })),
})

export default function Authors({ initialData }: { initialData: Awaited<ReturnType<typeof fetchAuthors>> }) {
    const { playing, togglePlaying, currentSong } = useContext(MusicPlayerContext)
    const { playAuthor } = usePlayMediaTypes()

    const convertedData = useMemo(() => convert(initialData), [initialData])

    const isPlaying = useCallback((slug: string) =>
        !!currentSong?.authors.find(a => a.slug === slug), [currentSong?.authors])

    return (
        <MediaGrid
            initialData={convertedData}
            fetch={p => fetchAuthors(p).then(convert)}
            onSwitch={(el) => { isPlaying(el.slug) ? togglePlaying() : playAuthor(el) }}
            isPlayingProvider={el => playing && isPlaying(el.slug)}
            linkProvider={el => `/music/authors/${el.slug}`}
            altTextProvider={el => `${el.name}'s Profile Image`}
            circles
        />
    )
}
