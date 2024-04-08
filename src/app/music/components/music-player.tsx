"use client"

import { createContext, useState, ReactNode, useEffect, useRef, useCallback, useContext } from "react"
import { CatalogueAlbum, CatalogueAuthor, fetchAlbum, fetchAuthor, fetchSong, listen, Song } from "@/data/music"
import { shuffle } from "@/util"

type FrameMetadata = {
    playing: boolean,
    position: number,
    fullWaveform: readonly number[],
    volume: number,
}

type MusicPlayerContext = {
    currentSong: Song | null,
    queue: Song[],
    playing: boolean,
    looping: boolean,
    play: (queue: Song[]) => void,
    switchTo: (pos: number) => void,
    clear: () => void,
    next: () => void,
    previous: () => void,
    togglePlaying: () => void,
    seek: (position: number) => void,
    requestMetadata: () => FrameMetadata,
    updateVolume: (vol: number) => void,
    shuffleQueue: () => void,
    toggleLooping: () => void,
}

export const MusicPlayerContext = createContext<MusicPlayerContext>(null!)

export default function MusicPlayer({ children }: { children: ReactNode }) {
    const [currentSong, setCurrentSong] = useState<Song | null>(null)
    const [queue, setQueue] = useState<Song[]>([])
    const [queuePos, setQueuePos] = useState<number>(0)
    const [playing, setPlaying] = useState<boolean>(false)
    const [looping, setLooping] = useState<boolean>(false)
    const audio = useRef<HTMLAudioElement | null>(null)
    const lastMetadata = useRef<FrameMetadata>({
        playing: false,
        position: 0,
        fullWaveform: [],
        volume: 1,
    })
    const fullWaveform = useRef<number[] | null>(null)

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

    const next = useCallback(() => {
        queuePos >= queue.length - 1
            ? setQueuePos(0)
            : setQueuePos(q => q + 1)
    }, [queuePos, queue])
    const previous = useCallback(() => {
        if (queuePos === 0) seek(0)
        else setQueuePos(q => q - 1)
    }, [queuePos, seek])

    const updateVolume = useCallback((vol: number) => {
        if (audio.current) {
            audio.current.volume = vol
            localStorage.setItem("volume", `${vol}`)
        }
    }, [])

    const requestMetadata = useCallback(() => {
        const playing = !(audio.current?.paused ?? true)
        const position = (audio.current?.currentTime || 0) / (audio.current?.duration || 1)
        const volume = audio.current?.volume || 0
        if (lastMetadata.current.position === position
            && lastMetadata.current.playing === playing
            && lastMetadata.current.volume === volume
        )
            return lastMetadata.current

        const newMetadata = {
            playing,
            position,
            fullWaveform: fullWaveform.current || [],
            volume,
        }
        lastMetadata.current = newMetadata

        return newMetadata
    }, [])

    const shuffleQueue = useCallback(() => {
        setQueue([
            ...queue.slice(0, queuePos + 1),
            ...shuffle(queue.slice(queuePos + 1, queue.length)),
        ])
    }, [queue, queuePos])

    useEffect(() => {
        if (!currentSong) return

        const prevVolume = audio.current?.volume || parseFloat(localStorage.getItem("volume") || "") || 1

        console.log(`New audio - ${currentSong.name}`)
        const newAudio = new Audio(currentSong.file)

        fetchSong(currentSong.slug).then((r) => {
            if (!r) return
            fullWaveform.current = r.volume
        })

        // Explicit listen request voiding, because we don't care about the result
        void listen(currentSong.slug)

        audio.current = newAudio

        const stateChangeHandler = () => {
            setPlaying(!newAudio.paused)
        }
        newAudio.addEventListener("pause", stateChangeHandler)
        newAudio.addEventListener("play", stateChangeHandler)

        newAudio.volume = prevVolume
        newAudio.play().then()

        return () => {
            newAudio.pause()
            newAudio.removeEventListener("pause", stateChangeHandler)
            newAudio.removeEventListener("play", stateChangeHandler)
            fullWaveform.current = null
        }
    },
    // We don't want to change songs when we adjust the queue, only when the current song actually changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentSong]
    )

    useEffect(() => {
        const currAudio = audio.current
        if (!currAudio) return

        const endHandler = () => {
            if (!looping) return next()
            currAudio.currentTime = 0
            void currAudio.play()
        }
        currAudio.addEventListener("ended", endHandler)

        return () => {
            currAudio.removeEventListener("ended", endHandler)
        }
    }, [currentSong, looping, next])

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
                looping,
                toggleLooping: () => setLooping(l => !l),
                switchTo: setQueuePos,
                clear,
                next,
                previous,
                togglePlaying: () => setPlaying(p => !p),
                seek,
                requestMetadata,
                updateVolume,
                shuffleQueue,
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
