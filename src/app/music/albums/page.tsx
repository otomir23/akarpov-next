import { fetchAlbums } from "@/data/music"
import Albums from "@/app/music/albums/albums"
import MediaGridContainer from "@/app/music/components/media-grid-container"
import { Metadata } from "next"
import MediaGridSearch from "@/app/music/components/media-grid-search"

export const metadata: Metadata = {
    title: "Albums",
}

async function AlbumList({ search }: { search?: string }) {
    const data = await fetchAlbums(undefined, search)
    return <Albums initialData={data} search={search} />
}

export default function AlbumsPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
    const { q } = searchParams
    return (
        <MediaGridContainer
            name="Albums"
            aside={<MediaGridSearch property="q" initialValue={q} placeholder="Search..." />}
        >
            <AlbumList search={q} />
        </MediaGridContainer>
    )
}
