"use client"

import MediaGrid from "@/app/music/components/media-grid"
import { fetchAlbums } from "@/data/music"
import { useCallback, useContext } from "react"
import { MusicPlayerContext, usePlayMediaTypes } from "@/app/music/components/music-player"

export default function Albums({ initialData }: { initialData: Awaited<ReturnType<typeof fetchAlbums>> }) {
    const { playing, togglePlaying, currentSong } = useContext(MusicPlayerContext)
    const { playAlbum } = usePlayMediaTypes()

    const convert = useCallback((data: Awaited<ReturnType<typeof fetchAlbums>>) => ({
        ...data,
        results: data.results.map(album => ({
            ...album,
            authors: [],
        })),
    }), [])

    return (
        <MediaGrid
            initialData={convert(initialData)}
            fetch={p => fetchAlbums(p).then(convert)}
            onSwitch={(el) => { currentSong?.album.slug === el.slug ? togglePlaying() : playAlbum(el) }}
            isPlayingProvider={el => playing && currentSong?.album.slug === el.slug}
            linkProvider={el => `/music/albums/${el.slug}`}
            altTextProvider={el => `"${el.name}" Album Art`}
        />
    )
}
