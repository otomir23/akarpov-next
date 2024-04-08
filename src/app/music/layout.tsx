import { ReactNode, Suspense } from "react"
import MusicPlayer from "@/app/music/components/music-player"
import MusicControls from "@/app/music/components/music-controls"
import Link from "next/link"
import { AlbumIcon, LogInIcon, Music4Icon, UserIcon } from "lucide-react"
import { Metadata } from "next"
import { getSelf } from "@/data/user"
import Image from "next/image"

export const metadata: Metadata = {
    title: {
        absolute: "akarpov Music",
        template: "%s | akarpov Music",
    },
}

async function User() {
    const user = await getSelf()

    if (!user) return (
        <Link href="/auth">
            <LogInIcon />
        </Link>
    )

    if (!user.image)
        return <div className="w-6 h-6 rounded-full bg-neutral-500" />

    return (
        <Image src={user.image} width={24} height={24} className="w-6 h-6 rounded-full" alt="Your avatar" />
    )
}

export default function MusicLayout({ children }: { children: ReactNode }) {
    return (
        <MusicPlayer>
            <div className="w-screen h-screen overflow-hidden flex flex-col sm:flex-row">
                <MusicControls />
                <aside
                    className="flex sm:flex-col gap-4 p-4 sm:h-screen border-b sm:border-r sm:border-b-0
                    border-neutral-200 w-screen sm:w-auto"
                >
                    <Link href="/music/songs">
                        <Music4Icon />
                    </Link>
                    <Link href="/music/albums">
                        <AlbumIcon />
                    </Link>
                    <Link href="/music/authors">
                        <UserIcon />
                    </Link>
                    <div className="flex-1" />
                    <Suspense fallback={<div className="w-6 h-6 rounded-full bg-neutral-200 animate-pulse" />}>
                        <User />
                    </Suspense>
                </aside>
                <main className="p-6 sm:p-8 overflow-auto w-full h-full scroll-smooth pb-24 sm:pb-24">
                    {children}
                </main>
            </div>
        </MusicPlayer>
    )
}
