import { fetchSongs } from "@/data/music"
import Songs from "@/app/music/songs"
import MediaGridContainer from "@/app/music/components/media-grid-container"

async function SongList() {
    const data = await fetchSongs()
    return <Songs initialData={data} />
}

export default function MusicCatalogue() {
    return (
        <MediaGridContainer name="Songs">
            <SongList />
        </MediaGridContainer>
    )
}
