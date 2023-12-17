"use client"

import MediaList from "@/app/music/components/media-list"
import { useContext } from "react"
import { MusicPlayerContext } from "@/app/music/components/music-player"

export default function Queue() {
    const { queue, switchTo, playing, currentSong, togglePlaying } = useContext(MusicPlayerContext)

    return (
        <MediaList
            songs={queue}
            onSwitch={(el, i) => currentSong?.slug === el.slug ? togglePlaying() : switchTo(i)}
            isPlayingProvider={el => playing && currentSong?.slug === el.slug}
            linkProvider={el => `/music/albums/${el.album.slug}#${el.slug}`}
        />
    )
}
