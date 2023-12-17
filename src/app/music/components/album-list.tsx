"use client"

import { CatalogueAlbum } from "@/data/music"
import MediaList from "@/app/music/components/media-list"
import { useContext } from "react"
import { MusicPlayerContext, usePlayMediaTypes } from "@/app/music/components/music-player"

export default function AlbumList({ albums }: { albums: CatalogueAlbum[] }) {
    const { playing, togglePlaying, currentSong, switchTo } = useContext(MusicPlayerContext)
    const { playAlbum } = usePlayMediaTypes()

    return (
        <MediaList
            songs={albums}
            onSwitch={el => playAlbum(el)}
            isPlayingProvider={el => playing && currentSong?.album.slug === el.slug}
            linkProvider={el => `/music/albums/${el.slug}`}
        />
    )
}
