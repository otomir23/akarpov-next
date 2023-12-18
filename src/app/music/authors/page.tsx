import { fetchAuthors } from "@/data/music"
import Authors from "@/app/music/authors/authors"
import MediaGridContainer from "@/app/music/components/media-grid-container"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Authors",
}

async function AuthorList() {
    const data = await fetchAuthors()
    return <Authors initialData={data} />
}

export default function AuthorsPage() {
    return (
        <MediaGridContainer name="Authors">
            <AuthorList />
        </MediaGridContainer>
    )
}
