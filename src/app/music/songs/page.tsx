import { fetchSongs } from "@/data/music"
import Songs from "@/app/music/songs/songs"
import MediaGridContainer from "@/app/music/components/media-grid-container"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Songs",
}

async function SongList() {
    const data = await fetchSongs()
    return <Songs initialData={data} />
}

export default function SongsPage() {
    return (
        <MediaGridContainer name="Songs">
            <SongList />
        </MediaGridContainer>
    )
}
