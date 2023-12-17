import { fetchAuthors } from "@/data/music"
import Authors from "@/app/music/authors/authors"
import MediaGridContainer from "@/app/music/components/media-grid-container"

async function AuthorList() {
    const data = await fetchAuthors()
    return <Authors initialData={data} />
}

export default function MusicCatalogue() {
    return (
        <MediaGridContainer name="Authors">
            <AuthorList />
        </MediaGridContainer>
    )
}
