"use client"

import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { Volume2Icon, VolumeXIcon } from "lucide-react"
import { MusicPlayerContext } from "@/app/music/components/music-player"

export default function Volume() {
    const { updateVolume, requestMetadata } = useContext(MusicPlayerContext)

    const volumeControl = useRef<HTMLInputElement>(null)
    const [muted, setMuted] = useState(false)

    const VolumeIcon = muted ? VolumeXIcon : Volume2Icon

    const updateVolumeControl = useCallback((vol: number) => {
        if (!volumeControl.current) return

        volumeControl.current.value = `${vol * 100}`
    }, [])

    useEffect(() => {
        let lastFrame: number
        const update = () => {
            const { volume } = requestMetadata()

            updateVolumeControl(volume)
            setMuted(volume === 0)

            lastFrame = requestAnimationFrame(update)
        }
        lastFrame = requestAnimationFrame(update)

        return () => cancelAnimationFrame(lastFrame)
    }, [requestMetadata, updateVolumeControl])

    return (
        <div className="relative flex gap-4 items-center group">
            <button
                onClick={() => updateVolume(muted ? 1 : 0)}
            >
                <VolumeIcon />
            </button>
            <div className="w-4 h-full absolute -right-4" />
            <input
                type="range"
                className="absolute -right-4 translate-x-full opacity-0 pointer-events-none transition py-8
                group-hover:opacity-100 group-hover:pointer-events-auto"
                min={0}
                max={100}
                ref={volumeControl}
                onChange={(e) => {
                    const v = +e.target.value / 100
                    updateVolume(v)
                }}
            />
        </div>
    )
}
