"use client"

import { ReactNode } from "react"
import { useContextForMusicControls } from "@/app/music/components/music-controls"

export default function MusicControlsBarrier({ children }: { children: ReactNode }) {
    const { currentSong } = useContextForMusicControls()
    if (!currentSong) return null
    return children
}
