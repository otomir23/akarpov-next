"use client"

import MediaGrid from "@/app/music/components/media-grid"
import { fetchAlbums } from "@/data/music"
import { useContext, useMemo } from "react"
import { MusicPlayerContext, usePlayMediaTypes } from "@/app/music/components/music-player"

const convert = (data: Awaited<ReturnType<typeof fetchAlbums>>) => ({
    ...data,
    results: data.results.map(album => ({
        ...album,
        authors: [],
    })),
})

export default function Albums(
    { initialData, search }: { initialData: Awaited<ReturnType<typeof fetchAlbums>>, search?: string }
) {
    const { playing, togglePlaying, currentSong } = useContext(MusicPlayerContext)
    const { playAlbum } = usePlayMediaTypes()

    const convertedData = useMemo(() => convert(initialData), [initialData])

    return (
        <MediaGrid
            initialData={convertedData}
            fetch={p => fetchAlbums(p, search).then(convert)}
            onSwitch={(el) => { currentSong?.album.slug === el.slug ? togglePlaying() : playAlbum(el) }}
            isPlayingProvider={el => playing && currentSong?.album.slug === el.slug}
            linkProvider={el => `/music/albums/${el.slug}`}
            altTextProvider={el => `"${el.name}" Album Art`}
        />
    )
}
