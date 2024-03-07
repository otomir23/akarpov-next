"use client"

import { Song } from "@/data/music"
import MediaList from "@/app/music/components/media-list"
import { useContext } from "react"
import { MusicPlayerContext } from "@/app/music/components/music-player"

export default function SongList(
    { songs, addIds, showCovers }: { songs: Song[], addIds?: boolean, showCovers?: boolean }
) {
    const { play, switchTo, playing, togglePlaying, currentSong } = useContext(MusicPlayerContext)
    return (
        <MediaList
            songs={songs}
            onSwitch={(el, i) => {
                if (currentSong?.slug === el.slug) {
                    togglePlaying()
                } else {
                    play(songs)
                    switchTo(i)
                }
            }}
            isPlayingProvider={el => playing && currentSong?.slug === el.slug}
            linkProvider={el => `/music/albums/${el.album.slug}#${el.slug}`}
            addIds={addIds}
            showCovers={showCovers}
        />
    )
}
