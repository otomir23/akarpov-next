"use client"

import { createContext, useState, ReactNode, useEffect, useRef, useCallback, useContext } from "react"
import { CatalogueAlbum, CatalogueAuthor, fetchAlbum, fetchAuthor, Song } from "@/data/music"

type MusicPlayerContext = {
    currentSong: Song | null,
    queue: Song[],
    playing: boolean,
    play: (queue: Song[]) => void,
    switchTo: (pos: number) => void,
    clear: () => void,
    next: () => void,
    previous: () => void,
    togglePlaying: () => void,
    seek: (position: number) => void,
    requestMetadata: () => { position: number },
}

export const MusicPlayerContext = createContext<MusicPlayerContext>(null!)

export default function MusicPlayer({ children }: { children: ReactNode }) {
    const [currentSong, setCurrentSong] = useState<Song | null>(null)
    const [queue, setQueue] = useState<Song[]>([])
    const [queuePos, setQueuePos] = useState<number>(0)
    const [playing, setPlaying] = useState<boolean>(false)
    const audio = useRef<HTMLAudioElement | null>(null)

    const play = useCallback((queue: Song[]) => {
        setQueue(queue)
        setQueuePos(0)
    }, [])

    const clear = useCallback(() => {
        setCurrentSong(null)
        setPlaying(false)
    }, [])

    const seek = useCallback((pos: number) => {
        if (!audio.current) return
        audio.current.currentTime = pos * audio.current.duration
    }, [])

    const next = useCallback(() => setQueuePos(q => q + 1), [])
    const previous = useCallback(() => {
        if (queuePos === 0) seek(0)
        else setQueuePos(q => q - 1)
    }, [queuePos, seek])

    const requestMetadata = useCallback(() => ({
        position: (audio.current?.currentTime || 0) / (audio.current?.duration || 1),
    }), [])

    useEffect(() => {
        if (!currentSong) return

        console.log(`New audio - ${currentSong.name}`)
        const newAudio = new Audio(currentSong.file)

        audio.current = newAudio

        const endHandler = () => {
            queuePos >= queue.length - 1
                ? setPlaying(false)
                : next()
        }
        newAudio.addEventListener("ended", endHandler)

        const stateChangeHandler = () => {
            setPlaying(!newAudio.paused)
        }
        newAudio.addEventListener("pause", stateChangeHandler)
        newAudio.addEventListener("play", stateChangeHandler)

        newAudio.play().then()

        return () => {
            newAudio.pause()
            newAudio.removeEventListener("ended", endHandler)
            newAudio.removeEventListener("pause", stateChangeHandler)
            newAudio.removeEventListener("play", stateChangeHandler)
        }
    },
    // We don't want to change songs when we adjust the queue, only when the current song actually changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentSong]
    )

    useEffect(() => {
        playing ? audio.current?.play() : audio.current?.pause()
    }, [playing])

    useEffect(() => {
        if (queuePos >= queue.length || queuePos < 0) return clear()
        setCurrentSong(queue[queuePos])
        setPlaying(true)
    }, [queue, queuePos, clear])

    return (
        <MusicPlayerContext.Provider
            value={{
                currentSong,
                queue,
                playing,
                play,

                switchTo: setQueuePos,
                clear,
                next,
                previous,
                togglePlaying: () => setPlaying(p => !p),
                seek,
                requestMetadata,
            }}
        >
            {children}
        </MusicPlayerContext.Provider>
    )
}

export const usePlayMediaTypes = () => {
    const { play } = useContext(MusicPlayerContext)

    const playSong = useCallback(async (song: Song) => play([song]), [play])

    const playAlbum = useCallback(async ({ slug }: CatalogueAlbum) => {
        const data = await fetchAlbum(slug)
        if (!data) return
        play(data.songs)
    }, [play])

    const playAuthor = useCallback(async ({ slug }: CatalogueAuthor) => {
        const data = await fetchAuthor(slug)
        if (!data) return
        play(data.songs)
    }, [play])

    return {
        playSong,
        playAlbum,
        playAuthor,
    }
}
