"use client"

import MediaGrid from "@/app/music/components/media-grid"
import { fetchSongs } from "@/data/music"
import { useContext } from "react"
import { MusicPlayerContext, usePlayMediaTypes } from "@/app/music/components/music-player"

export default function Songs(
    { initialData, search }: { initialData: Awaited<ReturnType<typeof fetchSongs>>, search?: string }
) {
    const { playing, togglePlaying, currentSong } = useContext(MusicPlayerContext)
    const { playSong } = usePlayMediaTypes()

    return (
        <MediaGrid
            initialData={initialData}
            fetch={async page => fetchSongs(page, search)}
            onSwitch={(el) => { currentSong?.slug === el.slug ? togglePlaying() : playSong(el) }}
            isPlayingProvider={el => playing && currentSong?.slug === el.slug}
            linkProvider={el => `/music/albums/${el.album.slug}#${el.slug}`}
            altTextProvider={el => `"${el.album.name}" Album Art`}
        />
    )
}
