import { fetchAlbums } from "@/data/music"
import Albums from "@/app/music/albums/albums"
import MediaGridContainer from "@/app/music/components/media-grid-container"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Albums",
}

async function AlbumList() {
    const data = await fetchAlbums()
    return <Albums initialData={data} />
}

export default function AlbumsPage() {
    return (
        <MediaGridContainer name="Albums">
            <AlbumList />
        </MediaGridContainer>
    )
}
