import { fetchSongs } from "@/data/music"
import Songs from "@/app/music/songs/songs"
import MediaGridContainer from "@/app/music/components/media-grid-container"
import { Metadata } from "next"
import MediaGridSearch from "@/app/music/components/media-grid-search"

export const metadata: Metadata = {
    title: "Songs",
}

async function SongList({ search }: { search?: string }) {
    const data = await fetchSongs(undefined, search)
    return <Songs initialData={data} search={search} />
}

export default function SongsPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
    const { q } = searchParams
    return (
        <MediaGridContainer
            name="Songs"
            aside={<MediaGridSearch property="q" initialValue={q} placeholder="Search..." />}
        >
            <SongList search={q} />
        </MediaGridContainer>
    )
}
