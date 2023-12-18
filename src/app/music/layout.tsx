import { ReactNode } from "react"
import MusicPlayer from "@/app/music/components/music-player"
import MusicControls from "@/app/music/components/music-controls"
import Link from "next/link"
import { AlbumIcon, Music4Icon, UserIcon } from "lucide-react"

export default function MusicLayout({ children }: { children: ReactNode }) {
    return (
        <MusicPlayer>
            <div className="w-screen h-screen overflow-hidden flex flex-col sm:flex-row">
                <MusicControls />
                <aside
                    className="flex sm:flex-col gap-4 p-4 sm:h-screen border-b sm:border-r sm:border-b-0
                    border-neutral-200 w-screen sm:w-auto"
                >
                    <Link href="/music/">
                        <Music4Icon />
                    </Link>
                    <Link href="/music/albums">
                        <AlbumIcon />
                    </Link>
                    <Link href="/music/authors">
                        <UserIcon />
                    </Link>
                </aside>
                <main className="p-8 overflow-auto w-full h-full scroll-smooth pb-24">
                    {children}
                </main>
            </div>
        </MusicPlayer>
    )
}
