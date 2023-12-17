import { fetchAlbums } from "@/data/music"
import Albums from "@/app/music/albums/albums"
import MediaGridContainer from "@/app/music/components/media-grid-container"

async function AlbumList() {
    const data = await fetchAlbums()
    return <Albums initialData={data} />
}

export default function MusicCatalogue() {
    return (
        <MediaGridContainer name="Albums">
            <AlbumList />
        </MediaGridContainer>
    )
}
